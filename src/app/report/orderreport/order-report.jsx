import moment from "moment";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { PRODUCT_API, REPORT_API, VENDOR_API } from "@/constants/apiConstants";

import { ORDER_STATUSES } from "@/constants/orderConstants";
import { useApiMutation } from "@/hooks/useApiMutation";
import { useGetApiMutation } from "@/hooks/useGetApiMutation";

const OrderReport = () => {
  const containerRef = useRef(null);

  const [reportData, setReportData] = useState([]);
  const [fromDate, setFromDate] = useState(
    moment().startOf("month").format("YYYY-MM-DD")
  );
  const [toDate, setToDate] = useState(moment().format("YYYY-MM-DD"));
  const [selectedVendor, setSelectedVendor] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const { data: vendorMaster } = useGetApiMutation({
    url: VENDOR_API.active,
    queryKey: ["vendors"],
  });

  const { data: productMaster } = useGetApiMutation({
    url: PRODUCT_API.active,
    queryKey: ["products"],
  });

  const { trigger: fetchReport, loading: isLoading } = useApiMutation();

  useEffect(() => {
    const getReport = async () => {
      try {
        const res = await fetchReport({
          url: REPORT_API.orderReport,
          method: "post",
          data: {
            from_date: fromDate,
            to_date: toDate,
            vendor_id: selectedVendor || undefined,
            product_id: selectedProduct || undefined,
            order_status: selectedStatus || undefined,
          },
        });

        setReportData(res?.data || []);
      } catch (error) {
        console.error("Order report fetch failed", error);
        setReportData([]);
      }
    };

    getReport();
  }, [fromDate, toDate, selectedVendor, selectedProduct, selectedStatus]);

  const groupedData = useMemo(() => {
    if (!Array.isArray(reportData)) return {};

    return reportData.reduce((acc, item) => {
      const vendor = item.vendor_name || "Unknown Vendor";
      const qty = Number(item.order_p_sub_qnty || 0);

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

  const productsWithAll = useMemo(() => {
    const products = productMaster?.data || [];
    return [{ id: "__ALL__", product_name: "All Products" }, ...products];
  }, [productMaster]);
  const handlePrintPdf = useReactToPrint({
    content: () => containerRef.current,
    documentTitle: "Order_Report",
  });

  return (
    <div className="p-4 space-y-4">
      <Card className="p-6">
        <h2 className="font-bold mb-4">Order Report</h2>

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

          <div className="min-w-[200px]">
            <label className="block text-sm font-medium mb-1">Vendor</label>
            <Select
              value={selectedVendor || "__ALL__"}
              onValueChange={(val) =>
                setSelectedVendor(val === "__ALL__" ? "" : val)
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

          <div className="min-w-[200px]">
            <label className="block text-sm font-medium mb-1">Product</label>
            <Select
              value={selectedProduct || "__ALL__"}
              onValueChange={(val) =>
                setSelectedProduct(val === "__ALL__" ? "" : val)
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

          <div className="min-w-[200px]">
            <label className="block text-sm font-medium mb-1">
              Order Status
            </label>
            <Select
              value={selectedStatus || "__ALL__"}
              onValueChange={(val) =>
                setSelectedStatus(val === "__ALL__" ? "" : val)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__ALL__">All Status</SelectItem>
                {ORDER_STATUSES.map((u) => (
                  <SelectItem key={u.id} value={u.value}>
                    {u.value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handlePrintPdf}>Print PDF</Button>
        </div>
      </Card>

      <Card className="p-6 h-[600px] overflow-y-auto">
        <div ref={containerRef}>
          <h2 className="font-bold text-xl mb-4 text-center hidden print:block">
            Order Report
          </h2>

          <table className="w-full border-collapse border border-black text-sm">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                <th className="border border-black px-2 py-2 text-center">
                  Order Ref
                </th>
                <th className="border border-black px-2 py-2 text-center">
                  Order Date
                </th>
                <th className="border border-black px-2 py-2 text-center">
                  Delivery Date
                </th>
                <th className="border border-black px-2 py-2 text-center">
                  Product
                </th>
                <th className="border border-black px-2 py-2 text-center">
                  Category
                </th>
                <th className="border border-black px-2 py-2 text-center">
                  Status
                </th>
                <th className="border border-black px-2 py-2 text-right">
                  Quantity
                </th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="border border-black text-center py-4"
                  >
                    Loading...
                  </td>
                </tr>
              ) : Object.keys(groupedData).length > 0 ? (
                Object.entries(groupedData).map(
                  ([vendor, vendorData], vIndex) => (
                    <React.Fragment key={vIndex}>
                      <tr className="bg-gray-200 font-semibold">
                        <td
                          colSpan={7}
                          className="border border-black px-2 py-2"
                        >
                          Vendor: {vendor}
                        </td>
                      </tr>
                      {vendorData.items.map((row, index) => (
                        <tr key={index}>
                          <td className="border border-black px-2 py-2 text-center">
                            {row.order_ref}
                          </td>
                          <td className="border border-black px-2 py-2 text-center">
                            {moment(row.order_date).format("DD-MM-YYYY")}
                          </td>
                          <td className="border border-black px-2 py-2 text-center">
                            {moment(row.order_delivery_date).format(
                              "DD-MM-YYYY"
                            )}
                          </td>
                          <td className="border border-black px-2 py-2">
                            {row.product_name}
                          </td>
                          <td className="border border-black px-2 py-2 text-center">
                            {row.product_category}
                          </td>
                          <td className="border border-black px-2 py-2 text-center">
                            {row.order_status}
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
                  <td
                    colSpan={7}
                    className="border border-black text-center py-4"
                  >
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default OrderReport;
