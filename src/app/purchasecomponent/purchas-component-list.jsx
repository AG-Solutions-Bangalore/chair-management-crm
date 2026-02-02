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
import { PURCHASE_COMPONENT_API } from "@/constants/apiConstants";
import { useApiMutation } from "@/hooks/useApiMutation";
import { useGetApiMutation } from "@/hooks/useGetApiMutation";
import { Edit, Trash2 } from "lucide-react";
import moment from "moment";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const PurchaseComponentList = () => {
  const navigate = useNavigate();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const { data, isLoading, isError, refetch } = useGetApiMutation({
    url: PURCHASE_COMPONENT_API.list,
    queryKey: ["purchase-component-list"],
  });

  const { trigger: deletePurchaseComponent, loading: deleting } =
    useApiMutation();

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;

    try {
      const res = await deletePurchaseComponent({
        url: PURCHASE_COMPONENT_API.deleteById(deleteId),
        method: "delete",
      });

      if (res?.code === 201) {
        toast.success(
          res?.message || "Purchase Component deleted successfully",
        );
        refetch();
      } else {
        toast.error(res?.message || "Failed to delete Purchase Component");
      }
    } catch (err) {
      toast.error(err?.message || "Failed to delete Purchase Component");
    } finally {
      setDeleteDialogOpen(false);
      setDeleteId(null);
    }
  };

  const columns = [
    { header: "Product No", accessorKey: "purchase_c_no" },
    { header: "Ref", accessorKey: "purchase_c_ref", enableSorting: false },
    {
      header: "Date",
      accessorKey: "purchase_c_date",
      enableSorting: false,
      cell: ({ row }) => {
        const date = row.original.purchase_c_date ?? "";
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
              navigate(`/purchase-component/edit/${row.original.id}`)
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
        searchPlaceholder="Search Purchase Component..."
        addButton={{
          to: "/purchase-component/create",
          label: "Add Purchase Component",
        }}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600">
              Delete Purchase Component
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this Purchase Component? This
              action cannot be undone."
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

export default PurchaseComponentList;
