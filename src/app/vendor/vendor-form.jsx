import ApiErrorPage from "@/components/api-error/api-error";
import MemoizedSelect from "@/components/common/memoized-select";
import PageHeader from "@/components/common/page-header";
import { GroupButton } from "@/components/group-button";
import LoadingBar from "@/components/loader/loading-bar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { VENDOR_API } from "@/constants/apiConstants";
import { VENDOR_TYPE_OPTIONS } from "@/constants/vendorConstants";
import { useApiMutation } from "@/hooks/use-mutation";
import { useQueryClient } from "@tanstack/react-query";
import { Truck } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const initialState = {
  vendor_name: "",
  vendor_contact_name: "",
  vendor_email: "",
  vendor_mobile: "",
  vendor_address: "",
  vendor_gst: "",
  vendor_type: [],
  vendor_status: "Active",
};

const VendorForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  const queryClient = useQueryClient();

  const [data, setData] = useState(initialState);
  const [errors, setErrors] = useState({});

  const {
    trigger: fetchVendor,
    loading: fetchLoading,
    error: fetchError,
  } = useApiMutation();

  const { trigger: submitVendor, loading: submitLoading } = useApiMutation();

  const fetchData = async () => {
    try {
      const res = await fetchVendor({
        url: VENDOR_API.byId(id),
      });

      setData({
        vendor_name: res?.data?.vendor_name ?? "",
        vendor_contact_name: res?.data?.vendor_contact_name ?? "",
        vendor_email: res?.data?.vendor_email ?? "",
        vendor_mobile: res?.data?.vendor_mobile ?? "",
        vendor_address: res?.data?.vendor_address ?? "",
        vendor_gst: res?.data?.vendor_gst ?? "",
        vendor_type: res?.data?.vendor_type
          ? res?.data?.vendor_type
              .split(",")
              .map((v) => VENDOR_TYPE_OPTIONS.find((o) => o.value === v))
              .filter(Boolean)
          : [],
        vendor_status: res?.data?.vendor_status ?? "Active",
      });
    } catch {
      toast.error("Failed to load vendor details");
    }
  };

  useEffect(() => {
    if (isEditMode) fetchData();
  }, [id]);

  const validate = () => {
    const err = {};

    if (!data.vendor_name) err.vendor_name = "Vendor name is required";
    if (!data.vendor_type || data.vendor_type.length === 0) {
      err.vendor_type = "Vendor type is required";
    }

    if (data.vendor_mobile && !/^\d+$/.test(data.vendor_mobile)) {
      err.vendor_mobile = "Only numbers allowed";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const payload = {
      ...data,
      vendor_type: data.vendor_type
        .map((v) => (typeof v === "object" ? v.value : v))
        .join(","),
    };

    try {
      const res = await submitVendor({
        url: isEditMode ? VENDOR_API.updateById(id) : VENDOR_API.list,
        method: isEditMode ? "put" : "post",
        data: payload,
      });

      if (res?.code === 201) {
        toast.success(res?.message || "Vendor saved successfully");
        queryClient.invalidateQueries({ queryKey: ["vendor-list"] });
        navigate(-1);
      } else {
        toast.error(res?.message || "Failed to save vendor");
      }
    } catch (err) {
      toast.error(err?.message || "Something went wrong");
    }
  };

  if (fetchError) return <ApiErrorPage onRetry={fetchData} />;

  return (
    <div className="mx-6 space-y-6">
      {fetchLoading && <LoadingBar />}

      <form onSubmit={handleSubmit}>
        <PageHeader
          icon={Truck}
          title={isEditMode ? "Edit Vendor" : "Create Vendor"}
          description="Enter vendor details below"
          rightContent={
            <div className="flex gap-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => navigate(-1)}
              >
                Back
              </Button>
              <Button type="submit" disabled={submitLoading}>
                {isEditMode ? "Update" : "Create"}
              </Button>
            </div>
          }
        />

        <Card className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* Vendor Name */}
            <div>
              <label className="text-sm font-medium">Vendor Name *</label>
              <Input
                value={data.vendor_name}
                onChange={(e) =>
                  setData({ ...data, vendor_name: e.target.value })
                }
              />
              {errors.vendor_name && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.vendor_name}
                </p>
              )}
            </div>

            {/* Vendor Type */}
            <div>
              <label className="text-sm font-medium">Vendor Type *</label>

              <MemoizedSelect
                isMulti
                value={data.vendor_type}
                options={VENDOR_TYPE_OPTIONS}
                placeholder="Select vendor type"
                onChange={(selected) =>
                  setData((prev) => ({
                    ...prev,
                    vendor_type: selected || [],
                  }))
                }
              />

              {errors.vendor_type && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.vendor_type}
                </p>
              )}
            </div>

            {/* Contact Name */}
            <div>
              <label className="text-sm font-medium">Contact Name</label>
              <Input
                value={data.vendor_contact_name}
                onChange={(e) =>
                  setData({ ...data, vendor_contact_name: e.target.value })
                }
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={data.vendor_email}
                onChange={(e) =>
                  setData({ ...data, vendor_email: e.target.value })
                }
              />
            </div>

            {/* Mobile */}
            <div>
              <label className="text-sm font-medium">Mobile</label>
              <Input
                value={data.vendor_mobile}
                onChange={(e) =>
                  setData({
                    ...data,
                    vendor_mobile: e.target.value.replace(/\D/g, ""),
                  })
                }
                maxLength={10}
              />
              {errors.vendor_mobile && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.vendor_mobile}
                </p>
              )}
            </div>

            {/* GST */}
            <div>
              <label className="text-sm font-medium">GST</label>
              <Input
                value={data.vendor_gst}
                onChange={(e) =>
                  setData({ ...data, vendor_gst: e.target.value })
                }
              />
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="text-sm font-medium">Address</label>
              <Textarea
                value={data.vendor_address}
                onChange={(e) =>
                  setData({ ...data, vendor_address: e.target.value })
                }
              />
            </div>

            {/* Status (Edit only) */}
            {isEditMode && (
              <div>
                <label className="text-sm font-medium">Status *</label>
                <GroupButton
                  className="w-fit"
                  value={data.vendor_status}
                  onChange={(value) =>
                    setData((prev) => ({
                      ...prev,
                      vendor_status: value,
                    }))
                  }
                  options={[
                    { label: "Active", value: "Active" },
                    { label: "Inactive", value: "Inactive" },
                  ]}
                />
              </div>
            )}
          </div>
        </Card>
      </form>
    </div>
  );
};

export default VendorForm;
