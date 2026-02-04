import ApiErrorPage from "@/components/api-error/api-error";
import PageHeader from "@/components/common/page-header";
import { GroupButton } from "@/components/group-button";
import LoadingBar from "@/components/loader/loading-bar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COMPONENTS_API } from "@/constants/apiConstants";
import { COMPONENT_UNITS } from "@/constants/component-unit";
import { useApiMutation } from "@/hooks/use-mutation";
import { useQueryClient } from "@tanstack/react-query";
import { Boxes } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const initialState = {
  component_code: "",
  component_name: "",
  component_category: "",
  component_unit: "",
  component_mini_stock: "",
  component_rate: "",
  component_specification: null,
  component_brand: null,
  component_status: "Active",
};
const ComponentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  const queryClient = useQueryClient();

  const [data, setData] = useState(initialState);
  const [errors, setErrors] = useState({});

  const {
    trigger: fetchComponent,
    loading: fetchLoading,
    error: fetchError,
  } = useApiMutation();

  const { trigger: submitComponent, loading: submitLoading } = useApiMutation();

  const fetchData = async () => {
    try {
      const res = await fetchComponent({
        url: COMPONENTS_API.byId(id),
      });
      const apiData = res?.data || {};

      setData({
        component_code: apiData.component_code ?? "",
        component_name: apiData.component_name ?? "",
        component_category: apiData.component_category ?? "",
        component_unit: apiData.component_unit ?? "",
        component_mini_stock: apiData.component_mini_stock ?? "",
        component_rate: apiData.component_rate ?? "",
        component_specification: apiData.component_specification ?? "",
        component_brand: apiData.component_brand ?? "",
        component_status: apiData.component_status ?? "Active",
      });
    } catch {
      toast.error("Failed to load component details");
    }
  };

  useEffect(() => {
    if (isEditMode) fetchData();
  }, [id]);

  const validate = () => {
    const err = {};

    if (!data.component_name) err.component_name = "Component name is required";
    if (!data.component_category)
      err.component_category = "Category is required";
    if (!data.component_unit) err.component_unit = "Unit is required";
    if (!data.component_mini_stock)
      err.component_mini_stock = "Minimum stock is required";
    if (!data.component_rate) err.component_rate = "Rate is required";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await submitComponent({
        url: isEditMode ? COMPONENTS_API.updateById(id) : COMPONENTS_API.list,
        method: isEditMode ? "put" : "post",
        data,
      });

      if (res?.code === 201) {
        toast.success(res?.message || "Component saved successfully");
        queryClient.invalidateQueries({ queryKey: ["component-list"] });
        navigate(-1);
      } else {
        toast.error(res?.message || "Failed to save component");
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
          icon={Boxes}
          title={isEditMode ? "Edit Component" : "Create Component"}
          description="Enter component details below"
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
            <div>
              <label className="text-sm font-medium">Component Code</label>
              <Input
                value={data.component_code || ""}
                onChange={(e) =>
                  setData({ ...data, component_code: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium">Component Name *</label>
              <Input
                value={data.component_name || ""}
                onChange={(e) =>
                  setData({ ...data, component_name: e.target.value })
                }
              />
              {errors.component_name && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.component_name}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">Category *</label>
              <Input
                value={data.component_category || ""}
                onChange={(e) =>
                  setData({ ...data, component_category: e.target.value })
                }
              />
              {errors.component_category && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.component_category}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">Unit *</label>
              <Select
                value={data.component_unit || ""}
                onValueChange={(v) => setData({ ...data, component_unit: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {COMPONENT_UNITS.map((u) => (
                    <SelectItem key={u.id} value={u.value}>
                      {u.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.component_unit && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.component_unit}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">Minimum Stock *</label>
              <Input
                type="number"
                min={0}
                value={data.component_mini_stock || ""}
                onChange={(e) =>
                  setData({
                    ...data,
                    component_mini_stock: e.target.value,
                  })
                }
              />
              {errors.component_mini_stock && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.component_mini_stock}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">Rate *</label>
              <Input
                type="number"
                min={0}
                value={data.component_rate || ""}
                onChange={(e) =>
                  setData({ ...data, component_rate: e.target.value })
                }
              />
              {errors.component_rate && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.component_rate}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">Brand</label>
              <Input
                value={data.component_brand || ""}
                onChange={(e) =>
                  setData({ ...data, component_brand: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium">Specification</label>
              <Input
                value={data.component_specification || ""}
                onChange={(e) =>
                  setData({
                    ...data,
                    component_specification: e.target.value,
                  })
                }
              />
            </div>
            <div>
              {isEditMode && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status *</label>

                  <div>
                    <GroupButton
                      className="w-fit"
                      value={data.component_status || "Active"}
                      onChange={(value) =>
                        setData((prev) => ({
                          ...prev,
                          component_status: value,
                        }))
                      }
                      options={[
                        { label: "Active", value: "Active" },
                        { label: "Inactive", value: "Inactive" },
                      ]}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
};

export default ComponentForm;
