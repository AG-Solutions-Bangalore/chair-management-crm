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
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PURCHASE_PRODUCT_API } from "@/constants/apiConstants";
import { useApiMutation } from "@/hooks/useApiMutation";
import { useGetApiMutation } from "@/hooks/useGetApiMutation";
import { Edit, Trash2 } from "lucide-react";
import moment from "moment";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const PurchaseProductList = () => {
  const navigate = useNavigate();
  const userType = useSelector((state) => state.auth?.user?.user_type);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const { data, isLoading, isError, refetch } = useGetApiMutation({
    url: PURCHASE_PRODUCT_API.list,
    queryKey: ["purchase-product-list"],
  });

  const { trigger: deletePurchaseProduct, loading: deleting } =
    useApiMutation();

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;

    try {
      const res = await deletePurchaseProduct({
        url: PURCHASE_PRODUCT_API.deleteById(deleteId),
        method: "delete",
      });

      if (res?.code === 201) {
        toast.success(res?.message || "Purchase Product deleted successfully");
        refetch();
      } else {
        toast.error(res?.message || "Failed to delete Purchase Product");
      }
    } catch (err) {
      toast.error(err?.message || "Failed to delete Purchase Product");
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
    { header: "Ref", accessorKey: "purchase_p_ref"},
    {
      header: "Date",
      accessorKey: "purchase_p_date",
      cell: ({ row }) => {
        const date = row.original.purchase_p_date ?? "";
        return date ? moment(date).format("DD MMM YYYY") : "";
      },
    },
    { header: "Vendor", accessorKey: "vendor_name"},
    { header: "Quantity", accessorKey: "total_qnty"},
    {
      header: "Actions",
      accessorKey: "actions",
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            size="icon"
            variant="outline"
            onClick={() =>
              navigate(`/purchase-product/edit/${row.original.id}`)
            }
          >
            <Edit className="h-4 w-4" />
          </Button>
          {userType != 1 && (
            <Button
              size="icon"
              variant="outline"
              onClick={() => handleDeleteClick(row.original.id)}
              disabled={deleting}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
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
        searchPlaceholder="Search Purchase Product..."
        addButton={{
          to: "/purchase-product/create",
          label: "Add Purchase Product",
        }}
        expandableRow={(row) => {
          const totalRate = row.subs
            ?.reduce((acc, item) => acc + Number(item.product_rate || 0), 0)
            .toFixed(2);
          const totalQty = row.subs?.reduce(
            (acc, item) => acc + Number(item.purchase_p_sub_qnty || 0),
            0,
          );

          const totalAmount = row.subs
            ?.reduce(
              (acc, item) =>
                acc +
                Number(item.product_rate || 0) *
                  Number(item.purchase_p_sub_qnty || 0),
              0,
            )
            .toFixed(2);
          return (
            <div className="p-2">
              <Table className="border">
                <TableHeader className="border-b">
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    {/* <TableHead>Rate</TableHead> */}
                    <TableHead>Quantity</TableHead>
                    {/* <TableHead>Amount</TableHead> */}
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {row.subs?.length ? (
                    row.subs.map((sub) => (
                      <TableRow key={sub.id}>
                        <TableCell>{sub.product_name}</TableCell>
                        <TableCell>{sub.product_category}</TableCell>
                        {/* <TableCell>{sub.product_rate}</TableCell> */}
                        <TableCell>{sub.purchase_p_sub_qnty}</TableCell>
                        {/* <TableCell>
                          {Number(sub.product_rate) *
                            Number(sub.purchase_p_sub_qnty)}
                        </TableCell> */}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">
                        No purchase product found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell />
                    <TableCell className="font-semibold">Total</TableCell>
                    {/* <TableCell className="font-semibold">{totalRate}</TableCell> */}
                    <TableCell className="font-semibold">{totalQty}</TableCell>
                    {/* <TableCell className="font-semibold">
                      {totalAmount}
                    </TableCell> */}
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
              Delete Purchase Product
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this Purchase Product? This action
              cannot be undone."
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

export default PurchaseProductList;
