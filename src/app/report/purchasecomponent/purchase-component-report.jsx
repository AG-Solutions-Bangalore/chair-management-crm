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

import {
  REPORT_API,
  VENDOR_API,
  COMPONENTS_API,
} from "@/constants/apiConstants";

import { useApiMutation } from "@/hooks/useApiMutation";
import { useGetApiMutation } from "@/hooks/useGetApiMutation";

const PurchaseComponentReport = () => {
  const containerRef = useRef(null);

  const [reportData, setReportData] = useState([]);
  const [fromDate, setFromDate] = useState(
    moment().startOf("month").format("YYYY-MM-DD")
  );
  const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [selectedVendor, setSelectedVendor] = useState("");
  const [selectedComponent, setSelectedComponent] = useState("");



  const { data: vendorMaster } = useGetApiMutation({
    url: VENDOR_API.active,
    queryKey: ["vendors"],
  });

  const { data: componentMaster } = useGetApiMutation({
    url: COMPONENTS_API.active,
    queryKey: ["component-active"],
  });

  const { trigger: fetchReport, loading: isLoading } = useApiMutation();

  useEffect(() => {
    const getReport = async () => {
      try {
        const res = await fetchReport({
          url: REPORT_API.purchaseComponentReport,
          method: "post",
          data: {
            from_date: fromDate,
            to_date: toDate,
            vendor_id: selectedVendor || undefined,
            component_id: selectedComponent || undefined,
          },
        });

        setReportData(res?.data || []);
      } catch (error) {
        console.error("Purchase Component report fetch failed", error);
        setReportData([]);
      }
    };

    getReport();
  }, [fromDate, toDate, selectedVendor, selectedComponent]);


  const groupedData = useMemo(() => {
    if (!Array.isArray(reportData)) return {};

    return reportData.reduce((acc, item) => {
      const vendor = item.vendor_name || "Unknown Vendor";
      const qty = Number(item.purchase_c_sub_qnty || 0);

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

  const vendorsWithAll = useMemo(() => {
    const vendors = vendorMaster?.data || [];
    return [{ id: "__ALL__", vendor_name: "All Vendors" }, ...vendors];
  }, [vendorMaster]);

  const componentsWithAll = useMemo(() => {
    const components = componentMaster?.data || [];
    return [{ id: "__ALL__", component_name: "All Components" }, ...components];
  }, [componentMaster]);

  const handlePrintPdf = useReactToPrint({
    content: () => containerRef.current,
    documentTitle: "Purchase_Component_Report",
  });

  return (
    <div className="p-4 space-y-4">
      <Card className="p-6">
        <h2 className="font-bold mb-4">Purchase Component Report</h2>

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

          <div className="min-w-[220px]">
            <label className="block text-sm font-medium mb-1">Component</label>
            <Select
              value={selectedComponent || "__ALL__"}
              onValueChange={(value) =>
                setSelectedComponent(value === "__ALL__" ? "" : value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All Components" />
              </SelectTrigger>
              <SelectContent>
                {componentsWithAll.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.component_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handlePrintPdf}>Print PDF</Button>
        </div>
      </Card>

      <div ref={containerRef} className="p-6">
        <h2 className="font-bold text-xl mb-4 text-center hidden print:block">
          Purchase Component Report
        </h2>

        <table className="w-full border-collapse border border-black text-sm">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className="border border-black px-2 py-2">Date</th>
              <th className="border border-black px-2 py-2">Bill Ref</th>
              <th className="border border-black px-2 py-2">Component</th>
              <th className="border border-black px-2 py-2">Category</th>
              <th className="border border-black px-2 py-2">Brand</th>
              <th className="border border-black px-2 py-2">Unit</th>
              <th className="border border-black px-2 py-2 text-right">
                Quantity
              </th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : Object.keys(groupedData).length > 0 ? (
              Object.entries(groupedData).map(
                ([vendor, vendorData], vIndex) => (
                  <React.Fragment key={vIndex}>
                    <tr className="bg-gray-200 font-semibold">
                      <td colSpan={7} className="border border-black px-2 py-2">
                        Vendor: {vendor}
                      </td>
                    </tr>

                    {vendorData.items.map((row, index) => (
                      <tr key={index}>
                        <td className="border  border-black  px-2 py-2 text-center">
                          {moment(row.purchase_c_date).format("DD-MM-YYYY")}
                        </td>
                        <td className="border border-black  px-2 py-2 text-center">
                          {row.purchase_c_bill_ref || "-"}
                        </td>
                        <td className="border border-black  px-2 py-2">
                          {row.component_name}
                        </td>
                        <td className="border border-black  px-2 py-2 text-center">
                          {row.component_category}
                        </td>
                        <td className="border border-black  px-2 py-2 text-center">
                          {row.component_brand}
                        </td>
                        <td className="border border-black  px-2 py-2 text-center">
                          {row.component_unit}
                        </td>
                        <td className="border border-black  px-2 py-2 text-right">
                          {row.qty}
                        </td>
                      </tr>
                    ))}
                  </React.Fragment>
                )
              )
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
  );
};

export default PurchaseComponentReport;
