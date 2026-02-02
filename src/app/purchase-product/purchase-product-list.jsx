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
import { PURCHASE_PRODUCT_API } from "@/constants/apiConstants";
import { useApiMutation } from "@/hooks/useApiMutation";
import { useGetApiMutation } from "@/hooks/useGetApiMutation";
import { Edit, Trash2 } from "lucide-react";
import moment from "moment";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const PurchaseProductList = () => {
  const navigate = useNavigate();

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
    { header: "Product No", accessorKey: "purchase_p_no" },
    { header: "Ref", accessorKey: "purchase_p_ref", enableSorting: false },
    {
      header: "Date",
      accessorKey: "purchase_p_date",
      enableSorting: false,
      cell: ({ row }) => {
        const date = row.original.purchase_p_date ?? "";
        return date ? moment(date).format("DD MMM YYYY") : "";
      },
    },
    { header: "Vendor", accessorKey: "vendor_name", enableSorting: false },
    { header: "Quantity", accessorKey: "total_qnty", enableSorting: false },
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
        searchPlaceholder="Search Purchase Product..."
        addButton={{
          to: "/purchase-product/create",
          label: "Add Purchase Product",
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
