import React from 'react';
import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import { Download, Info, ChevronDown, ChevronUp, Search, Eye } from 'lucide-react';
import Cookies from 'js-cookie';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';  
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { OTHER_FAQ, OTHER_FAQ_DOWNLOAD } from '@/api';

const FaqOther = () => {
  const token = Cookies.get('token');
  const [openAccordion, setOpenAccordion] = useState(null);
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnVisibility, setColumnVisibility] = useState({});
  const [viewMode, setViewMode] = useState('table'); 

  const { data: faqsData = [], isLoading } = useQuery({
    queryKey: ['other-faq'],
    queryFn: async () => {
      const response = await axios.get(OTHER_FAQ, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return response.data.data || [];
    },
    retry: 2,
  });

  const downloadMutation = useMutation({
    mutationFn: async () => {
      const response = await axios.post(OTHER_FAQ_DOWNLOAD, {}, {
        headers: { 'Authorization': `Bearer ${token}` },
        responseType: 'blob'
      });
      return response.data;
    },
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'faq_summary.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('FAQ downloaded successfully!');
    },
    onError: (error) => {
      toast.error('Failed to download FAQ');
      console.error('Download error:', error);
    }
  });

  const handleAccordionToggle = (index) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  const handleDownload = () => {
    downloadMutation.mutate();
  };


  const columns = [
    {
      id: 'S. No.',
      header: 'S. No.',
      cell: ({ row }) => {
        const globalIndex = row.index + 1;
        return <div className="text-xs font-medium">{globalIndex}</div>;
      },
      size: 60,
    },
    {
      accessorKey: 'header',
      id: 'Question',
      header: 'Question',
      cell: ({ row }) => (
        <div className="text-xs font-medium text-blue-600">
          {row.getValue('Question')}
        </div>
      ),
      size: 300,
    },
    {
      accessorKey: 'text',
      id: 'Answer',
      header: 'Answer',
      cell: ({ row }) => {
        const answer = row.getValue('Answer') || '';
        const shortAnswer = answer.length > 100 ? answer.slice(0, 100) + '…' : answer;
        return <div className="text-xs text-gray-600">{shortAnswer}</div>;
      },
      size: 400,
    },
    {
      accessorKey: 'category',
      id: 'Category',
      header: 'Category',
      cell: ({ row }) => (
        <div className="text-xs font-medium">
          {row.getValue('Category') || 'General'}
        </div>
      ),
      size: 120,
    },
    {
      accessorKey: 'status',
      id: 'Status',
      header: 'Status',
      cell: ({ row }) => (
        <div className="text-xs font-medium">
          {row.getValue('Status')}
        </div>
      ),
      size: 120,
    },
    {
      id: 'actions',
      header: 'View Details',
      cell: ({ row }) => (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleAccordionToggle(row.index)}
          className="h-7 text-xs"
        >
          {openAccordion === row.index ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          {openAccordion === row.index ? 'Hide' : 'View'}
        </Button>
      ),
      size: 100,
    },
  ];

  const table = useReactTable({
    data: faqsData,
    columns,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
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

  const AccordionShimmer = () => {
    return Array.from({ length: 5 }).map((_, index) => (
      <div key={index} className="border rounded-lg p-4 mb-4 animate-pulse">
        <div className="flex justify-between items-center">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="h-5 w-5 bg-gray-200 rounded"></div>
        </div>
      </div>
    ));
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-full mx-auto border rounded-md shadow-sm">
        <div className="p-4 border-b bg-muted/50">
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="p-4">
          <Skeleton className="h-9 w-32 mb-4" />
          <AccordionShimmer />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full mx-auto border rounded-md shadow-sm">
      <div className="p-4 border-b bg-muted/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <Info className="w-5 h-5" />
            FAQ List
          </div>
          <div className="flex items-center gap-2">
            <Button 
              onClick={() => setViewMode(viewMode === 'table' ? 'accordion' : 'table')}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 h-9"
            >
              <Eye className="w-4 h-4" />
              {viewMode === 'table' ? 'Accordion View' : 'Table View'}
            </Button>
            <Button 
              onClick={handleDownload} 
              disabled={downloadMutation.isPending}
              className="flex items-center gap-2 h-9"
              variant="outline"
            >
              <Download className="w-4 h-4" />
              {downloadMutation.isPending ? 'Downloading...' : 'Download'}
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4">
       
        <div className="flex items-center justify-between py-1 mb-3">
          <div className="relative w-72">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search FAQs..."
              value={table.getState().globalFilter || ''}
              onChange={(event) => table.setGlobalFilter(event.target.value)}
              className="pl-8 h-9 text-sm bg-gray-50 border-gray-200 focus:border-gray-300 focus:ring-gray-200"
            />
          </div>
          
          {viewMode === 'table' && (
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
          )}
        </div>

        {/* Table View */}
        {viewMode === 'table' ? (
          <>
            <div className="rounded-none border min-h-[20rem] flex flex-col">
              <Table className="flex-1">
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead 
                          key={header.id} 
                          className="h-10 px-3 bg-muted/50 text-sm font-medium"
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
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <>
                        <TableRow
                          key={row.id}
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
                        {openAccordion === row.index && (
                          <TableRow>
                            <TableCell colSpan={columns.length} className="p-4 bg-gray-50 border-t">
                              <div className="pl-4 border-l-2 border-blue-500">
                                <p className="text-sm text-gray-700 whitespace-pre-line">
                                  {row.original.text}
                                </p>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    ))
                  ) : (
                    <TableRow className="h-12">
                      <TableCell colSpan={columns.length} className="h-24 text-center text-sm">
                        No FAQs found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-end space-x-2 py-4">
              <div className="flex-1 text-sm text-muted-foreground">
                Total FAQs: {table.getFilteredRowModel().rows.length}
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
          </>
        ) : (
          /* Accordion View */
          <div className="space-y-4">
            {table.getFilteredRowModel().rows.map((row, index) => (
              <div key={index} className="border rounded-lg overflow-hidden">
                <button
                  className="flex justify-between items-center w-full p-4 text-left bg-white hover:bg-gray-50 transition-colors"
                  onClick={() => handleAccordionToggle(index)}
                >
                  <span className="font-semibold text-blue-600 text-sm">
                    {row.original.header}   
                  </span>
                
                  {openAccordion === index ? (
                    <ChevronUp className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  )}
                </button>
                {openAccordion === index && (
                  <div className="p-4 bg-gray-50 border-t">
                    <p className="text-sm text-gray-700 whitespace-pre-line">
                      {row.original.text}
                    </p>
                  </div>
                )}
              </div>
            ))}
            {table.getFilteredRowModel().rows.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No FAQs found.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FaqOther;