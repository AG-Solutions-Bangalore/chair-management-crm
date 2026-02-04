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
import { PRODUCTION_API } from "@/constants/apiConstants";
import { PRODUCTION_STATUSES } from "@/constants/productionConstants";
import { useApiMutation } from "@/hooks/useApiMutation";
import { useGetApiMutation } from "@/hooks/useGetApiMutation";
import { ChevronDown, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import ProductionEditDialog from "./production-edit";

const updateProduction = (onSuccess) => {
  const { trigger, loading } = useApiMutation();

  const updateProductionStatus = async (productionId, status) => {
    try {
      const res = await trigger({
        url: PRODUCTION_API.updateStatus(productionId),
        method: "patch",
        data: { production_p_status: status },
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

  return { updateProductionStatus, loading };
};
const ProductionList = () => {
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const { data, isLoading, isError, refetch } = useGetApiMutation({
    url: PRODUCTION_API.list,
    queryKey: ["production-list"],
  });
  const { updateProductionStatus, loading } = updateProduction(refetch);

  const { trigger: deleteProduction, loading: deleting } = useApiMutation();

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;

    try {
      const res = await deleteProduction({
        url: PRODUCTION_API.deleteById(deleteId),
        method: "delete",
      });

      if (res?.code === 201) {
        toast.success(res?.message || "Production Data deleted successfully");
        refetch();
      } else {
        toast.error(res?.message || "Failed to delete Production");
      }
    } catch (err) {
      toast.error(err?.message || "Failed to delete Production");
    } finally {
      setDeleteDialogOpen(false);
      setDeleteId(null);
    }
  };

  const columns = [
    { header: "Production Ref", accessorKey: "production_p_ref" },
    { header: "Order Ref", accessorKey: "order_ref" },
    { header: "Date", accessorKey: "production_p_date", enableSorting: false },
    {
      header: "Product Name",
      accessorKey: "product_name",
      enableSorting: false,
    },
    {
      header: "Quantity",
      accessorKey: "production_p_qnty",
      enableSorting: false,
    },
    {
      header: "Status",
      accessorKey: "production_p_status",
      cell: ({ row }) => {
        const [open, setOpen] = useState(false);
        const status = row.original.production_p_status;

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
              {PRODUCTION_STATUSES.map((item) => (
                <Button
                  key={item?.id}
                  variant={item?.value === status ? "secondary" : "ghost"}
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => {
                    updateProductionStatus(row.original.id, item?.value);
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
        return (
          <div className="flex gap-2">
            <Button
              size="icon"
              variant="outline"
              onClick={() => {
                setSelectedId(row.original.id);
                setOpen(true);
              }}
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
        );
      },
      enableSorting: false,
    },
  ];

  if (isError) return <ApiErrorPage onRetry={refetch} />;

  return (
    <>
      {(isLoading || loading) && <LoadingBar />}{" "}
      <DataTable
        data={data?.data?.data || []}
        columns={columns}
        pageSize={10}
        searchPlaceholder="Search Production..."
        addButton={{
          to: "/production/create",
          label: "Add Production",
        }}
      />
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600">
              Delete Production
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this Production Data? This action
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
      {open && (
        <ProductionEditDialog
          open={open}
          productionId={selectedId}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
};

export default ProductionList;
