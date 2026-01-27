import React, {  useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { ArrowLeft, Building, Save, X, Loader2, Info, Search, ChevronDown, ArrowUpDown, Mail, Phone, User, Edit } from 'lucide-react';

import { fetchChapterEditById } from '@/api';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
import CreateUserSuperadmin from './create-user-superadmin';
import EditUserSuperadmin from './edit-user-superadmin';


const UserListSuperadmin = ({id,isLoading,isError,refetch,isFetching,users,ImageUrl,chapterCodeForCreateUser}) => {
    
      const navigate = useNavigate();
   
    
    
    const [editUser, setEditUser] = useState(null);
    

    
      const [userSorting, setUserSorting] = useState([]);
      const [userColumnFilters, setUserColumnFilters] = useState([]);
      const [userColumnVisibility, setUserColumnVisibility] = useState({});
      const [userRowSelection, setUserRowSelection] = useState({});
      const [userGlobalFilter, setUserGlobalFilter] = useState("");
    
      const userColumns = [
        {
            id: "Image",
            header: "Image",
            cell: ({ row }) => {
              const { image, name } = row.original;
              const imageUrl = ImageUrl?.find(img => img.image_for === "User")?.image_url || "";
              const userImageUrl = image ? `${imageUrl}${image}` : "";
              
              return (
                <div className="flex justify-center">
                  {userImageUrl ? (
                    <img 
                      src={userImageUrl} 
                      alt={name}
                      className="h-8 w-8 rounded-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className={`h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center ${userImageUrl ? 'hidden' : 'flex'}`}>
                    <User className="h-4 w-4 text-gray-500" />
                  </div>
                </div>
              );
            },
            size: 80,
          },
        {
            accessorKey: "name",
            id: "UserInfo",
            header: ({ column }) => (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="px-2 h-8 text-xs"
              >
                User Info
                <ArrowUpDown className="ml-1 h-3 w-3" />
              </Button>
            ),
            cell: ({ row }) => {
              const { name, email, phone } = row.original;
              return (
                <div className="flex items-start gap-2">
                  <User className="h-4 w-4 text-gray-500 mt-[2px]" />
                  <div className="flex flex-col">
                    <div className="text-[13px] font-medium">{name || "—"}</div>
                    <div className="text-[12px] text-gray-600 flex items-center gap-1">
                      <Mail className="h-3 w-3 text-red-600" />
                      {email || "N/A"}
                    </div>
                    <div className="text-[12px] text-gray-600 flex items-center gap-1">
                      <Phone className="h-3 w-3 text-blue-600" />
                      {phone || "N/A"}
                    </div>
                  </div>
                </div>
              );
            },
            size: 240,
          },
       
        {
          id: "actions",
          header: "Action",
          cell: ({ row }) => {
            const userData = row.original;
            return (
              <div className="flex flex-row gap-1">
                 <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 text-xs"
                                    onClick={() => setEditUser(userData)} 
                                  >
                                    Edit
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Edit User</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                {/* <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs"
                      >
                        School
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Edit School</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider> */}
              </div>
            );
          },
        },
      ];
    
      const userTable = useReactTable({
        data: users,
        columns: userColumns,
        onSortingChange: setUserSorting,
        onColumnFiltersChange: setUserColumnFilters,
        onGlobalFilterChange: setUserGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setUserColumnVisibility,
        onRowSelectionChange: setUserRowSelection,
        state: {
          sorting: userSorting,
          columnFilters: userColumnFilters,
          globalFilter: userGlobalFilter,
          columnVisibility: userColumnVisibility,
          rowSelection: userRowSelection,
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
            {userTable.getVisibleFlatColumns().map((column) => (
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
                  Error Fetching Chapter Data
                </div>
                <Button onClick={() => refetch()} variant="outline" size="sm">
                  Try Again
                </Button>
              </div>
            </div>
          </div>
        );
      }
    
      if (isLoading) {
        return (
          <div className="min-h-[20rem] bg-gradient-to-br from-slate-50 to-blue-50/30 flex items-center justify-center">
            <div className="flex items-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Loading chapter data...</span>
            </div>
          </div>
        );
      }
    
  return (
   <div className="pt-1">
                 <div className="flex items-center justify-between py-1 ">
                   <div className="relative w-64">
                     <Search className="absolute left-2 top-2.5 h-3 w-3 text-gray-500" />
                     <Input
                       placeholder="Search users..."
                       value={userTable.getState().globalFilter || ""}
                       onChange={(event) => userTable.setGlobalFilter(event.target.value)}
                       className="pl-7 h-8 text-xs bg-gray-50 border-gray-200 focus:border-gray-300 focus:ring-gray-200"
                     />
                   </div>
                   <div className="flex flex-col md:flex-row md:ml-auto gap-2 w-full md:w-auto">
                  <CreateUserSuperadmin chapterCodeForCreateUser={chapterCodeForCreateUser}/>
                   </div>
                 </div>
           
                 {/* Table */}
                 <div className="rounded-none border min-h-[20rem] flex flex-col">
                   <Table className="flex-1">
                     <TableHeader>
                       {userTable.getHeaderGroups().map((headerGroup) => (
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
                       {isFetching && !userTable.getRowModel().rows.length ? (
                         <TableShimmer />
                       ) : userTable.getRowModel().rows?.length ? (
                         userTable.getRowModel().rows.map((row) => (
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
                           <TableCell colSpan={userColumns.length} className="h-24 text-center text-xs">
                             No users found for this chapter.
                           </TableCell>
                         </TableRow>
                       )}
                     </TableBody>
                   </Table>
                 </div>
           
                 {/* Pagination */}
                 <div className="flex items-center justify-end space-x-2 py-2 ">
                   <div className="flex-1 text-xs text-muted-foreground">
                     Total Users: {userTable.getFilteredRowModel().rows.length}
                   </div>
                   <div className="space-x-2">
                     <Button
                       variant="outline"
                       size="sm"
                       onClick={() => userTable.previousPage()}
                       disabled={!userTable.getCanPreviousPage()}
                       className="h-8 text-xs"
                     >
                       Previous
                     </Button>
                     <Button
                       variant="outline"
                       size="sm"
                       onClick={() => userTable.nextPage()}
                       disabled={!userTable.getCanNextPage()}
                       className="h-8 text-xs"
                     >
                       Next
                     </Button>
                   </div>
                 </div>
                  {editUser && (
                         <EditUserSuperadmin
                           userData={editUser}
                           ImageUrl={ImageUrl}
                           open={!!editUser}
                           onClose={() => setEditUser(null)}
                         />
                       )}
               </div>
  )
}

export default UserListSuperadmin