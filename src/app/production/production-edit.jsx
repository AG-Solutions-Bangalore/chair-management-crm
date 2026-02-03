import ApiErrorPage from "@/components/api-error/api-error";
import PageHeader from "@/components/common/page-header";
import { GroupButton } from "@/components/group-button";
import LoadingBar from "@/components/loader/loading-bar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PRODUCTION_API } from "@/constants/apiConstants";
import { useApiMutation } from "@/hooks/use-mutation";
import { useQueryClient } from "@tanstack/react-query";
import { Factory } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

/* -------------------- Initial State -------------------- */
const initialState = {
  production_p_date: "",
  production_p_qnty: "",
  production_p_amount: "",
  production_p_status: "Pending",
};

const ProductionEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [data, setData] = useState(initialState);
  const [errors, setErrors] = useState({});

  const {
    trigger: fetchProduction,
    loading: fetchLoading,
    error: fetchError,
  } = useApiMutation();

  const { trigger: submitProduction, loading: submitLoading } =
    useApiMutation();

  /* -------------------- Fetch (Edit Mode) -------------------- */
  const fetchData = async () => {
    try {
      const res = await fetchProduction({
        url: PRODUCTION_API.byId(id),
      });

      setData({
        production_p_date: res?.data?.production_p_date ?? "",
        production_p_qnty: res?.data?.production_p_qnty ?? "",
        production_p_amount: res?.data?.production_p_amount ?? "",
        production_p_status: res?.data?.production_p_status ?? "Pending",
      });
    } catch {
      toast.error("Failed to load production details");
    }
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  /* -------------------- Validation -------------------- */
  const validate = () => {
    const err = {};

    if (!data.production_p_date)
      err.production_p_date = "Production date is required";

    if (!data.production_p_qnty) err.production_p_qnty = "Quantity is required";

    if (!data.production_p_amount)
      err.production_p_amount = "Amount is required";

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  /* -------------------- Submit -------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await submitProduction({
        url: PRODUCTION_API.updateById(id),
        method: "put",
        data,
      });

      if (res?.code === 201) {
        toast.success(res?.message || "Production saved successfully");
        queryClient.invalidateQueries({ queryKey: ["production-list"] });
        navigate(-1);
      } else {
        toast.error(res?.message || "Failed to save production");
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
          icon={Factory}
          title="Edit Production"
          description="Enter production details below"
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
                Update
              </Button>
            </div>
          }
        />

        <Card className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Production Date */}
            <div>
              <label className="text-sm font-medium">Production Date *</label>
              <Input
                type="date"
                value={data.production_p_date}
                onChange={(e) =>
                  setData({
                    ...data,
                    production_p_date: e.target.value,
                  })
                }
              />
              {errors.production_p_date && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.production_p_date}
                </p>
              )}
            </div>

            {/* Quantity */}
            <div>
              <label className="text-sm font-medium">Quantity *</label>
              <Input
                value={data.production_p_qnty}
                onChange={(e) =>
                  setData({
                    ...data,
                    production_p_qnty: e.target.value.replace(/\D/g, ""),
                  })
                }
              />
              {errors.production_p_qnty && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.production_p_qnty}
                </p>
              )}
            </div>

            {/* Amount */}
            <div>
              <label className="text-sm font-medium">Amount *</label>
              <Input
                value={data.production_p_amount}
                onChange={(e) =>
                  setData({
                    ...data,
                    production_p_amount: e.target.value.replace(/[^0-9.]/g, ""),
                  })
                }
              />
              {errors.production_p_amount && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.production_p_amount}
                </p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="text-sm font-medium">Status *</label>
              <GroupButton
                className="w-fit"
                value={data.production_p_status}
                onChange={(value) =>
                  setData((prev) => ({
                    ...prev,
                    production_p_status: value,
                  }))
                }
                options={[
                  { label: "Pending", value: "Pending" },
                  { label: "Finish", value: "Finish" },
                  { label: "Cancel", value: "Cancel" },
                ]}
              />
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
};

export default ProductionEdit;
