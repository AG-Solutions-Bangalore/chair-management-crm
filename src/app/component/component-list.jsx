import ApiErrorPage from "@/components/api-error/api-error";
import DataTable from "@/components/common/data-table";
import LoadingBar from "@/components/loader/loading-bar";
import ToggleStatus from "@/components/toogle/status-toogle";
import { Button } from "@/components/ui/button";
import { COMPONENTS_API, PRODUCT_API } from "@/constants/apiConstants";
import useDebounce from "@/hooks/useDebounce";
import { useGetApiMutation } from "@/hooks/useGetApiMutation";
import { Edit } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const ComponentList = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
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
    url: COMPONENTS_API.list,
    queryKey: ["component-list", pageIndex],
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
    {
      header: "S.No",
      cell: ({ row }) => row.index + 1,
    },
    { header: "Code", accessorKey: "component_code" },
    { header: "Component", accessorKey: "component_name" },
    { header: "Category", accessorKey: "component_category" },
    { header: "Brand", accessorKey: "component_brand" },
    { header: "Unit", accessorKey: "component_unit" },
    { header: "Rate", accessorKey: "component_rate" },
    { header: "Mini Stock", accessorKey: "component_mini_stock" },
    { header: "Specification", accessorKey: "component_specification" },
    {
      header: "Status",
      accessorKey: "component_status",
      cell: ({ row }) => {
        return (
          <ToggleStatus
            initialStatus={row.original.component_status}
            apiUrl={COMPONENTS_API.updateStatus(row.original.id)}
            payloadKey="component_status"
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
          title="Edit Component"
          onClick={() => navigate(`/component/edit/${row.original.id}`)}
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
        searchPlaceholder="Search Component..."
        serverPagination={{
          pageIndex,
          pageCount: apiData?.last_page ?? 1,
          total: apiData?.total ?? 0,
          onPageChange: setPageIndex,
          onPageSizeChange: setPageSize,
          onSearch: setSearch,
        }}
        addButton={{
          to: "/component/create",
          label: "Add Component",
        }}
      />
    </>
  );
};

export default ComponentList;
