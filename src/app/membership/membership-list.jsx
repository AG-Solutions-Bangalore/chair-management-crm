import React from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';
import { ArrowLeft, Mail, Search, Download, ChevronDown } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import moment from 'moment';
import Cookies from 'js-cookie';
import mailSentGif from "../../assets/mail-sent-fast.gif";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
import BASE_URL from '@/config/base-url';

const MembershipList = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = Cookies.get('token');
   const userType = Cookies.get('user_type_id');
  const [globalFilter, setGlobalFilter] = React.useState('');
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [mailSending, setMailSending] = React.useState({});

  const { data: memberData, isLoading } = useQuery({
    queryKey: ['member-list', searchParams.get('year')],
    queryFn: async () => {
      const year = searchParams.get('year');
      const serializedMembers = searchParams.get('members');

      if (year && serializedMembers) {
        try {
          const decodedMembers = JSON.parse(atob(decodeURIComponent(serializedMembers)));
          return {
            members: decodedMembers,
            year: year
          };
        } catch (error) {
          throw new Error('Failed to decode member data');
        }
      } else {
        throw new Error('No data found in URL');
      }
    },
    retry: false,
  });

  const sendEmailMutation = useMutation({
    mutationFn: async (memberId) => {
      const response = await axios.get(`${BASE_URL}/api/send-membership-renewal-email/${memberId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return response.data;
    },
    onSuccess: (data, memberId) => {
      toast.success(data.message || 'Email sent successfully');
      setMailSending(prev => ({ ...prev, [memberId]: false }));
    },
    onError: (error, memberId) => {
      const message = error.response?.data?.message || 'Failed to send email';
      toast.error(message);
      setMailSending(prev => ({ ...prev, [memberId]: false }));
    }
  });

  const handleSendEmail = (memberId, email) => {
    if (!email || email.toLowerCase() === 'null') {
      toast.error('No email address available for this member');
      return;
    }

    setMailSending(prev => ({ ...prev, [memberId]: true }));
    sendEmailMutation.mutate(memberId);
  };

  const handleExportCSV = () => {
    if (!memberData?.members?.length) {
      toast.error('No data to export');
      return;
    }

    try {
      const headers = [
        'S. No.',
        'Full Name',
        'Type',
        'Spouse/Contact',
        'Mobile',
        'Email',
        'Joining Date',
        'Validity',
        'Chapter'
      ];

      const csvData = memberData.members.map((member, index) => [
        index + 1,
        member.indicomp_full_name || '',
        member.indicomp_type || '',
        member.indicomp_type === 'Individual' ? member.indicomp_spouse_name : member.indicomp_com_contact_name || '',
        member.indicomp_mobile_phone || '',
        member.indicomp_email || '',
        member.joining_date ? moment(member.joining_date).format('DD-MM-YYYY') : '',
        member.last_payment_vailidity ? `31-3-${member.last_payment_vailidity}` : '',
        member.chapter_name || ''
      ]);

      const csvContent = [
        headers.join(','),
        ...csvData.map(row => row.map(field => `"${field}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      const filename = memberData.year === 'all' 
        ? `all-members-${moment().format('DD-MM-YYYY')}.csv`
        : `members-${memberData.year}-${moment().format('DD-MM-YYYY')}.csv`;
      
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success('CSV exported successfully');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export CSV');
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
    },
    {
      accessorKey: 'indicomp_full_name',
      id: 'Full Name',
      header: 'Full Name',
      cell: ({ row }) => (
        <div className="font-medium text-gray-900 text-xs">
          {row.getValue('Full Name')}
        </div>
      ),
    },
    {
      accessorKey: 'indicomp_type',
      id: 'Type',
      header: 'Type',
      cell: ({ row }) => (
        <Badge variant="outline" className="capitalize text-xs">
          {row.getValue('Type')}
        </Badge>
      ),
    },
    {
      accessorKey: 'spouse_contact',
      id: 'Spouse/Contact',
      header: 'Spouse/Contact',
      cell: ({ row }) => {
        const indicompType = row.original.indicomp_type;
        const spouseName = row.original.indicomp_spouse_name;
        const contactName = row.original.indicomp_com_contact_name;
        
        return (
          <div className="text-xs">
            {indicompType === 'Individual' ? spouseName : contactName}
          </div>
        );
      },
    },
    {
      accessorKey: 'indicomp_mobile_phone',
      id: 'Mobile',
      header: 'Mobile',
      cell: ({ row }) => (
        <div className="text-xs font-mono">
          {row.getValue('Mobile')}
        </div>
      ),
    },
    {
      accessorKey: 'indicomp_email',
      id: 'Email',
      header: 'Email',
      cell: ({ row }) => {
        const email = row.getValue('Email');
        const isValidEmail = email && email.toLowerCase() !== 'null';
        
        return (
          <div className={`text-xs ${isValidEmail ? 'text-blue-600' : 'text-gray-400'}`}>
            {isValidEmail ? email : 'No email'}
          </div>
        );
      },
    },
    {
      accessorKey: 'joining_date',
      id: 'Joining Date',
      header: 'Joining Date',
      cell: ({ row }) => {
        const joiningDate = row.getValue('Joining Date');
        return (
          <div className="text-xs">
            {joiningDate ? moment(joiningDate).format('DD-MM-YYYY') : '-'}
          </div>
        );
      },
    },
    {
      accessorKey: 'last_payment_vailidity',
      id: 'Validity',
      header: 'Validity',
      cell: ({ row }) => {
        const validity = row.getValue('Validity');
        return (
          <Badge variant="secondary" className="font-mono text-xs">
            {validity ? `31-3-${validity}` : '-'}
          </Badge>
        );
      },
    },
    {
      accessorKey: 'chapter_name',
      id: 'Chapter',
      header: 'Chapter',
      cell: ({ row }) => (
        <div className="text-xs">
          {row.getValue('Chapter')}
        </div>
      ),
    },
    ...(userType !== '4'
      ? [
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
          const memberId = row.original.id;
          const email = row.original.indicomp_email;
          const isValidEmail = email && email.toLowerCase() !== 'null';
      
          return (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSendEmail(memberId, email)}
              disabled={!isValidEmail || mailSending[memberId]}
              className="h-7 w-7 p-0 flex items-center justify-center"
            >
              {mailSending[memberId] ? (
               
                <img
                  src={mailSentGif}
                  alt="Sending..."
                  className="h-5 w-5 object-contain"
                />
              ) : (
                <Mail
                  className={`w-3 h-3 ${isValidEmail ? 'text-blue-500' : 'text-gray-300'}`}
                />
              )}
            </Button>
          );
        },
      }
    ]
    : []),
      
  ];

  const table = useReactTable({
    data: memberData?.members || [],
    columns,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
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
      <TableRow key={index} className="animate-pulse h-10">
        {table.getVisibleFlatColumns().map((column) => (
          <TableCell key={column.id} className="py-1">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
          </TableCell>
        ))}
      </TableRow>
    ));
  };

  if (isLoading) {
    return (
      <div className="w-full border rounded-md shadow-sm">
        <div className="p-3 border-b bg-muted/50">
          <Skeleton className="h-5 w-48" />
        </div>
        <div className="p-3">
          <div className="flex items-center justify-between py-1 mb-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-8 w-28" />
          </div>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="h-8">
                      <Skeleton className="h-4 w-16" />
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              <TableShimmer />
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  if (!memberData?.members?.length) {
    return (
      <div className="w-full border rounded-md shadow-sm">
        <div className="p-3 border-b bg-muted/50">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/membership/dashboard')}
              className="flex items-center gap-1 h-8"
            >
              <ArrowLeft className="w-3 h-3" />
              Back
            </Button>
            <h2 className="text-sm font-semibold">Member List</h2>
          </div>
        </div>
        <div className="p-6 text-center">
          <div className="text-gray-400 mb-3 text-sm">No member data available</div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/membership/dashboard')}
          >
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full border rounded-md shadow-sm">
      {/* Header */}
      <div className="p-3 border-b bg-muted/50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/membership/dashboard')}
              className="flex items-center gap-1 h-8"
            >
              <ArrowLeft className="w-3 h-3" />
              Back
            </Button>
            <div>
              <h2 className="text-sm font-semibold">
                {memberData.year === 'all' 
                  ? 'All Members' 
                  : `Members ${memberData.year}`
                }
              </h2>
              <p className="text-xs text-gray-600">
                {memberData.members.length} member{memberData.members.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1 h-8"
            onClick={handleExportCSV}
          >
            <Download className="w-3 h-3" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        {/* Search and Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-1 mb-2">
          <div className="relative w-full sm:w-56">
            <Search className="absolute left-2 top-2 h-3 w-3 text-gray-500" />
            <Input
              placeholder="Search members..."
              value={table.getState().globalFilter || ''}
              onChange={(event) => table.setGlobalFilter(event.target.value)}
              className="pl-7 h-8 text-xs"
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 text-xs">
                Columns <ChevronDown className="ml-1 h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36">
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
        <div className="rounded-md border min-h-[16rem] overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead 
                      key={header.id} 
                      className="h-8 px-2 bg-muted/50 text-xs font-medium"
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
                  <TableRow
                    key={row.id}
                    className="h-10 hover:bg-gray-50"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="px-2 py-1 text-xs">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell 
                    colSpan={columns.length} 
                    className="h-20 text-center text-xs text-gray-500"
                  >
                    No members found matching your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 py-3">
          <div className="text-xs text-muted-foreground">
            Showing {table.getRowModel().rows.length} of{' '}
            {memberData.members.length} members
          </div>
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="h-8 text-xs"
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="h-8 text-xs"
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MembershipList;