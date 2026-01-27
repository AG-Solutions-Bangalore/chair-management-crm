import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ArrowUpDown, Edit, Search } from 'lucide-react';
import { useState } from 'react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import CreateDatasourceSuperadmin from './create-datasource-superadmin';
import EditDatasourceSuperadmin from './edit-datasource-superadmin';

const DatasourceListSuperadmin = ({id,datasources,chapterCodeForCreateDataSource}) => {
  const [editDatasource, setEditDatasource] = useState(null);



  const [datasourceSorting, setDatasourceSorting] = useState([]);
  const [datasourceColumnFilters, setDatasourceColumnFilters] = useState([]);
  const [datasourceColumnVisibility, setDatasourceColumnVisibility] = useState({});
  const [datasourceRowSelection, setDatasourceRowSelection] = useState({});
  const [datasourceGlobalFilter, setDatasourceGlobalFilter] = useState("");

  const datasourceColumns = [
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
      accessorKey: "data_source_type",
      id: "Data Source Type",
      header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="px-2 h-8 text-xs"
        >
          Data Source Type
          <ArrowUpDown className="ml-1 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="text-[13px] font-medium">{row.getValue("Data Source Type")}</div>
      ),
      size: 200,
    },
    {
      id: "actions",
      header: "Action",
      cell: ({ row }) => {
        const datasource = row.original;
        const dataEditAccess = row.original.data_source_type
        const restrictedSources = ["Ekal Run", "Sakranti", "Seva Patra"];
        const canEdit = !restrictedSources.includes(dataEditAccess);
        return (
          <div className="flex flex-row">

{canEdit && (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs"
                onClick={() => setEditDatasource(datasource)}
              >
                <Edit className="h-3 w-3 mr-1" />
                Edit
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit Data Source</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
           
          </div>
        );
      },
    },
  ];

  const datasourceTable = useReactTable({
    data: datasources,
    columns: datasourceColumns,
    onSortingChange: setDatasourceSorting,
    onColumnFiltersChange: setDatasourceColumnFilters,
    onGlobalFilterChange: setDatasourceGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setDatasourceColumnVisibility,
    onRowSelectionChange: setDatasourceRowSelection,
    state: {
      sorting: datasourceSorting,
      columnFilters: datasourceColumnFilters,
      globalFilter: datasourceGlobalFilter,
      columnVisibility: datasourceColumnVisibility,
      rowSelection: datasourceRowSelection,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  const DatasourceTableShimmer = () => {
    return Array.from({ length: 5 }).map((_, index) => (
      <TableRow key={index} className="animate-pulse h-11"> 
        {datasourceTable.getVisibleFlatColumns().map((column) => (
          <TableCell key={column.id} className="py-1">
            <div className="h-8 bg-gray-200 rounded w-full"></div> 
          </TableCell>
        ))}
      </TableRow>
    ));
  };

 
  return (
    <div className="pt-1">
      <div className="flex items-center justify-between py-1 ">
        <div className="relative w-64">
          <Search className="absolute left-2 top-2.5 h-3 w-3 text-gray-500" />
          <Input
            placeholder="Search data sources..."
            value={datasourceTable.getState().globalFilter || ""}
            onChange={(event) => datasourceTable.setGlobalFilter(event.target.value)}
            className="pl-7 h-8 text-xs bg-gray-50 border-gray-200 focus:border-gray-300 focus:ring-gray-200"
          />
        </div>
        <div className="flex flex-col md:flex-row md:ml-auto gap-2 w-full md:w-auto">
          <CreateDatasourceSuperadmin chapterId={chapterCodeForCreateDataSource} />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-none border min-h-[20rem] flex flex-col">
        <Table className="flex-1">
          <TableHeader>
            {datasourceTable.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead 
                    key={header.id} 
                    className="h-9 px-3 bg-[var(--team-color)] text-[var(--label-color)] text-xs font-medium"
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
            { datasourceTable.getRowModel().rows?.length ? (
              datasourceTable.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="h-9 hover:bg-gray-50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-3 py-1 text-xs">
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
                <TableCell colSpan={datasourceColumns.length} className="h-24 text-center text-xs">
                  No data sources found for this chapter.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2 py-2 ">
        <div className="flex-1 text-xs text-muted-foreground">
          Total Data Sources: {datasourceTable.getFilteredRowModel().rows.length}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => datasourceTable.previousPage()}
            disabled={!datasourceTable.getCanPreviousPage()}
            className="h-8 text-xs"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => datasourceTable.nextPage()}
            disabled={!datasourceTable.getCanNextPage()}
            className="h-8 text-xs"
          >
            Next
          </Button>
        </div>
      </div>

      {/* Edit Dialog */}
      {editDatasource && (
        <EditDatasourceSuperadmin
          datasourceData={editDatasource}
          open={!!editDatasource}
          onClose={() => setEditDatasource(null)}
        />
      )}
    </div>
  );
}

export default DatasourceListSuperadmin;