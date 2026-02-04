import ApiErrorPage from "@/components/api-error/api-error";
import { GroupButton } from "@/components/group-button";
import LoadingBar from "@/components/loader/loading-bar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { PRODUCTION_API } from "@/constants/apiConstants";
import { useApiMutation } from "@/hooks/use-mutation";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";

/* -------------------- Initial State -------------------- */
const initialState = {
  production_p_date: "",
  production_p_qnty: "",
  production_p_amount: "",
  production_p_status: "Pending",
};

const ProductionEditDialog = ({ open, onClose, productionId }) => {
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

  /* -------------------- Fetch on Open -------------------- */
  const fetchData = async () => {
    try {
      const res = await fetchProduction({
        url: PRODUCTION_API.byId(productionId),
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
    if (open && productionId) {
      fetchData();
    }
  }, [open, productionId]);

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
        url: PRODUCTION_API.updateById(productionId),
        method: "put",
        data,
      });

      if (res?.code === 200 || res?.code === 201) {
        toast.success(res?.message || "Production updated successfully");
        queryClient.invalidateQueries({ queryKey: ["production-list"] });
        onClose();
      } else {
        toast.error(res?.message || "Failed to save production");
      }
    } catch (err) {
      toast.error(err?.message || "Something went wrong");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Edit Production</DialogTitle>
        </DialogHeader>

        {fetchLoading && <LoadingBar />}
        {fetchError && <ApiErrorPage onRetry={fetchData} />}

        {!fetchError && (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1  gap-6">
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

              <div>
                <label className="text-sm font-medium">Amount *</label>
                <Input
                  value={data.production_p_amount}
                  onChange={(e) =>
                    setData({
                      ...data,
                      production_p_amount: e.target.value.replace(
                        /[^0-9.]/g,
                        "",
                      ),
                    })
                  }
                />
                {errors.production_p_amount && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.production_p_amount}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium">Status *</label>
                <div>
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
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={submitLoading}>
                Update
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ProductionEditDialog;
