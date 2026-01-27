import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import Moment from 'moment';
import { Download, Eye, ArrowUpDown, ChevronDown, Search } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from '@/components/ui/label';
import * as XLSX from 'xlsx';
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
import { DOWNLOAD_SCHOOL_ALLOTED, DOWNLOAD_SCHOOL_UNALLOTED } from '@/api';
import Cookies from 'js-cookie';

const SchoolDownload = () => {
  const token = Cookies.get('token');
  const [formData, setFormData] = useState({
    schoolalot_from_date: Moment().startOf('month').format('YYYY-MM-DD'),
    schoolalot_to_date: Moment().format('YYYY-MM-DD'),
  });

  const [jsonData, setJsonData] = useState(null);
  const [dataType, setDataType] = useState(''); 
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [globalFilter, setGlobalFilter] = useState('');

  //  columns for allotted schools
  const allottedColumns = [
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
      accessorKey: 'State',
      id: 'State',
      header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="px-2 h-8 text-xs"
        >
          State
          <ArrowUpDown className="ml-1 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => <div className="text-xs font-medium">{row.getValue('State')}</div>,
      size: 120,
    },
    {
      accessorKey: 'Region',
      id: 'Region',
      header: 'Region',
      cell: ({ row }) => <div className="text-xs font-medium">{row.getValue('Region')}</div>,
      size: 120,
    },
    {
      accessorKey: 'Achal',
      id: 'Achal',
      header: 'Achal',
      cell: ({ row }) => <div className="text-xs font-medium">{row.getValue('Achal')}</div>,
      size: 100,
    },
    {
      accessorKey: 'Sankul',
      id: 'Sankul',
      header: 'Sankul',
      cell: ({ row }) => <div className="text-xs font-medium">{row.getValue('Sankul')}</div>,
      size: 100,
    },
    {
      accessorKey: 'Cluster',
      id: 'Cluster',
      header: 'Cluster',
      cell: ({ row }) => <div className="text-xs font-medium">{row.getValue('Cluster')}</div>,
      size: 100,
    },
    {
      accessorKey: 'District',
      id: 'District',
      header: 'District',
      cell: ({ row }) => <div className="text-xs font-medium">{row.getValue('District')}</div>,
      size: 100,
    },
    {
      accessorKey: 'Sub Cluster',
      id: 'Sub Cluster',
      header: 'Sub Cluster',
      cell: ({ row }) => <div className="text-xs font-medium">{row.getValue('Sub Cluster')}</div>,
      size: 120,
    },
    {
      accessorKey: 'School Id',
      id: 'School Id',
      header: 'School Id',
      cell: ({ row }) => <div className="text-xs font-medium">{row.getValue('School Id')}</div>,
      size: 120,
    },
    {
      accessorKey: 'Village',
      id: 'Village',
      header: 'Village',
      cell: ({ row }) => <div className="text-xs font-medium">{row.getValue('Village')}</div>,
      size: 120,
    },
  ];

  //  columns for unallotted schools 
  const unallottedColumns = [
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
      accessorKey: 'State',
      id: 'State',
      header: ({ column }) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="px-2 h-8 text-xs"
        >
          State
          <ArrowUpDown className="ml-1 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => <div className="text-xs font-medium">{row.getValue('State')}</div>,
      size: 120,
    },
    {
      accessorKey: 'Region',
      id: 'Region',
      header: 'Region',
      cell: ({ row }) => <div className="text-xs font-medium">{row.getValue('Region')}</div>,
      size: 120,
    },
    {
      accessorKey: 'Achal',
      id: 'Achal',
      header: 'Achal',
      cell: ({ row }) => <div className="text-xs font-medium">{row.getValue('Achal')}</div>,
      size: 100,
    },
    {
      accessorKey: 'Sankul',
      id: 'Sankul',
      header: 'Sankul',
      cell: ({ row }) => <div className="text-xs font-medium">{row.getValue('Sankul')}</div>,
      size: 100,
    },
    {
      accessorKey: 'Cluster',
      id: 'Cluster',
      header: 'Cluster',
      cell: ({ row }) => <div className="text-xs font-medium">{row.getValue('Cluster')}</div>,
      size: 100,
    },
    {
      accessorKey: 'District',
      id: 'District',
      header: 'District',
      cell: ({ row }) => <div className="text-xs font-medium">{row.getValue('District')}</div>,
      size: 100,
    },
    {
      accessorKey: 'Sub Cluster',
      id: 'Sub Cluster',
      header: 'Sub Cluster',
      cell: ({ row }) => <div className="text-xs font-medium">{row.getValue('Sub Cluster')}</div>,
      size: 120,
    },
    {
      accessorKey: 'School Id',
      id: 'School Id',
      header: 'School Id',
      cell: ({ row }) => <div className="text-xs font-medium">{row.getValue('School Id')}</div>,
      size: 120,
    },
    {
      accessorKey: 'Village',
      id: 'Village',
      header: 'Village',
      cell: ({ row }) => <div className="text-xs font-medium">{row.getValue('Village')}</div>,
      size: 120,
    },
  ];

 
  const getCurrentColumns = () => {
    return dataType === 'allotted' ? allottedColumns : unallottedColumns;
  };

  const downloadAllottedMutation = useMutation({
    mutationFn: async (downloadData) => {
      const response = await axios.post(DOWNLOAD_SCHOOL_ALLOTED, downloadData, {
        headers: { 'Authorization': `Bearer ${token}` },
        responseType: 'blob'
      });
      return response.data;
    },
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'school_allotted_summary.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('School Allotted downloaded successfully!');
      setFormData({
        schoolalot_from_date: Moment().startOf('month').format('YYYY-MM-DD'),
        schoolalot_to_date: Moment().format('YYYY-MM-DD'),
      });
    },
    onError: (error) => {
      toast.error('Failed to download school allotted data');
      console.error('Download error:', error);
    }
  });

  const downloadUnallottedMutation = useMutation({
    mutationFn: async (downloadData) => {
      const response = await axios.post(DOWNLOAD_SCHOOL_UNALLOTED, downloadData, {
        headers: { 'Authorization': `Bearer ${token}` },
        responseType: 'blob'
      });
      return response.data;
    },
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'school_unallotted_summary.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success('School Unallotted downloaded successfully!');
      setFormData({
        schoolalot_from_date: Moment().startOf('month').format('YYYY-MM-DD'),
        schoolalot_to_date: Moment().format('YYYY-MM-DD'),
      });
    },
    onError: (error) => {
      toast.error('Failed to download school unallotted data');
      console.error('Download error:', error);
    }
  });

  

  const viewAllottedMutation = useMutation({
    mutationFn: async (downloadData) => {
      const response = await axios.post(DOWNLOAD_SCHOOL_ALLOTED, downloadData, {
        headers: { 'Authorization': `Bearer ${token}` },
        responseType: 'blob'
      });
      return response.data;
    },
   onSuccess: async (blob) => {
    try {
      const innerBlob = blob instanceof Blob ? blob : new Blob([blob]);
      const text = await innerBlob.text();
  
      if (/[\x00-\x08\x0E-\x1F]/.test(text)) {
        if (typeof XLSX === 'undefined') {
          toast.error('Excel parser not loaded. Please reload the page.');
          return;
        }
  
        const arrayBuffer = await innerBlob.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(sheet);
  
        setJsonData(json);
        toast.success(`Loaded ${json.length} receipts from Excel file.`);
      } else {
        parseCSVAndSetData(text);
        toast.success('Loaded receipts from Excel file.');
      }
    } catch (error) {
      console.error('Failed to read Excel blob:', error);
      toast.error('Unable to preview receipt file.');
    }
  }
  ,
    onError: () => {
      toast.error('Failed to fetch receipt data');
    }
  });
  
  function parseCSVAndSetData(text) {
    const rows = text.split('\n').filter(Boolean);
    if (!rows.length) {
      toast.error('No receipt data found');
      return;
    }
  
    const headers = rows[0].split(',').map(h => h.replace(/^"|"$/g, '').trim());
    const data = rows.slice(1).map(row => {
      const values = row.split(',');
      const obj = {};
      headers.forEach((header, idx) => {
        const cleanValue = values[idx] ? values[idx].replace(/^"|"$/g, '').trim() : '';
        obj[header] = cleanValue;
      });
      return obj;
    });
  
    setJsonData(data);
  }
  const viewUnallottedMutation = useMutation({
    mutationFn: async (downloadData) => {
      const response = await axios.post(DOWNLOAD_SCHOOL_UNALLOTED, downloadData, {
        headers: { 'Authorization': `Bearer ${token}` },
        responseType: 'blob'
      });
      return response.data;
    },
   onSuccess: async (blob) => {
    try {
      const innerBlob = blob instanceof Blob ? blob : new Blob([blob]);
      const text = await innerBlob.text();
  
      if (/[\x00-\x08\x0E-\x1F]/.test(text)) {
        if (typeof XLSX === 'undefined') {
          toast.error('Excel parser not loaded. Please reload the page.');
          return;
        }
  
        const arrayBuffer = await innerBlob.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(sheet);
  
        setJsonData(json);
        toast.success(`Loaded ${json.length} receipts from Excel file.`);
      } else {
        parseCSVAndSetData(text);
        toast.success('Loaded receipts from Excel file.');
      }
    } catch (error) {
      console.error('Failed to read Excel blob:', error);
      toast.error('Unable to preview receipt file.');
    }
  }
  ,
    onError: () => {
      toast.error('Failed to fetch receipt data');
    }
  });
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDownloadAllotted = (e) => {
    e.preventDefault();
    if (!formData.schoolalot_from_date || !formData.schoolalot_to_date) {
      toast.error('Please select both from and to dates');
      return;
    }
    downloadAllottedMutation.mutate(formData);
  };

  const handleDownloadUnallotted = (e) => {
    e.preventDefault();
    if (!formData.schoolalot_from_date || !formData.schoolalot_to_date) {
      toast.error('Please select both from and to dates');
      return;
    }
    downloadUnallottedMutation.mutate(formData);
  };

  const handleViewAllotted = (e) => {
    e.preventDefault();
    if (!formData.schoolalot_from_date || !formData.schoolalot_to_date) {
      toast.error('Please select both from and to dates');
      return;
    }
    viewAllottedMutation.mutate(formData);
  };

  const handleViewUnallotted = (e) => {
    e.preventDefault();
    if (!formData.schoolalot_from_date || !formData.schoolalot_to_date) {
      toast.error('Please select both from and to dates');
      return;
    }
    viewUnallottedMutation.mutate(formData);
  };

  const table = useReactTable({
    data: jsonData || [],
    columns: getCurrentColumns(),
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

  return (
    <div className="w-full max-w-full mx-auto border rounded-md shadow-sm">
      <div className="p-4 border-b bg-muted/50">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <Download className="w-5 h-5" />
          Download Schools
        </div>
        <div className="text-sm text-muted-foreground mt-0.5">
          Leave fields blank to get all records
        </div>
      </div>

      <div className="p-4">
        <form className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="schoolalot_from_date" className="text-sm">From Date *</Label>
              <Input 
                id="schoolalot_from_date" 
                name="schoolalot_from_date" 
                type="date" 
                value={formData.schoolalot_from_date} 
                onChange={handleInputChange} 
                required 
                className="h-9" 
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="schoolalot_to_date" className="text-sm">To Date *</Label>
              <Input 
                id="schoolalot_to_date" 
                name="schoolalot_to_date" 
                type="date" 
                value={formData.schoolalot_to_date} 
                onChange={handleInputChange} 
                required 
                className="h-9" 
              />
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button 
              type="button" 
              onClick={handleDownloadAllotted} 
              disabled={downloadAllottedMutation.isPending} 
              className="flex items-center gap-2 h-9"
            >
              <Download className="w-4 h-4" />
              {downloadAllottedMutation.isPending ? 'Downloading...' : 'Download Allotted'}
            </Button>

            <Button 
              type="button" 
              onClick={handleViewAllotted} 
              disabled={viewAllottedMutation.isPending} 
              className="flex items-center gap-2 h-9"
            >
              <Eye className="w-4 h-4" />
              {viewAllottedMutation.isPending ? 'Loading...' : 'View Allotted'}
            </Button>

            <Button 
              type="button" 
              onClick={handleDownloadUnallotted} 
              disabled={downloadUnallottedMutation.isPending} 
              className="flex items-center gap-2 h-9"
            >
              <Download className="w-4 h-4" />
              {downloadUnallottedMutation.isPending ? 'Downloading...' : 'Download Unallotted'}
            </Button>

            <Button 
              type="button" 
              onClick={handleViewUnallotted} 
              disabled={viewUnallottedMutation.isPending} 
              className="flex items-center gap-2 h-9"
            >
              <Eye className="w-4 h-4" />
              {viewUnallottedMutation.isPending ? 'Loading...' : 'View Unallotted'}
            </Button>
          </div>
        </form>

        {/* Table display */}
        {jsonData && (
          <div className="mt-6">
            <div className="flex items-center justify-between py-1 mb-3">
              <div className="flex items-center gap-2">
                <div className="text-sm font-medium">
                  Viewing: {dataType === 'allotted' ? 'School Allotted' : 'School Unallotted'}
                </div>
                <div className="relative w-72">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search schools..."
                    value={table.getState().globalFilter || ''}
                    onChange={(event) => table.setGlobalFilter(event.target.value)}
                    className="pl-8 h-9 text-sm bg-gray-50 border-gray-200 focus:border-gray-300 focus:ring-gray-200"
                  />
                </div>
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
                        onCheckedChange={(value) => column.toggleVisibility(!!value)}
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
                  {(viewAllottedMutation.isPending || viewUnallottedMutation.isPending) ? (
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
                      <TableCell colSpan={getCurrentColumns().length} className="h-24 text-center text-sm">
                        No schools found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-end space-x-2 py-4">
              <div className="flex-1 text-sm text-muted-foreground">
                Total Schools: {table.getFilteredRowModel().rows.length}
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

export default SchoolDownload;