import React, { useEffect, useMemo, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import moment from "moment";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";

import { PRODUCT_API, REPORT_API, VENDOR_API } from "@/constants/apiConstants";
import { useApiMutation } from "@/hooks/useApiMutation";
import { useGetApiMutation } from "@/hooks/useGetApiMutation";

const PurchaseProductReport = () => {
  const containerRef = useRef(null);

  const [reportData, setReportData] = useState([]);
  const [fromDate, setFromDate] = useState(
    moment().startOf("month").format("YYYY-MM-DD")
  );
  const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedVendor, setSelectedVendor] = useState("");

  const { data: productMaster } = useGetApiMutation({
    url: PRODUCT_API.active,
    queryKey: ["products"],
  });

  const { data: vendorMaster } = useGetApiMutation({
    url: VENDOR_API.active,
    queryKey: ["vendors"],
  });

  const { trigger: fetchReport, loading: isLoading } = useApiMutation();
  useEffect(() => {
    const getReport = async () => {
      try {
        const res = await fetchReport({
          url: REPORT_API.purchaseProductReport,
          method: "post",
          data: {
            from_date: fromDate,
            to_date: toDate,
            vendor_id: selectedVendor || undefined,
            product_id: selectedProduct || undefined,
          },
        });

        setReportData(res?.data || []);
      } catch (error) {
        console.error("Purchase report fetch failed", error);
        setReportData([]);
      }
    };

    getReport();
  }, [fromDate, toDate, selectedVendor, selectedProduct]);
  const groupedData = useMemo(() => {
    if (!Array.isArray(reportData)) return {};

    return reportData.reduce((acc, item) => {
      const vendor = item.vendor_name || "Unknown Vendor";
      const qty = Number(item.purchase_p_sub_qnty || 0);

      if (!acc[vendor]) {
        acc[vendor] = {
          items: [],
          totalQty: 0,
        };
      }

      acc[vendor].items.push({
        ...item,
        qty,
      });

      acc[vendor].totalQty += qty;

      return acc;
    }, {});
  }, [reportData]);
  const productsWithAll = useMemo(() => {
    const products = productMaster?.data || [];
    return [{ id: "__ALL__", product_name: "All Products" }, ...products];
  }, [productMaster]);

  const vendorsWithAll = useMemo(() => {
    const vendors = vendorMaster?.data || [];
    return [{ id: "__ALL__", vendor_name: "All Vendors" }, ...vendors];
  }, [vendorMaster]);
  const handlePrintPdf = useReactToPrint({
    content: () => containerRef.current,
    documentTitle: "Purchase_Product_Report",
    pageStyle: `
      @page {
        size: A4 portrait;
        margin: 5mm;
      }
      @media print {
        .print-hide {
          display: none;
        }
        table {
          font-size: 11px;
        }
      }
    `,
  });

  return (
    <div className="p-4 space-y-4">
      <Card className="p-6">
        <h2 className="font-bold mb-4">Purchase Product Report</h2>

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

          <div className="min-w-[220px]">
            <label className="block text-sm font-medium mb-1">Vendor</label>
            <Select
              value={selectedVendor || "__ALL__"}
              onValueChange={(value) =>
                setSelectedVendor(value === "__ALL__" ? "" : value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All Vendors" />
              </SelectTrigger>
              <SelectContent>
                {vendorsWithAll.map((v) => (
                  <SelectItem key={v.id} value={String(v.id)}>
                    {v.vendor_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Product Select */}
          <div className="min-w-[220px]">
            <label className="block text-sm font-medium mb-1">Product</label>
            <Select
              value={selectedProduct || "__ALL__"}
              onValueChange={(value) =>
                setSelectedProduct(value === "__ALL__" ? "" : value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All Products" />
              </SelectTrigger>
              <SelectContent>
                {productsWithAll.map((p) => (
                  <SelectItem key={p.id} value={String(p.id)}>
                    {p.product_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handlePrintPdf}>Print PDF</Button>
        </div>
      </Card>

      <div ref={containerRef} className="p-6">
        <h2 className="font-bold hidden print:block text-xl mb-4">
          Purchase Product Report
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-black text-sm">
            <thead className="bg-gray-100">
              <tr>
                {[
                  "Purchase Date",
                  "Bill Ref",
                  "Product Name",
                  "Category",
                  "Quantity",
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
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    Loading...
                  </td>
                </tr>
              ) : Object.keys(groupedData).length > 0 ? (
                Object.entries(groupedData).map(
                  ([vendor, vendorData], vIndex) => (
                    <React.Fragment key={vIndex}>
                      <tr className="bg-gray-200 font-semibold">
                        <td
                          colSpan={5}
                          className="border border-black px-2 py-2 pl-6"
                        >
                          Vendor: {vendor}
                        </td>
                      </tr>

                      {vendorData.items.map((row, index) => (
                        <tr key={index}>
                          <td className="border border-black px-2 py-2 text-center">
                            {moment(row.purchase_p_date).format("DD-MM-YYYY")}
                          </td>
                          <td className="border border-black px-2 py-2 text-center">
                            {row.purchase_p_bill_ref || "-"}
                          </td>
                          <td className="border border-black px-2 py-2">
                            {row.product_name}
                          </td>
                          <td className="border border-black px-2 py-2 text-center">
                            {row.product_category}
                          </td>
                          <td className="border border-black px-2 py-2 text-right">
                            {row.qty}
                          </td>
                        </tr>
                      ))}
                    </React.Fragment>
                  )
                )
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-4">
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

export default PurchaseProductReport;
