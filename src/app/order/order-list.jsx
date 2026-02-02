import ApiErrorPage from "@/components/api-error/api-error";
import DataTable from "@/components/common/data-table";
import LoadingBar from "@/components/loader/loading-bar";
import ToggleStatus from "@/components/toogle/status-toogle";
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
import { BOM_API, ORDERS_API } from "@/constants/apiConstants";
import { useApiMutation } from "@/hooks/useApiMutation";
import { useGetApiMutation } from "@/hooks/useGetApiMutation";
import { Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
const OrderList = () => {
  const navigate = useNavigate();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const { data, isLoading, isError, refetch } = useGetApiMutation({
    url: ORDERS_API.list,
    queryKey: ["order-list"],
  });

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
    { header: "Ref", accessorKey: "order_ref" },
    { header: "Order Date", accessorKey: "order_date", enableSorting: false },
    {
      header: "Vendor Name",
      accessorKey: "vendor_name",
      enableSorting: false,
    },
    {
      header: "Delivery Date",
      accessorKey: "order_delivery_date",
      enableSorting: false,
    },
    { header: "Quantity", accessorKey: "total_qnty", enableSorting: false },
    {
      header: "Total Amount",
      accessorKey: "total_amount",
      enableSorting: false,
    },
    {
      header: "Status",
      accessorKey: "order_status",
      cell: ({ row }) => (
        <ToggleStatus
          initialStatus={row.original.order_status}
          apiUrl={BOM_API.updateStatus(row.original.id)}
          payloadKey="product_status"
          onSuccess={refetch}
        />
      ),
    },
    {
      header: "Actions",
      accessorKey: "actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            size="icon"
            variant="outline"
            onClick={() => navigate(`/order/edit/${row.original.id}`)}
          >
            <Edit className="h-4 w-4" />
          </Button>

          <Button
            size="icon"
            variant="outline"
            onClick={() => handleDeleteClick(row.original.id)}
            disabled={deleting}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
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
                    <TableCell className="font-semibold">
                      Total
                    </TableCell>
                    <TableCell className="font-semibold">{totalRate}</TableCell>
                    <TableCell className="font-semibold">{totalQty}</TableCell>
                    <TableCell className="font-semibold">
                      {totalAmount}
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
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
