import React from 'react';
import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import { Download, Info, ChevronDown, ChevronUp, Search, Eye, Plus, CheckCircle, X, Edit } from 'lucide-react';
import Cookies from 'js-cookie';
import moment from 'moment';

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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';

import { 
  OTHER_NOTIFICATION_MARK_AS_READ, 
  OTHER_NOTIFICATION_SUMBIT_NOTICE, 
  OTHER_NOTIFICATION
} from '@/api';

const Notification = () => {
  const token = Cookies.get('token');
  const userTypeId = Cookies.get('user_type_id');
  const [openAccordion, setOpenAccordion] = useState(null);
  const [globalFilter, setGlobalFilter] = useState('');
  const [columnVisibility, setColumnVisibility] = useState({});
  const [viewMode, setViewMode] = useState('table');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [editingNotice, setEditingNotice] = useState(null);

  const { data: notificationsData = [], isLoading, refetch } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const url = OTHER_NOTIFICATION
      const response = await axios.get(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return response.data.data || [];
    },
    retry: 2,
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (noticeId) => {
     const response = await axios.post(`${OTHER_NOTIFICATION_MARK_AS_READ}/${noticeId}/read`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return response.data
    },
    onSuccess: (data) => {
      toast.success(data.message||'Notification acknowledged successfully!');
      refetch();
      setIsConfirmDialogOpen(false);
      setSelectedNotice(null);
    },
    onError: (error) => {
      toast.error(error.response.data.message || 'Failed to acknowledge notification');
      console.error('Acknowledge error:', error);
    }
  });

  const addNoticeMutation = useMutation({
    mutationFn: async (noticeData) => {
      const response = await axios.post(OTHER_NOTIFICATION_SUMBIT_NOTICE, noticeData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Notice posted successfully!');
      setIsAddDialogOpen(false);
      refetch();
    },
    onError: (error) => {
      toast.error(error.response.data.message || 'Failed to post notice');
      console.error('Add notice error:', error);
    }
  });

  const editNoticeMutation = useMutation({
    mutationFn: async ({ id, noticeData }) => {
      const response = await axios.put(`${OTHER_NOTIFICATION_SUMBIT_NOTICE}/${id}`, noticeData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Notice updated successfully!');
      setIsEditDialogOpen(false);
      setEditingNotice(null);
      refetch();
    },
    onError: (error) => {
      toast.error(error.response.data.message || 'Failed to update notice');
      console.error('Edit notice error:', error);
    }
  });

  // Fetch single notice for editing
  const fetchNotice = async (id) => {
    try {
      const response = await axios.get(`${OTHER_NOTIFICATION_SUMBIT_NOTICE}/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching notice:', error);
      throw error;
    }
  };

  const handleAccordionToggle = (index) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  const handleAcknowledge = (notice) => {
    setSelectedNotice(notice);
    setIsConfirmDialogOpen(true);
  };

  const handleEdit = async (notice) => {
    try {
      const noticeData = await fetchNotice(notice.id);
      setEditingNotice(noticeData);
      setIsEditDialogOpen(true);
    } catch (error) {
      toast.error('Failed to fetch notice details');
    }
  };

  const confirmAcknowledge = () => {
    if (selectedNotice) {
      markAsReadMutation.mutate(selectedNotice.id);
    }
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
      accessorKey: 'notice_name',
      id: 'Title',
      header: 'Title',
      cell: ({ row }) => (
        <div className="text-xs font-medium text-blue-600">
          {row.getValue('Title')}
        </div>
      ),
      size: 250,
    },
    {
      accessorKey: 'notice_detail',
      id: 'Details',
      header: 'Details',
      cell: ({ row }) => {
        const details = row.getValue('Details') || '';
        const shortDetails = details.length > 100 ? details.slice(0, 100) + '…' : details;
        return <div className="text-xs text-gray-600">{shortDetails}</div>;
      },
      size: 400,
    },
    {
      accessorKey: 'created_at',
      id: 'Posted On',
      header: 'Posted On',
      cell: ({ row }) => (
        <div className="text-xs font-medium">
          {moment(row.getValue('Posted On')).format('DD-MM-YY')}
        </div>
      ),
      size: 100,
    },
    {
      accessorKey: 'is_read',
      id: 'Status',
      header: 'Status',
      cell: ({ row }) => (
        <div className="text-xs font-medium">
          {row.getValue('Status') === 0 ? (
            <span className="text-red-600">Unread</span>
          ) : (
            <span className="text-green-600">Acknowledged</span>
          )}
        </div>
      ),
      size: 100,
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAccordionToggle(row.index)}
            className="h-7 text-xs"
          >
            {openAccordion === row.index ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            {openAccordion === row.index ? 'Hide' : 'View'}
          </Button>
          {row.original.is_read === 0 && (
            <Button
              variant="default"
              size="sm"
              onClick={() => handleAcknowledge(row.original)}
              className="h-7 text-xs bg-blue-600 hover:bg-blue-700"
            >
              <CheckCircle className="w-3 h-3 mr-1" />
              Acknowledge
            </Button>
          )}
          {userTypeId === "3" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleEdit(row.original)}
              className="h-7 text-xs"
            >
              <Edit className="w-3 h-3 mr-1" />
              Edit
            </Button>
          )}
        </div>
      ),
      size: 200,
    },
  ];

  const table = useReactTable({
    data: notificationsData,
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
            Notifications
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
            
            {userTypeId === "3" && (
              <>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2 h-9"
                    >
                      <Plus className="w-4 h-4" />
                      Add Notice
                    </Button>
                  </DialogTrigger>
                  <AddNoticeDialog 
                    onSubmit={addNoticeMutation.mutate}
                    isPending={addNoticeMutation.isPending}
                    onClose={() => setIsAddDialogOpen(false)}
                  />
                </Dialog>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between py-1 mb-3">
          <div className="relative w-72">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search notifications..."
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
                                <h4 className="text-sm font-semibold mb-2">Full Details:</h4>
                                <p className="text-sm text-gray-700 whitespace-pre-line">
                                  {row.original.notice_detail}
                                </p>
                                <div className="mt-3 text-xs text-gray-500">
                                  <strong>Posted on:</strong> {moment(row.original.created_at).format('DD-MM-YYYY HH:mm')}
                                  {row.original.is_read === 1 && (
                                    <span className="ml-4 text-green-600">
                                      ✓ Acknowledged
                                    </span>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    ))
                  ) : (
                    <TableRow className="h-12">
                      <TableCell colSpan={columns.length} className="h-24 text-center text-sm">
                        No notifications found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-end space-x-2 py-4">
              <div className="flex-1 text-sm text-muted-foreground">
                Total Notifications: {table.getFilteredRowModel().rows.length}
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
                  <div className="flex-1">
                    <span className="font-semibold text-blue-600 text-sm block">
                      {row.original.notice_name}
                    </span>
                    <span className="text-xs text-gray-500 mt-1 block">
                      Posted on: {moment(row.original.created_at).format('DD-MM-YY')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {row.original.is_read === 0 ? (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAcknowledge(row.original);
                        }}
                        className="h-7 text-xs bg-blue-600 hover:bg-blue-700"
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Acknowledge
                      </Button>
                    ) : (
                      <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded">
                        Acknowledged
                      </span>
                    )}
                    {userTypeId === "3" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(row.original);
                        }}
                        className="h-7 text-xs"
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                    )}
                    {openAccordion === index ? (
                      <ChevronUp className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    )}
                  </div>
                </button>
                {openAccordion === index && (
                  <div className="p-4 bg-gray-50 border-t">
                    <p className="text-sm text-gray-700 whitespace-pre-line mb-3">
                      {row.original.notice_detail}
                    </p>
                    <div className="text-xs text-gray-500">
                      <strong>Posted on:</strong> {moment(row.original.created_at).format('DD-MM-YYYY HH:mm')}
                    </div>
                  </div>
                )}
              </div>
            ))}
            {table.getFilteredRowModel().rows.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No notifications found.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Acknowledge Notice</DialogTitle>
            <DialogDescription>
              Are you sure you have read and understood this notice?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex space-x-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setIsConfirmDialogOpen(false)}
              disabled={markAsReadMutation.isPending}
            >
              <X className="w-4 h-4 mr-1" />
              Cancel
            </Button>
            <Button
              onClick={confirmAcknowledge}
              disabled={markAsReadMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <CheckCircle className="w-4 h-4 mr-1" />
              {markAsReadMutation.isPending ? 'Confirming...' : 'Yes, I Understand'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Notice Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <EditNoticeDialog 
            notice={editingNotice}
            onSubmit={editNoticeMutation.mutate}
            isPending={editNoticeMutation.isPending}
            onClose={() => {
              setIsEditDialogOpen(false);
              setEditingNotice(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Add Notice Dialog Component
const AddNoticeDialog = ({ onSubmit, isPending, onClose }) => {
  const [formData, setFormData] = useState({
    notice_name: '',
    notice_detail: '',
    to_be_sent_to: 'all'
  });

  const sento = [
    { value: 'all', label: 'All' },
    { value: 'users', label: 'Users' },
    { value: 'admins', label: 'Admins' },
    { value: 'viewers', label: 'Viewers' },
    { value: 'donors', label: 'Donors' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Info className="w-5 h-5" />
          Post A New Notice
        </DialogTitle>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="notice_name" className="text-sm font-semibold">
            Notice Title <span className="text-red-500">*</span>
          </Label>
          <Input
            id="notice_name"
            value={formData.notice_name}
            onChange={(e) => handleChange('notice_name', e.target.value)}
            className="w-full"
            placeholder="Enter notice title"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="notice_detail" className="text-sm font-semibold">
            Notice Details <span className="text-red-500">*</span>
          </Label>
          <textarea
            id="notice_detail"
            value={formData.notice_detail}
            onChange={(e) => handleChange('notice_detail', e.target.value)}
            className="w-full min-h-[100px] p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500"
            placeholder="Enter notice details"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="to_be_sent_to" className="text-sm font-semibold">
            Send To <span className="text-red-500">*</span>
          </Label>
          <Select value={formData.to_be_sent_to} onValueChange={(value) => handleChange('to_be_sent_to', value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select recipient" />
            </SelectTrigger>
            <SelectContent>
              {sento.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter className="flex space-x-2 justify-end pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isPending}
          >
            <X className="w-4 h-4 mr-1" />
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <CheckCircle className="w-4 h-4 mr-1" />
            {isPending ? 'Posting...' : 'Post Notice'}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

// Edit Notice Dialog Component
const EditNoticeDialog = ({ notice, onSubmit, isPending, onClose }) => {
  const [formData, setFormData] = useState({
    notice_name: '',
    notice_detail: '',
    to_be_sent_to: 'all',
    status: 'Active'
  });

  const sento = [
    { value: 'all', label: 'All' },
    { value: 'users', label: 'Users' },
    { value: 'admins', label: 'Admins' },
    { value: 'viewers', label: 'Viewers' },
    { value: 'donors', label: 'Donors' },
  ];

  const statusOptions = [
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' },
  ];

  useEffect(() => {
    if (notice) {
      setFormData({
        notice_name: notice.notice_name || '',
        notice_detail: notice.notice_detail || '',
        to_be_sent_to: notice.to_be_sent_to || 'all',
        status: notice.status || 'Active'
      });
    }
  }, [notice]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (notice) {
      onSubmit({ id: notice.id, noticeData: formData });
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Edit className="w-5 h-5" />
          Edit Notice
        </DialogTitle>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="edit_notice_name" className="text-sm font-semibold">
            Notice Title <span className="text-red-500">*</span>
          </Label>
          <Input
            id="edit_notice_name"
            value={formData.notice_name}
            onChange={(e) => handleChange('notice_name', e.target.value)}
            className="w-full"
            placeholder="Enter notice title"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit_notice_detail" className="text-sm font-semibold">
            Notice Details <span className="text-red-500">*</span>
          </Label>
          <textarea
            id="edit_notice_detail"
            value={formData.notice_detail}
            onChange={(e) => handleChange('notice_detail', e.target.value)}
            className="w-full min-h-[100px] p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500"
            placeholder="Enter notice details"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit_to_be_sent_to" className="text-sm font-semibold">
            Send To <span className="text-red-500">*</span>
          </Label>
          <Select value={formData.to_be_sent_to} onValueChange={(value) => handleChange('to_be_sent_to', value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select recipient" />
            </SelectTrigger>
            <SelectContent>
              {sento.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="edit_status" className="text-sm font-semibold">
            Status <span className="text-red-500">*</span>
          </Label>
          <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter className="flex space-x-2 justify-end pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isPending}
          >
            <X className="w-4 h-4 mr-1" />
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <CheckCircle className="w-4 h-4 mr-1" />
            {isPending ? 'Updating...' : 'Update Notice'}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default Notification;