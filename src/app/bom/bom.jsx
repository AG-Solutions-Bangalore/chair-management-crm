import ApiErrorPage from "@/components/api-error/api-error";
import DataTable from "@/components/common/data-table";
import LoadingBar from "@/components/loader/loading-bar";
import { BOM_API } from "@/constants/apiConstants";
import { useGetApiMutation } from "@/hooks/useGetApiMutation";
import { Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import CompanyDialog from "./create-bom";
import ToggleStatus from "@/components/toogle/status-toogle";

const BomList = () => {
  const {
    data: data,
    isLoading,
    isError,
    refetch,
  } = useGetApiMutation({
    url: BOM_API.list,
    queryKey: ["bom-list"],
  });
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const columns = [
    {
      header: "Code",
      accessorKey: "product_code",
    },
    {
      header: "Name",
      accessorKey: "product_name",
      enableSorting: false,
    },
    {
      header: "Category",
      accessorKey: "product_category",
      enableSorting: false,
    },
    {
      header: "Rate",
      accessorKey: "product_rate",
      enableSorting: false,
    },
    {
      header: "Quantity",
      accessorKey: "total_sub_qnty",
      enableSorting: false,
    },
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
        <div>
          <Button
            size="icon"
            variant="outline"
            onClick={() => {
              setEditId(row.original.id);
              setOpen(true);
            }}
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      ),
      enableSorting: false,
    },
  ];
  if (isLoading) return <LoadingBar />;
  if (isError) return <ApiErrorPage onRetry={refetch} />;
  const handleCreate = () => {
    setEditId(null);
    setOpen(true);
  };
  return (
    <>
      <DataTable
        data={data?.data?.data || []}
        columns={columns}
        pageSize={10}
        searchPlaceholder="Search Chair..."
        addButton={{
          onClick: handleCreate,
          label: "Add Chair",
        }}
      />

      <CompanyDialog
        open={open}
        onClose={() => setOpen(false)}
        companyId={editId}
      />
    </>
  );
};

export default BomList;
