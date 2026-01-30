import ApiErrorPage from "@/components/api-error/api-error";
import DataTable from "@/components/common/data-table";
import LoadingBar from "@/components/loader/loading-bar";
import ToggleStatus from "@/components/toogle/status-toogle";
import { Button } from "@/components/ui/button";
import { PRODUCT_API } from "@/constants/apiConstants";
import useDebounce from "@/hooks/useDebounce";
import { useGetApiMutation } from "@/hooks/useGetApiMutation";
import { Edit } from "lucide-react";
import { useMemo, useState } from "react";
import ProductForm from "./product-form";
// import BankForm from "./bank-form";

const ProductList = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const debouncedSearch = useDebounce(search);
  const params = useMemo(
    () => ({
      page: pageIndex + 1,
      per_page: pageSize,
      ...(debouncedSearch?.trim() && { search: debouncedSearch.trim() }),
    }),
    [pageIndex, pageSize, debouncedSearch],
  );
  const { data, isLoading, isError, refetch } = useGetApiMutation({
    url: PRODUCT_API.list,
    queryKey: ["product-list", pageIndex],
    params,
  });
  const apiData = data?.data;
  const handleCreate = () => {
    setSelectedId(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (id) => {
    setSelectedId(id);
    setIsDialogOpen(true);
  };

  const columns = [
    { header: "Code", accessorKey: "product_code" },
    { header: "Name", accessorKey: "product_name" },
    { header: "Category", accessorKey: "product_category" },
    { header: "Description", accessorKey: "product_description" },
    { header: "Rate", accessorKey: "product_rate" },
    {
      header: "Status",
      accessorKey: "product_status",
      cell: ({ row }) => {
        return (
          <ToggleStatus
            initialStatus={row.original.product_status}
            apiUrl={PRODUCT_API.updateStatus(row.original.id)}
            payloadKey="product_status"
            onSuccess={refetch}
          />
        );
      },
    },
    {
      header: "Action",
      cell: ({ row }) => (
        <Button
          size="icon"
          variant="outline"
          onClick={() => handleEdit(row.original.id)}
        >
          <Edit className="h-4 w-4" />
        </Button>
      ),
    },
  ];
  if (isError) return <ApiErrorPage onRetry={refetch} />;

  return (
    <>
      {isLoading && <LoadingBar />}
      <DataTable
        data={apiData?.data || []}
        columns={columns}
        pageSize={pageSize}
        searchPlaceholder="Search Product..."
        serverPagination={{
          pageIndex,
          pageCount: apiData?.last_page ?? 1,
          total: apiData?.total ?? 0,
          onPageChange: setPageIndex,
          onPageSizeChange: setPageSize,
          onSearch: setSearch,
        }}
        addButton={{
          onClick: handleCreate,
          label: "Add Product",
        }}
      />
      <ProductForm
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        productId={selectedId}
      />
    </>
  );
};

export default ProductList;
