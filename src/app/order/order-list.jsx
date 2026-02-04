import ApiErrorPage from "@/components/api-error/api-error";
import DataTable from "@/components/common/data-table";
import LoadingBar from "@/components/loader/loading-bar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ORDERS_API } from "@/constants/apiConstants";
import { ORDER_STATUSES } from "@/constants/orderConstants";
import { useApiMutation } from "@/hooks/useApiMutation";
import { useGetApiMutation } from "@/hooks/useGetApiMutation";
import { ChevronDown, Edit, Factory, Trash2 } from "lucide-react";
import moment from "moment";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const useOrderStatusUpdate = (onSuccess) => {
  const { trigger, loading } = useApiMutation();

  const updateOrderStatus = async (orderId, status) => {
    try {
      const res = await trigger({
        url: ORDERS_API.updateStatus(orderId),
        method: "patch",
        data: { order_status: status },
      });

      if (res?.code === 201) {
        toast.success(res?.message || "Status updated successfully");
        onSuccess?.();
      } else {
        toast.error(res?.message || "Failed to update status");
      }
    } catch (err) {
      toast.error(err?.message || "Something went wrong");
    }
  };

  return { updateOrderStatus, loading };
};
const OrderList = () => {
  const navigate = useNavigate();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const { data, isLoading, isError, refetch } = useGetApiMutation({
    url: ORDERS_API.list,
    queryKey: ["order-list"],
  });
  const { updateOrderStatus } = useOrderStatusUpdate(refetch);

  const { trigger: deleteOrder, loading: deleting } = useApiMutation();

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;

    try {
      const res = await deleteOrder({
        url: ORDERS_API.deleteById(deleteId),
        method: "delete",
      });

      if (res?.code === 201) {
        toast.success(res?.message || "Order deleted successfully");
        refetch();
      } else {
        toast.error(res?.message || "Failed to delete Order");
      }
    } catch (err) {
      toast.error(err?.message || "Failed to delete Order");
    } finally {
      setDeleteDialogOpen(false);
      setDeleteId(null);
    }
  };

  const columns = [
    {
      header: "S.No",
      cell: ({ row }) => row.index + 1,
    },
    { header: "Ref", accessorKey: "order_ref" },
    {
      header: "Date",
      accessorKey: "order_date",
      cell: ({ row }) => {
        const date = row.original.order_date ?? "";
        return date ? moment(date).format("DD MMM YYYY") : "";
      },
    },
    {
      header: "Vendor Name",
      accessorKey: "vendor_name",
    },
    {
      header: "Delivery Date",
      accessorKey: "order_delivery_date",
    },
    { header: "Quantity", accessorKey: "total_qnty" },
    {
      header: "Total Amount",
      accessorKey: "total_amount",
    },
    {
      header: "Status",
      accessorKey: "order_status",
      cell: ({ row }) => {
        const [open, setOpen] = useState(false);
        const status = row.original.order_status;

        return (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="w-[160px] justify-between"
              >
                {status}
                <ChevronDown className="h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[160px] p-1">
              {ORDER_STATUSES.map((item) => (
                <Button
                  key={item?.id}
                  variant={item?.value === status ? "secondary" : "ghost"}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => {
                    updateOrderStatus(row.original.id, item?.value);
                    setOpen(false);
                  }}
                >
                  {item?.value}
                </Button>
              ))}
            </PopoverContent>
          </Popover>
        );
      },
    },

    {
      header: "Actions",
      accessorKey: "actions",
      cell: ({ row }) => {
        const status = row.original.order_status;
        return (
          <div className="flex gap-2">
            <Button
              size="icon"
              variant="outline"
              onClick={() => navigate(`/order/edit/${row.original.id}`)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            {status === "In Production" && (
              <Button
                size="icon"
                variant="outline"
                onClick={() =>
                  navigate(`/order/production/create/${row.original.id}`)
                }
              >
                <Factory className="h-4 w-4" />
              </Button>
            )}
            <Button
              size="icon"
              variant="outline"
              onClick={() => handleDeleteClick(row.original.id)}
              disabled={deleting}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
      enableSorting: false,
    },
  ];

  if (isLoading) return <LoadingBar />;
  if (isError) return <ApiErrorPage onRetry={refetch} />;

  return (
    <>
      <DataTable
        data={data?.data?.data || []}
        columns={columns}
        pageSize={10}
        searchPlaceholder="Search Order..."
        addButton={{
          to: "/order/create",
          label: "Add Order",
        }}
        expandableRow={(row) => {
          const totalRate = row.subs
            ?.reduce((acc, item) => acc + Number(item.product_rate || 0), 0)
            .toFixed(2);
          const totalQty = row.subs?.reduce(
            (acc, item) => acc + Number(item.order_p_sub_qnty || 0),
            0,
          );

          const totalAmount = row.subs
            ?.reduce(
              (acc, item) => acc + Number(item.order_p_sub_amount || 0),
              0,
            )
            .toFixed(2);

          return (
            <>
              <div className="p-2">
                <Table className="border">
                  <TableHeader className="border-b">
                    <TableRow>
                      <TableHead>Product Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Rate</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Amount</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {row.subs?.length ? (
                      row.subs.map((sub) => (
                        <TableRow key={sub.id}>
                          <TableCell>{sub.product_name}</TableCell>
                          <TableCell>{sub.product_category}</TableCell>
                          <TableCell>{sub.product_rate}</TableCell>
                          <TableCell>{sub.order_p_sub_qnty}</TableCell>
                          <TableCell>{sub.order_p_sub_amount}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center">
                          No products found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>

                  <TableFooter>
                    <TableRow>
                      <TableCell />
                      <TableCell className="font-semibold">Total</TableCell>
                      <TableCell className="font-semibold">
                        {totalRate}
                      </TableCell>
                      <TableCell className="font-semibold">
                        {totalQty}
                      </TableCell>
                      <TableCell className="font-semibold">
                        {totalAmount}
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>

              {/* //             "production": [
                //     {
                //         "id": 16,
                //         "production_p_ref": "PRO-2025-26-3",
                //         "production_p_date": "2026-01-27",
                //         "product_name": "Office Chair Standard",
                //         "production_p_qnty": "1",
                //         "production_p_amount": "6767.00",
                //         "production_p_status": "Finish"
                //     }
                // ] */}
              <div className="p-2">
                <Table className="border">
                  <TableHeader className="border-b">
                    <TableRow>
                      <TableHead>Ref</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Product Name</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {row.subs?.length ? (
                      row.subs.map((sub) => (
                        <TableRow key={sub.id}>
                          <TableCell>{sub.product_name}</TableCell>
                          <TableCell>{sub.product_category}</TableCell>
                          <TableCell>{sub.product_rate}</TableCell>
                          <TableCell>{sub.order_p_sub_qnty}</TableCell>
                          <TableCell>{sub.order_p_sub_amount}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center">
                          No products found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>

                  <TableFooter>
                    <TableRow>
                      <TableCell />
                      <TableCell className="font-semibold">Total</TableCell>
                      <TableCell className="font-semibold">
                        {totalRate}
                      </TableCell>
                      <TableCell className="font-semibold">
                        {totalQty}
                      </TableCell>
                      <TableCell className="font-semibold">
                        {totalAmount}
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>
            </>
          );
        }}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600">
              Delete Order
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this Order? This action cannot be
              undone."
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default OrderList;
