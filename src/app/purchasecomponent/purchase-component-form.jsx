import ApiErrorPage from "@/components/api-error/api-error";
import PageHeader from "@/components/common/page-header";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  COMPONENTS_API,
  PURCHASE_COMPONENT_API,
  VENDOR_API,
} from "@/constants/apiConstants";
import { useApiMutation } from "@/hooks/use-mutation";
import { useGetApiMutation } from "@/hooks/useGetApiMutation";
import { useQueryClient } from "@tanstack/react-query";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
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
const initialSub = {
  id: "",
  purchase_c_sub_component_id: "",
  purchase_c_sub_qnty: "",
};

const initialState = {
  purchase_c_date: "",
  purchase_c_vendor_id: "",
  purchase_c_bill_ref: "",
  purchase_c_note: "",
  subs: [initialSub],
};

const PurchaseComponentForm = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [data, setData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [deleteSubId, setDeleteSubId] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const {
    trigger: fetchPurchase,
    loading: fetchLoading,
    error: fetchError,
  } = useApiMutation();

  const { trigger: submitPurchase, loading: submitLoading } = useApiMutation();

  const { trigger: deleteSub } = useApiMutation();

  const { data: vendorData } = useGetApiMutation({
    url: VENDOR_API.active,
    queryKey: ["vendor-active"],
  });

  const { data: componentData } = useGetApiMutation({
    url: COMPONENTS_API.active,
    queryKey: ["component-active"],
  });

  const fetchData = async () => {
    try {
      const res = await fetchPurchase({
        url: PURCHASE_COMPONENT_API.byId(id),
      });

      const api = res?.data || {};

      setData({
        purchase_c_date: api.purchase_c_date ?? "",
        purchase_c_vendor_id: String(api.purchase_c_vendor_id ?? ""),
        purchase_c_bill_ref: api.purchase_c_bill_ref ?? "",
        purchase_c_note: api.purchase_c_note ?? "",
        subs:
          api.subs?.length > 0
            ? api.subs.map((s) => ({
                id: s.id,
                purchase_c_sub_component_id: String(
                  s.purchase_c_sub_component_id,
                ),
                purchase_c_sub_qnty: String(s.purchase_c_sub_qnty),
              }))
            : [initialSub],
      });
    } catch {
      toast.error("Failed to load purchase details");
    }
  };

  useEffect(() => {
    if (isEditMode) fetchData();
  }, [id]);

  /* ---------------- VALIDATION ---------------- */

  const validate = () => {
    const err = {};

    if (!data.purchase_c_date) err.purchase_c_date = "Required";
    if (!data.purchase_c_vendor_id) err.purchase_c_vendor_id = "Required";

    const subErrors = data.subs.map((s) => {
      const e = {};
      if (!s.purchase_c_sub_component_id)
        e.purchase_c_sub_component_id = "Required";
      if (!s.purchase_c_sub_qnty) e.purchase_c_sub_qnty = "Required";
      return e;
    });

    if (subErrors.some((e) => Object.keys(e).length > 0)) {
      err.subs = subErrors;
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  /* ---------------- SUB HANDLERS ---------------- */

  const handleAddSub = () => {
    setData((p) => ({
      ...p,
      subs: [...p.subs, { ...initialSub }],
    }));
  };

  const handleRemoveSub = (index) => {
    const updated = [...data.subs];
    updated.splice(index, 1);
    setData((p) => ({ ...p, subs: updated }));
  };

  const handleRemoveSubClick = (index) => {
    const sub = data.subs[index];

    if (sub.id) {
      setDeleteSubId(sub.id);
      setDeleteIndex(index);
    } else {
      handleRemoveSub(index);
    }
  };

  const handleConfirmDeleteSub = async () => {
    if (!deleteSubId) return;

    try {
      const res = await deleteSub({
        url: PURCHASE_COMPONENT_API.deleteSubById(deleteSubId),
        method: "delete",
      });

      if (res?.code === 201) {
        toast.success(res?.message || "Sub-component deleted");
        handleRemoveSub(deleteIndex);
      } else {
        toast.error(res?.message || "Failed to delete sub-component");
      }
    } catch (err) {
      toast.error(res?.message || "Something went wrong");
    } finally {
      setDeleteSubId(null);
      setDeleteIndex(null);
    }
  };

  const handleSubChange = (index, field, value) => {
    const updated = [...data.subs];
    updated[index] = { ...updated[index], [field]: value };
    setData((p) => ({ ...p, subs: updated }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await submitPurchase({
        url: isEditMode
          ? PURCHASE_COMPONENT_API.updateById(id)
          : PURCHASE_COMPONENT_API.list,
        method: isEditMode ? "put" : "post",
        data,
      });

      if (res?.code === 201) {
        toast.success(res?.message || "Purchase saved successfully");
        queryClient.invalidateQueries({
          queryKey: ["purchase-component-list"],
        });
        navigate(-1);
      } else {
        toast.error(res?.message || "Failed to save purchase");
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
          icon={ShoppingCart}
          title={
            isEditMode ? "Edit Purchase Component" : "Create Purchase Component"
          }
          description="Enter purchase component details"
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-sm font-medium">Purchase Date *</label>
              <Input
                type="date"
                value={data.purchase_c_date}
                onChange={(e) =>
                  setData({ ...data, purchase_c_date: e.target.value })
                }
              />
              {errors.purchase_c_date && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.purchase_c_date}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">Vendor *</label>
              <Select
                value={data.purchase_c_vendor_id}
                onValueChange={(v) =>
                  setData({ ...data, purchase_c_vendor_id: v })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Vendor" />
                </SelectTrigger>
                <SelectContent>
                  {vendorData?.data?.map((v) => (
                    <SelectItem key={v.id} value={String(v.id)}>
                      {v.vendor_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.purchase_c_vendor_id && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.purchase_c_vendor_id}
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium">Bill Reference</label>
              <Input
                value={data.purchase_c_bill_ref}
                onChange={(e) =>
                  setData({
                    ...data,
                    purchase_c_bill_ref: e.target.value,
                  })
                }
              />
            </div>

            <div className="md:col-span-3">
              <label className="text-sm font-medium">Note</label>
              <Textarea
                value={data.purchase_c_note}
                onChange={(e) =>
                  setData({
                    ...data,
                    purchase_c_note: e.target.value,
                  })
                }
              />
            </div>
          </div>
        </Card>

        <Card className="p-4 mt-6">
          <div className="flex justify-between mb-3">
            <h3 className="font-medium">Sub Components *</h3>
            <Button
              size="sm"
              variant="outline"
              type="button"
              onClick={handleAddSub}
            >
              <Plus className="w-4 h-4 mr-1" /> Add
            </Button>
          </div>

          <Table className="border">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50%]">Component *</TableHead>
                <TableHead>Quantity *</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {data.subs.map((sub, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Select
                      value={sub.purchase_c_sub_component_id}
                      onValueChange={(v) =>
                        handleSubChange(index, "purchase_c_sub_component_id", v)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Component" />
                      </SelectTrigger>
                      <SelectContent>
                        {componentData?.data?.map((c) => (
                          <SelectItem key={c.id} value={String(c.id)}>
                            {c.component_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    {errors?.subs?.[index]?.purchase_c_sub_component_id && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.subs[index].purchase_c_sub_component_id}
                      </p>
                    )}
                  </TableCell>

                  <TableCell>
                    <Input
                      type="number"
                      min={1}
                      value={sub.purchase_c_sub_qnty}
                      onChange={(e) =>
                        handleSubChange(
                          index,
                          "purchase_c_sub_qnty",
                          e.target.value,
                        )
                      }
                    />

                    {errors?.subs?.[index]?.purchase_c_sub_qnty && (
                      <p className="text-xs text-red-500 mt-1">
                        {errors.subs[index].purchase_c_sub_qnty}
                      </p>
                    )}
                  </TableCell>

                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      type="button"
                      disabled={data.subs.length <= 1}
                      onClick={() => handleRemoveSubClick(index)}
                    >
                      {sub.id ? (
                        <Trash2 className="w-4 h-4 text-red-500" />
                      ) : (
                        <Minus className="w-4 h-4 text-red-500" />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <AlertDialog open={deleteSubId} onOpenChange={setDeleteSubId}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="text-red-600">
                  Delete Purchase Component
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this Purchase Component sub?
                  This action cannot be undone."
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleConfirmDeleteSub}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </Card>
      </form>
    </div>
  );
};

export default PurchaseComponentForm;
