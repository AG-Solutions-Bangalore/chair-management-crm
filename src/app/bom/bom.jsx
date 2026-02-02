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
import { BOM_API } from "@/constants/apiConstants";
import { useApiMutation } from "@/hooks/useApiMutation";
import { useGetApiMutation } from "@/hooks/useGetApiMutation";
import { Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import BomDialog from "./create-bom";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const BomList = () => {
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const { data, isLoading, isError, refetch } = useGetApiMutation({
    url: BOM_API.list,
    queryKey: ["bom-list"],
  });

  const { trigger: deleteBom, loading: deleting } = useApiMutation();
  const handleCreate = () => {
    setEditId(null);
    setOpen(true);
  };

  const handleEdit = (id) => {
    setEditId(id);
    setOpen(true);
  };
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;

    try {
      const res = await deleteBom({
        url: BOM_API.deleteById(deleteId),
        method: "delete",
      });

      if (res?.code === 201) {
        toast.success(res?.message || "BOM deleted successfully");
        refetch();
      } else {
        toast.error(res?.message || "Failed to delete BOM");
      }
    } catch (err) {
      toast.error(err?.message || "Failed to delete BOM");
    } finally {
      setDeleteDialogOpen(false);
      setDeleteId(null);
    }
  };

  const columns = [
    { header: "Code", accessorKey: "product_code" },
    { header: "Name", accessorKey: "product_name", enableSorting: false },
    {
      header: "Category",
      accessorKey: "product_category",
      enableSorting: false,
    },
    { header: "Quantity", accessorKey: "total_sub_qnty", enableSorting: false },
    { header: "Rate", accessorKey: "product_rate", enableSorting: false },
    {
      header: "Status",
      accessorKey: "bom_status",
      cell: ({ row }) => (
        <ToggleStatus
          initialStatus={row.original.bom_status}
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
            onClick={() => handleEdit(row.original.id)}
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
        searchPlaceholder="Search BOM..."
        addButton={{
          onClick: handleCreate,
          label: "Add BOM",
        }}
        expandableRow={(row) => {
          const totalRate = row.subs
            ?.reduce((acc, item) => acc + Number(item.component_rate || 0), 0)
            .toFixed(2);
          const totalQty = row.subs?.reduce(
            (acc, item) => acc + Number(item.quantity || 0),
            0,
          );

          const totalAmount = row.subs
            ?.reduce(
              (acc, item) =>
                acc +
                Number(item.component_rate || 0) * Number(item.quantity || 0),
              0,
            )
            .toFixed(2);
          return (
            <div className="p-2">
              <Table className="border">
                <TableHeader className="border-b">
                  <TableRow>
                    <TableHead>Component Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Brand</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead>Rate</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Amount</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {row.subs?.length ? (
                    row.subs.map((sub) => (
                      <TableRow key={sub.id}>
                        <TableCell>{sub.component_name}</TableCell>
                        <TableCell>{sub.component_category}</TableCell>
                        <TableCell>{sub.component_brand}</TableCell>
                        <TableCell>{sub.component_unit}</TableCell>
                        <TableCell>{sub.component_rate}</TableCell>
                        <TableCell>{sub.quantity}</TableCell>
                        <TableCell>
                          {Number(sub.component_rate) * Number(sub.quantity)}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">
                        No components found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TableCell />
                    <TableCell />
                    <TableCell />
                    <TableCell className="font-semibold">Total</TableCell>
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
      {open && (
        <BomDialog open={open} onClose={() => setOpen(false)} bomId={editId} />
      )}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600">
              Delete Bom
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this bom? This action cannot be
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

export default BomList;
