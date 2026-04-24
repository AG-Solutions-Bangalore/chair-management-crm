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
import { RETURN_ORDERS_API } from "@/constants/apiConstants";
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
        url: RETURN_ORDERS_API.updateStatus(orderId),
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
const ReturnOrderList = () => {
  const navigate = useNavigate();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const { data, isLoading, isError, refetch } = useGetApiMutation({
    url: RETURN_ORDERS_API.list,
    queryKey: ["return-order-list"],
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
        url: RETURN_ORDERS_API.deleteById(deleteId),
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
    { header: "Return Ref", accessorKey: "order_ref" },
    {
      header: "Return Date",
      accessorKey: "order_date",
      cell: ({ row }) => {
        const date = row.original.order_date ?? "";
        return date ? moment(date).format("DD MMM YYYY") : "";
      },
    },
    {
      header: "Vendor",
      accessorKey: "vendor_name",
    },
    { header: "Quantity", accessorKey: "total_qnty" },
    {
      header: "Amount",
      accessorKey: "total_amount",
    },

    {
      header: "Actions",
      accessorKey: "actions",
      cell: ({ row }) => {
        return (
          <div className="flex gap-2">
            <Button
              size="icon"
              variant="outline"
              title="Edit Return Order"
              onClick={() => navigate(`/return-order/edit/${row.original.id}`)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              onClick={() => handleDeleteClick(row.original.id)}
              disabled={deleting}
              title="Delete Return Order"
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
        searchPlaceholder="Search Return Order..."
        addButton={{
          to: "/return-order/create",
          label: "Add Return Order",
        }}
        expandableRow={(row) => {
          const totalRate = row.subs
            ?.reduce((acc, item) => acc + Number(item.product_rate || 0), 0)
            .toFixed(2);
          const totalQty = row.subs?.reduce(
            (acc, item) => acc + Number(item.order_p_sub_qnty || 0),
            0,
          );
          const totalQtyProduction = row.production?.reduce(
            (acc, item) => acc + Number(item.production_p_qnty || 0),
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
                <h2 className="mb-2 text-bold text-lg">Product Details</h2>
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
              {row.production?.length > 0 && (
                <div className="p-2">
                  <h2 className="mb-2 text-bold text-lg">Production Details</h2>

                  <Table className="border">
                    <TableHeader className="border-b">
                      <TableRow>
                        <TableHead>Production Ref</TableHead>
                        <TableHead>Production Date</TableHead>
                        <TableHead>Product Name</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {row.production?.length ? (
                        row.production.map((sub) => (
                          <TableRow key={sub.id}>
                            <TableCell>{sub.production_p_ref}</TableCell>
                            <TableCell>
                              {moment(sub.production_p_date).format(
                                "DD MMM YYYY",
                              )}
                            </TableCell>
                            <TableCell>{sub.product_name}</TableCell>
                            <TableCell>{sub.production_p_qnty}</TableCell>
                            <TableCell>{sub.production_p_status}</TableCell>
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
                        <TableCell />
                        <TableCell className="font-semibold">Total</TableCell>

                        <TableCell className="font-semibold">
                          {totalQtyProduction}
                        </TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>
                </div>
              )}
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

export default ReturnOrderList;
