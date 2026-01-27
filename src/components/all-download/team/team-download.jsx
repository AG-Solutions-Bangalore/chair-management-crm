import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import axios from "axios";
import { ArrowUpDown, ChevronDown, Download, Eye, Search } from "lucide-react";
import Moment from "moment";
import { useState } from "react";
import { toast } from "sonner";
import * as XLSX from "xlsx";

import { DOWNLOAD_TEAM } from "@/api";
import Cookies from "js-cookie";
import moment from "moment";

const TeamDownload = () => {
  const token = Cookies.get("token");
  const [formData, setFormData] = useState({
    committee_start_date: Moment().startOf("month").format("YYYY-MM-DD"),
    committee_end_date: Moment().format("YYYY-MM-DD"),
  });

  const [jsonData, setJsonData] = useState(null);
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");

  const { isLoading } = useQuery({
    queryKey: ["team-download-datasource"],
    queryFn: async () => {
      // Add datasource API call if needed
      return [];
    },
    retry: 2,
  });

  const downloadMutation = useMutation({
    mutationFn: async (downloadData) => {
      const response = await axios.post(DOWNLOAD_TEAM, downloadData, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });
      return response.data;
    },
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "team_summary.xlsx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Team report downloaded successfully!");
      setFormData({
        committee_start_date: Moment().startOf("month").format("YYYY-MM-DD"),
        committee_end_date: Moment().format("YYYY-MM-DD"),
      });
    },
    onError: (error) => {
      toast.error("Failed to download team report");
      console.error("Download error:", error);
    },
  });

  const viewMutation = useMutation({
    mutationFn: async (downloadData) => {
      const response = await axios.post(DOWNLOAD_TEAM, downloadData, {
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

  const handleSubmitDownload = (e) => {
    e.preventDefault();
    if (!formData.committee_start_date || !formData.committee_end_date) {
      toast.error("Please select both from and to dates");
      return;
    }
    downloadMutation.mutate(formData);
  };

  const handleSubmitView = (e) => {
    e.preventDefault();
    if (!formData.committee_start_date || !formData.committee_end_date) {
      toast.error("Please select both from and to dates");
      return;
    }
    viewMutation.mutate(formData);
  };

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
      accessorKey: "Donor Name",
      id: "Donor Name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-2 h-8 text-xs"
        >
          Donor Name
          <ArrowUpDown className="ml-1 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-xs font-medium">{row.getValue("Donor Name")}</div>
      ),
      size: 150,
    },
    {
      accessorKey: "Committee Type",
      id: "Committee Type",
      header: "Committee Type",
      cell: ({ row }) => (
        <div className="text-xs font-medium">
          {row.getValue("Committee Type")}
        </div>
      ),
      size: 120,
    },
    {
      accessorKey: "Designation",
      id: "Designation",
      header: "Designation",
      cell: ({ row }) => (
        <div className="text-xs font-medium">{row.getValue("Designation")}</div>
      ),
      size: 120,
    },
    {
      accessorKey: "Start Date",
      id: "Start Date",
      header: "Start Date",
      cell: ({ row }) => (
        <div className="text-xs font-medium">
          {" "}
          {moment(row.getValue("Start Date")).format("DD MMM YYYY")}
        </div>
      ),
      size: 100,
    },
    {
      accessorKey: "End Date",
      id: "End Date",
      header: "End Date",
      cell: ({ row }) => (
        <div className="text-xs font-medium">
          {moment(row.getValue("End Date")).format("DD MMM YYYY")}
        </div>
      ),
      size: 100,
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[...Array(2)].map((_, i) => (
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
          Download Team Report
        </div>
        <div className="text-sm text-muted-foreground mt-0.5">
          Leave fields blank to get all records
        </div>
      </div>

      <div className="p-4">
        <form className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2  lg:grid-cols-5 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="committee_start_date" className="text-sm">
                From Date *
              </Label>
              <Input
                id="committee_start_date"
                name="committee_start_date"
                type="date"
                value={formData.committee_start_date}
                onChange={handleInputChange}
                required
                className="h-9"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="committee_end_date" className="text-sm">
                To Date *
              </Label>
              <Input
                id="committee_end_date"
                name="committee_end_date"
                type="date"
                value={formData.committee_end_date}
                onChange={handleInputChange}
                required
                className="h-9"
              />
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
                  placeholder="Search team..."
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
                        No team records found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-end space-x-2 py-4">
              <div className="flex-1 text-sm text-muted-foreground">
                Total Records: {table.getFilteredRowModel().rows.length}
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

export default TeamDownload;
