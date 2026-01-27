import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import axios from "axios";
import { ArrowUpDown, ChevronDown, ChevronLeft, ChevronRight, Edit, Eye, Loader2, Search, SquarePlus } from "lucide-react";
import { useState, useEffect } from "react";
import BASE_URL from "@/config/base-url";
import Cookies from "js-cookie";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { navigateToViewerEdit } from "@/api";
import { Link, useNavigate } from "react-router-dom";
import { useFetchChapterActive } from "@/hooks/use-api";

const Viewer = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate()
  const {
    data: viewersData,
  
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["viewers",],
    queryFn: async () => {
      const token = Cookies.get("token");
      
      const response = await axios.get(
        `${BASE_URL}/api/fetch-user-list`,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        }
      );
      return response.data.data;
    },
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
  });
  const {
    data: chapterActive,
  
  
    isLoading:isLoadingChapter,
  } = useQuery({
    queryKey: ["chapter-active",],
    queryFn: async () => {
      const token = Cookies.get("token");
      
      const response = await axios.get(
        `${BASE_URL}/api/chapter-active`,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        }
      );
      return response.data.data;
    },
    keepPreviousData: true,
    staleTime: 5 * 60 * 1000,
  });




  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");

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
      accessorKey: "name",
      id: "Name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-2 h-8 text-xs"
        >
          Name
          <ArrowUpDown className="ml-1 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => <div className="text-[13px] font-medium">{row.getValue("Name")}</div>,
      size: 150,
    },
    {
      accessorKey: "email",
      id: "Email",
      header: "Email",
      cell: ({ row }) => <div className="text-xs text-blue-600">{row.getValue("Email")}</div>,
      size: 200,
    },
    {
      accessorKey: "phone",
      id: "Phone",
      header: "Phone",
      cell: ({ row }) => <div className="text-xs font-medium">{row.getValue("Phone") || "-"}</div>,
      size: 120,
    },
    {
      accessorKey: "user_position",
      id: "Position",
      header: "Position",
      cell: ({ row }) => (
        <div className="text-xs">
          {row.getValue("Position") || "Viewer"}
        </div>
      ),
      size: 120,
    },
    {
      accessorKey: "user_status",
      id: "Status",
      header: "Status",
      cell: ({ row }) => (
        <div className={`text-xs font-medium px-2 py-1 rounded-full ${
          row.getValue("Status") === "Active" 
            ? "bg-green-100 text-green-800" 
            : "bg-red-100 text-red-800"
        }`}>
          {row.getValue("Status")}
        </div>
      ),
      size: 100,
    },
    {
      accessorKey: "viewer_chapter_ids",
      id: "Chapter ID",
      header: "Chapter",
      cell: ({ row }) => {
        const value = row.getValue("Chapter ID");
        const codes = value ? value.toString().split(",") : [];
    
    
        if (isLoadingChapter || !chapterActive?.length) {
          return (
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
          );
        }
        
    
        const chapterNames = codes
          .map((code) => {
            const match = chapterActive.find(
              (chapter) => String(chapter.chapter_code) === code.trim()
            );
            return match ? match.chapter_name.split(" ")[0] : null;
          })
          .filter(Boolean);
    
        return (
          <div className="text-xs font-medium w-32 break-words">
            {chapterNames.length > 0 ? chapterNames.join(", ") : "-"}
          </div>
        );
      },
      size: 150,
    },
    
    {
      accessorKey: "viewer_start_date",
      id: "Start Date",
      header: "Start Date",
      cell: ({ row }) => (
        <div className="text-xs">
          {row.getValue("Start Date") ? new Date(row.getValue("Start Date")).toLocaleDateString() : "-"}
        </div>
      ),
      size: 120,
    },
    {
      accessorKey: "viewer_end_date",
      id: "Last Date",
      header: "Last Date",
      cell: ({ row }) => (
        <div className="text-xs">
          {row.getValue("Last Date") ? new Date(row.getValue("Last Date")).toLocaleDateString() : "-"}
        </div>
      ),
      size: 120,
    },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => {
        const id = row.original.id
        return (
          <div className="flex flex-row">
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      navigateToViewerEdit(navigate,id)
                                                  }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Edit Viewer</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        );
      },
      size: 100,
    },
  ];

  const table = useReactTable({
    data: viewersData || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      columnVisibility,
      rowSelection,
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
  
  if (isError) {
    return (
      <div className="w-full p-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-destructive font-medium mb-2">
              Error Fetching Viewers Data
            </div>
            <Button onClick={() => refetch()} variant="outline" size="sm">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-full ">
      <div className="flex items-center justify-between py-1">
        <div className="relative w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search viewers..."
            value={table.getState().globalFilter || ""}
            onChange={(event) => table.setGlobalFilter(event.target.value)}
            className="pl-8 h-9 text-sm bg-gray-50 border-gray-200 focus:border-gray-300 focus:ring-gray-200"
          />
        </div>
        <div className="flex flex-col md:flex-row md:ml-auto gap-2 w-full md:w-auto">
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
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <Link 
                  to='/master/viewer/create'
                  >
                    <Button variant="default">
                  <SquarePlus className="h-3 w-3 mr-2" /> Viewer
                </Button>
                </Link>
                </div>
      </div>

      {/* Table */}
      <div className="rounded-none border min-h-[31rem] grid grid-cols-1">
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
            {(isFetching || isLoadingChapter) && !table.getRowModel().rows.length ? (
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
                <TableCell colSpan={columns.length} className="h-24 text-center text-sm">
                  No viewers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2 py-1">
        <div className="flex-1 text-sm text-muted-foreground">
          Total Viewers : &nbsp;
          {table.getFilteredRowModel().rows.length}
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
  );
};

export default Viewer;