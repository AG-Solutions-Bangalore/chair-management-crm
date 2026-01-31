import ApiErrorPage from "@/components/api-error/api-error";
import DataTable from "@/components/common/data-table";
import LoadingBar from "@/components/loader/loading-bar";
import ToggleStatus from "@/components/toogle/status-toogle";
import { Button } from "@/components/ui/button";
import { COMPONENTS_API, VENDOR_API } from "@/constants/apiConstants";
import useDebounce from "@/hooks/useDebounce";
import { useGetApiMutation } from "@/hooks/useGetApiMutation";
import { Edit } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const VendorList = () => {
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
    [pageIndex, pageSize, debouncedSearch]
  );
  const { data, isLoading, isError, refetch } = useGetApiMutation({
    url: VENDOR_API.list,
    queryKey: ["vendor-list", pageIndex],
    params,
  });
  const apiData = data?.data;

  const columns = [
    { header: "Name", accessorKey: "vendor_name" },
    { header: "Contact Name", accessorKey: "vendor_contact_name" },
    { header: "Email", accessorKey: "vendor_email" },
    { header: "Mobile", accessorKey: "vendor_mobile" },
    { header: "Gst", accessorKey: "vendor_gst" },
    { header: "Type", accessorKey: "vendor_type" },
    {
      header: "Status",
      accessorKey: "vendor_status",
      cell: ({ row }) => {
        return (
          <ToggleStatus
            initialStatus={row.original.vendor_status}
            apiUrl={VENDOR_API.updateStatus(row.original.id)}
            payloadKey="vendor_status"
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
          onClick={() => navigate(`/vendor/edit/${row.original.id}`)}
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
        searchPlaceholder="Search Vendor..."
        serverPagination={{
          pageIndex,
          pageCount: apiData?.last_page ?? 1,
          total: apiData?.total ?? 0,
          onPageChange: setPageIndex,
          onPageSizeChange: setPageSize,
          onSearch: setSearch,
        }}
        addButton={{
          to: "/vendor/create",
          label: "Add Vendor",
        }}
      />
    </>
  );
};

export default VendorList;
