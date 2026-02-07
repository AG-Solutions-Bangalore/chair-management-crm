import moment from "moment";
import { useEffect, useMemo, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import {
  COMPONENTS_API,
  PRODUCT_API,
  REPORT_API,
} from "@/constants/apiConstants";
import { useApiMutation } from "@/hooks/useApiMutation";
import { useGetApiMutation } from "@/hooks/useGetApiMutation";

const ComponentStockReport = () => {
  const containerRef = useRef(null);
  const [productReport, setProductReport] = useState([]);
  const [fromDate, setFromDate] = useState(
    moment().startOf("month").format("YYYY-MM-DD")
  );
  const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [selectedProduct, setSelectedProduct] = useState("");

  const { data: componentData, isLoading: loadingComponent } =
    useGetApiMutation({
      url: COMPONENTS_API.active,
      queryKey: ["component-active"],
    });
  const componentWithAll = useMemo(() => {
    const products = componentData?.data || [];

    return [{ id: "__ALL__", component_name: "All Component" }, ...products];
  }, [componentData]);

  const { trigger: fetchReport, loading: isLoading } = useApiMutation();

  useEffect(() => {
    const getReport = async () => {
      try {
        const res = await fetchReport({
          url: REPORT_API.componentstock,
          method: "post",
          data: {
            from_date: fromDate,
            to_date: toDate,
            component_id: selectedProduct || undefined,
          },
        });

        setProductReport(res?.data || []);
      } catch (error) {
        console.error("Report fetch failed", error);
        setProductReport([]);
      }
    };

    getReport();
  }, [fromDate, toDate, selectedProduct]);

  const tableData = useMemo(() => {
    if (!Array.isArray(productReport)) return [];

    return productReport.map((p) => {
      const openingStock =
        Number(p.openpurch || 0) +
        Number(p.openproduction || 0) -
        Number(p.dispatchorder || 0);

      const closingStock =
        openingStock +
        Number(p.purch || 0) +
        Number(p.production || 0) -
        Number(p.dispatch || 0);

      return {
        ...p,
        openingStock,
        closingStock,
      };
    });
  }, [productReport]);
  const renderNumber = (value) => {
    const num = Number(value || 0);
    return (
      <span className={num < 0 ? "text-red-600 font-semibold" : ""}>{num}</span>
    );
  };
  const handlePrintPdf = useReactToPrint({
    content: () => containerRef.current,
    documentTitle: "Product_Stock_Report",
    pageStyle: `
    @page {
      size: A4 portrait;
      margin: 5mm;
    }
    @media print {
      body {
        font-size: 10px;
        margin: 0mm;
        padding: 0mm;
      }
      table {
        font-size: 11px;
      }
      .print-hide {
        display: none;
      }
    }
    `,
  });

  return (
    <div className="p-4 space-y-4">
      <Card className="p-6">
        <h2 className="font-bold mb-2 ml-2">Component Stock Report</h2>
        <div className="flex flex-wrap gap-4 items-end print-hide">
          <div>
            <label className="block text-sm font-medium mb-1">From Date</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="border px-2 py-1 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">To Date</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="border px-2 py-1 rounded"
            />
          </div>

          <div className="min-w-[240px]">
            <label className="block text-sm font-medium mb-1">Component</label>
            <Select
              value={selectedProduct || "__ALL__"}
              onValueChange={(value) =>
                setSelectedProduct(value === "__ALL__" ? "" : value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Component" />
              </SelectTrigger>
              <SelectContent>
                {componentWithAll?.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.component_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handlePrintPdf}>Print PDF</Button>
        </div>
      </Card>
      <div ref={containerRef}>
        <h2 className="font-bold hidden print:block text-xl">
          Component Stock Report
        </h2>
        <div className="mx-2 flex justify-center">
          <table className="w-full border-collapse border max-w-6xl border-black">
            <thead className="bg-gray-100">
              <tr>
                {[
                  "Component Name",
                  "Category",
                  "Opening Stock",
                  "Purchase",
                  "Production",
                  "Dispatch",
                  "Closing Stock",
                ].map((h) => (
                  <th
                    key={h}
                    className="border border-black px-2 py-2 text-center"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loadingComponent || isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-4">
                    Loading...
                  </td>
                </tr>
              ) : tableData.length > 0 ? (
                tableData.map((row, index) => (
                  <tr
                    key={index}
                    className={row.closingStock < 0 ? "bg-red-200" : ""}
                  >
                    <td className="border border-black px-2 py-2">
                      {row.component_name}
                    </td>
                    <td className="border border-black px-2 py-2 text-center">
                      {row.component_category}
                    </td>
                    <td className="border border-black px-2 py-2 text-right">
                      {renderNumber(row.openingStock)}
                    </td>
                    <td className="border border-black px-2 py-2 text-right">
                      {row.purch}
                    </td>
                    <td className="border border-black px-2 py-2 text-right">
                      {row.production}
                    </td>
                    <td className="border border-black px-2 py-2 text-right">
                      {row.dispatch}
                    </td>
                    <td className="border border-black px-2 py-2 text-right">
                      {renderNumber(row.closingStock)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-4">
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ComponentStockReport;
