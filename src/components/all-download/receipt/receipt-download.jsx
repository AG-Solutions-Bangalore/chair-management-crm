import React, { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import Moment from "moment";
import * as XLSX from "xlsx";
import { Download, Eye, ArrowUpDown, ChevronDown, Search } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { DOWNLOAD_RECEIPT, DOWNLOAD_RECEIPT_DROPDOWN_DATASOURCE } from "@/api";
import Cookies from "js-cookie";
import moment from "moment";

const ReceiptDownload = () => {
  const token = Cookies.get("token");
  const [formData, setFormData] = useState({
    receipt_from_date: Moment().startOf("month").format("YYYY-MM-DD"),
    receipt_to_date: Moment().format("YYYY-MM-DD"),
    receipt_donation_type: "",
    receipt_exemption_type: "",
    indicomp_source: "",
  });

  const [jsonData, setJsonData] = useState(null);
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const exemptionTypes = [
    { value: "80G", label: "80G" },
    { value: "Non 80G", label: "Non 80G" },
    { value: "FCRA", label: "FCRA" },
    { value: "CSR", label: "CSR" },
  ];

  const donationTypes = [
    { value: "One Teacher School", label: "EV" },
    { value: "General", label: "General" },
    { value: "Membership", label: "Membership" },
  ];

  const { data: datasource = [], isLoading } = useQuery({
    queryKey: ["receipt-download-datasource"],
    queryFn: async () => {
      const response = await axios.get(DOWNLOAD_RECEIPT_DROPDOWN_DATASOURCE, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data || [];
    },
    retry: 2,
  });

  const downloadMutation = useMutation({
    mutationFn: async (downloadData) => {
      const response = await axios.post(DOWNLOAD_RECEIPT, downloadData, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });
      return response.data;
    },
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "receipt_list.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Receipt downloaded successfully!");
      setFormData({
        receipt_from_date: Moment().startOf("month").format("YYYY-MM-DD"),
        receipt_to_date: Moment().format("YYYY-MM-DD"),
        receipt_donation_type: "",
        receipt_exemption_type: "",
        indicomp_source: "",
      });
    },
    onError: (error) => {
      toast.error("Failed to download receipt");
      console.error("Download error:", error);
    },
  });

  const viewMutation = useMutation({
    mutationFn: async (downloadData) => {
      const response = await axios.post(DOWNLOAD_RECEIPT, downloadData, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });
      return response.data;
    },
    onSuccess: async (blob) => {
      try {
        const innerBlob = blob instanceof Blob ? blob : new Blob([blob]);
        const text = await innerBlob.text();

        if (/[\x00-\x08\x0E-\x1F]/.test(text)) {
          if (typeof XLSX === "undefined") {
            toast.error("Excel parser not loaded. Please reload the page.");
            return;
          }

          const arrayBuffer = await innerBlob.arrayBuffer();
          const workbook = XLSX.read(arrayBuffer, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          const json = XLSX.utils.sheet_to_json(sheet);

          setJsonData(json);
          toast.success(`Loaded ${json.length} receipts from Excel file.`);
        } else {
          parseCSVAndSetData(text);
          toast.success("Loaded receipts from Excel file.");
        }
      } catch (error) {
        console.error("Failed to read Excel blob:", error);
        toast.error("Unable to preview receipt file.");
      }
    },
    onError: () => {
      toast.error("Failed to fetch receipt data");
    },
  });

  function parseCSVAndSetData(text) {
    const rows = text.split("\n").filter(Boolean);
    if (!rows.length) {
      toast.error("No receipt data found");
      return;
    }

    const headers = rows[0]
      .split(",")
      .map((h) => h.replace(/^"|"$/g, "").trim());
    const data = rows.slice(1).map((row) => {
      const values = row.split(",");
      const obj = {};
      headers.forEach((header, idx) => {
        const cleanValue = values[idx]
          ? values[idx].replace(/^"|"$/g, "").trim()
          : "";
        obj[header] = cleanValue;
      });
      return obj;
    });

    setJsonData(data);
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitDownload = (e) => {
    e.preventDefault();
    if (!formData.receipt_from_date || !formData.receipt_to_date) {
      toast.error("Please select both from and to dates");
      return;
    }
    downloadMutation.mutate(formData);
  };

  const handleSubmitView = (e) => {
    e.preventDefault();
    if (!formData.receipt_from_date || !formData.receipt_to_date) {
      toast.error("Please select both from and to dates");
      return;
    }
    viewMutation.mutate(formData);
  };

  // Define columns for the table
  // Replace the columns array with this:
  const columns = [
    {
      id: "S. No.",
      header: "S. No.",
      cell: ({ row }) => {
        const globalIndex = row.index + 1;
        return <div className="text-xs font-medium">{globalIndex}</div>;
      },
      size: 60,
    },
    {
      accessorKey: "Receipt No",
      id: "Receipt No",
      header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-2 h-8 text-xs"
        >
          Receipt No
          <ArrowUpDown className="ml-1 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-xs font-medium">{row.getValue("Receipt No")}</div>
      ),
      size: 100,
    },
    {
      accessorKey: "Receipt Date",
      id: "Receipt Date",
      header: "Receipt Date",
      cell: ({ row }) => (
        <div className="text-xs font-medium">
          {moment(row.getValue("Receipt Date")).format("DD MMM YYYY")}
        </div>
      ),
      size: 120,
    },
    {
      accessorKey: "Exemption Type",
      id: "Exemption Type",
      header: "Exemption Type",
      cell: ({ row }) => (
        <div className="text-xs font-medium">
          {row.getValue("Exemption Type")}
        </div>
      ),
      size: 120,
    },
    {
      accessorKey: "Financial Year",
      id: "Financial Year",
      header: "Financial Year",
      cell: ({ row }) => (
        <div className="text-xs font-medium">
          {row.getValue("Financial Year")}
        </div>
      ),
      size: 120,
    },
    {
      accessorKey: "Amount",
      id: "Amount",
      header: "Amount",
      cell: ({ row }) => (
        <div className="text-xs font-medium">{row.getValue("Amount")}</div>
      ),
      size: 100,
    },
    {
      accessorKey: "Realization Date",
      id: "Realization Date",
      header: "Realization Date",
      cell: ({ row }) => (
        <div className="text-xs font-medium">
          {row.getValue("Realization Date")}
        </div>
      ),
      size: 120,
    },
    {
      accessorKey: "Donation Type",
      id: "Donation Type",
      header: "Donation Type",
      cell: ({ row }) => (
        <div className="text-xs font-medium">
          {row.getValue("Donation Type")}
        </div>
      ),
      size: 140,
    },
    {
      accessorKey: "Pay Mode",
      id: "Pay Mode",
      header: "Pay Mode",
      cell: ({ row }) => (
        <div className="text-xs font-medium">{row.getValue("Pay Mode")}</div>
      ),
      size: 100,
    },
    {
      accessorKey: "Pay Details",
      id: "Pay Details",
      header: "Pay Details",
      cell: ({ row }) => {
        const payDetails = row.getValue("Pay Details") || "";
        const shortPayDetails =
          payDetails.length > 50 ? payDetails.slice(0, 50) + "…" : payDetails;
        return <div className="text-xs font-medium">{shortPayDetails}</div>;
      },
      size: 200,
    },
    {
      accessorKey: "Remarks",
      id: "Remarks",
      header: "Remarks",
      cell: ({ row }) => {
        const remarks = row.getValue("Remarks") || "";
        const shortRemarks =
          remarks.length > 50 ? remarks.slice(0, 50) + "…" : remarks;
        return <div className="text-xs font-medium">{shortRemarks}</div>;
      },
      size: 200,
    },
    {
      accessorKey: "Data Source",
      id: "Data Source",
      header: "Data Source",
      cell: ({ row }) => (
        <div className="text-xs font-medium">{row.getValue("Data Source")}</div>
      ),
      size: 120,
    },
  ];

  const table = useReactTable({
    data: jsonData || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      columnVisibility,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  const TableShimmer = () => {
    return Array.from({ length: 10 }).map((_, index) => (
      <TableRow key={index} className="animate-pulse h-11">
        {table.getVisibleFlatColumns().map((column) => (
          <TableCell key={column.id} className="py-1">
            <div className="h-8 bg-gray-200 rounded w-full"></div>
          </TableCell>
        ))}
      </TableRow>
    ));
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-full mx-auto border rounded-md shadow-sm">
        <div className="p-4 border-b bg-muted/50">
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            {[...Array(5)].map((_, i) => (
              <div key={i}>
                <Skeleton className="h-4 w-20 mb-1" />
                <Skeleton className="h-9 w-full" />
              </div>
            ))}
          </div>
          <Skeleton className="h-9 w-32 mt-4" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full mx-auto border rounded-md shadow-sm">
      <div className="p-4 border-b bg-muted/50">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <Download className="w-5 h-5" />
          Download Receipts
        </div>
        <div className="text-sm text-muted-foreground mt-0.5">
          Leave fields blank to get all records
        </div>
      </div>

      <div className="p-4">
        <form className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="receipt_from_date" className="text-sm">
                From Date *
              </Label>
              <Input
                id="receipt_from_date"
                name="receipt_from_date"
                type="date"
                value={formData.receipt_from_date}
                onChange={handleInputChange}
                required
                className="h-9"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="receipt_to_date" className="text-sm">
                To Date *
              </Label>
              <Input
                id="receipt_to_date"
                name="receipt_to_date"
                type="date"
                value={formData.receipt_to_date}
                onChange={handleInputChange}
                required
                className="h-9"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="receipt_donation_type" className="text-sm">
                Purpose
              </Label>
              <Select
                value={formData.receipt_donation_type}
                onValueChange={(value) =>
                  handleSelectChange("receipt_donation_type", value)
                }
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select Purpose" />
                </SelectTrigger>
                <SelectContent>
                  {donationTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="receipt_exemption_type" className="text-sm">
                Category
              </Label>
              <Select
                value={formData.receipt_exemption_type}
                onValueChange={(value) =>
                  handleSelectChange("receipt_exemption_type", value)
                }
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {exemptionTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="indicomp_source" className="text-sm">
                Source
              </Label>
              <Select
                value={formData.indicomp_source}
                onValueChange={(value) =>
                  handleSelectChange("indicomp_source", value)
                }
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select Source" />
                </SelectTrigger>
                <SelectContent>
                  {datasource.map((item) => (
                    <SelectItem
                      key={item.data_source_type}
                      value={item.data_source_type}
                    >
                      {item.data_source_type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              onClick={handleSubmitDownload}
              disabled={downloadMutation.isPending}
              className="flex items-center gap-2 h-9"
            >
              <Download className="w-4 h-4" />
              {downloadMutation.isPending ? "Downloading..." : "Download"}
            </Button>

            <Button
              type="button"
              onClick={handleSubmitView}
              disabled={viewMutation.isPending}
              className="flex items-center gap-2 h-9"
            >
              <Eye className="w-4 h-4" />
              {viewMutation.isPending ? "Loading..." : "View"}
            </Button>
          </div>
        </form>

        {/* Table display */}
        {jsonData && (
          <div className="mt-6">
            <div className="flex items-center justify-between py-1 mb-3">
              <div className="relative w-72">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search receipts..."
                  value={table.getState().globalFilter || ""}
                  onChange={(event) =>
                    table.setGlobalFilter(event.target.value)
                  }
                  className="pl-8 h-9 text-sm bg-gray-50 border-gray-200 focus:border-gray-300 focus:ring-gray-200"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9">
                    Columns <ChevronDown className="ml-2 h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="text-xs capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Table */}
            <div className="rounded-none border min-h-[20rem] flex flex-col">
              <Table className="flex-1">
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead
                          key={header.id}
                          className="h-10 px-3 bg-[var(--team-color)] text-[var(--label-color)] text-sm font-medium"
                          style={{ width: header.column.columnDef.size }}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>

                <TableBody>
                  {viewMutation.isPending ? (
                    <TableShimmer />
                  ) : table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                        className="h-2 hover:bg-gray-50"
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id} className="px-3 py-1">
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow className="h-12">
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center text-sm"
                      >
                        No receipts found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-end space-x-2 py-4">
              <div className="flex-1 text-sm text-muted-foreground">
                Total Receipts: {table.getFilteredRowModel().rows.length}
              </div>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReceiptDownload;
