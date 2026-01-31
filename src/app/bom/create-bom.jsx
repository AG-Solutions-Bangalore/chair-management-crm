import { GroupButton } from "@/components/group-button";
import LoadingBar from "@/components/loader/loading-bar";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { BOM_API, COMPONENTS_API, PRODUCT_API } from "@/constants/apiConstants";
import { useApiMutation } from "@/hooks/useApiMutation";
import { useGetApiMutation } from "@/hooks/useGetApiMutation";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Minus, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
const initialSub = {
  id: "",
  bom_sub_component_id: "",
  bom_sub_qnty: "",
  bom_status: "Active",
};

const initialState = {
  bom_product_id: "",
  subs: [initialSub],
};

const BomDialog = ({ open, onClose, bomId }) => {
  const isEditMode = Boolean(bomId);
  const queryClient = useQueryClient();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});

  const { data: productData, isLoading: loadingProduct } = useGetApiMutation({
    url: PRODUCT_API.active,
    queryKey: ["product-active"],
  });

  const { data: componentData, isLoading: loadingComponent } =
    useGetApiMutation({
      url: COMPONENTS_API.active,
      queryKey: ["component-active"],
    });

  const { trigger: submitBom, loading: saving } = useApiMutation();
  const { trigger: fetchBom, loading: fetching } = useApiMutation();
  const { trigger: deleteSub, loading: deleting } = useApiMutation();

  const fetchBomDetails = async () => {
    try {
      const res = await fetchBom({
        url: BOM_API.byId(bomId),
      });

      const apiData = res?.data;

      setFormData({
        bom_product_id: String(apiData.bom_product_id),
        bom_status: String(apiData.bom_status),
        subs:
          apiData.subs?.length > 0
            ? apiData.subs.map((s) => ({
                id: s.id,
                bom_sub_component_id: String(s.bom_sub_component_id),
                bom_sub_qnty: String(s.bom_sub_qnty),
              }))
            : [initialSub],
      });
    } catch {
      toast.error("Failed to load BOM details");
    }
  };

  useEffect(() => {
    if (isEditMode && open) {
      fetchBomDetails();
    } else if (!isEditMode && open) {
      setFormData(initialState);
      setErrors({});
    }
  }, [bomId, open]);

  const validate = () => {
    const err = {};

    if (!formData.bom_product_id) err.bom_product_id = "Required";

    const subErrors = formData.subs.map((s) => {
      const e = {};
      if (!s.bom_sub_component_id) e.bom_sub_component_id = "Required";
      if (!s.bom_sub_qnty) e.bom_sub_qnty = "Required";
      return e;
    });

    if (subErrors.some((e) => Object.keys(e).length > 0)) {
      err.subs = subErrors;
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleAddSub = () => {
    setFormData((p) => ({
      ...p,
      subs: [...p.subs, { ...initialSub }],
    }));
  };
  const handleRemoveSub = (index) => {
    const updated = [...formData.subs];
    updated.splice(index, 1);
    setFormData((p) => ({ ...p, subs: updated }));
  };

  const handleRemoveSubClick = (index) => {
    const sub = formData.subs[index];
    if (sub.id) {
      setDeleteIndex(index);
      setDeleteId(sub.id);
      setDeleteDialogOpen(true);
    } else {
      handleRemoveSub(index);
    }
  };

  const handleConfirmDeleteSub = async () => {
    if (!deleteId) return;

    try {
      const res = await deleteSub({
        url: BOM_API.deleteSubById(deleteId),
        method: "delete",
        data: {},
      });
      if (res?.code === 201) {
        toast.success(res?.message || "Sub-component deleted");
        handleRemoveSub(deleteIndex);
      } else {
        toast.error(res?.message || "Failed to delete sub-component");
      }
    } catch (err) {
      toast.error(err?.message || "Something went wrong");
    } finally {
      setDeleteDialogOpen(false);
      setDeleteId(null);
      setDeleteIndex(null);
    }
  };
  const handleSubChange = (index, field, value) => {
    const updated = [...formData.subs];
    updated[index] = { ...updated[index], [field]: value };
    setFormData((p) => ({ ...p, subs: updated }));
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      const res = await submitBom({
        url: isEditMode ? BOM_API.updateById(bomId) : BOM_API.list,
        method: isEditMode ? "put" : "post",
        data: formData,
      });
      if (res?.code === 201) {
        toast.success(res?.message || "BOM saved successfully");
        queryClient.invalidateQueries({ queryKey: ["bom-list"] });
        onClose();
      } else {
        toast.error(res?.message || "Failed to save component");
      }
    } catch (err) {
      toast.error(err?.message || "Something went wrong");
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        {(loadingProduct || loadingComponent || fetching) && <LoadingBar />}

        <DialogContent
          className="max-w-3xl p-0 overflow-hidden"
          aria-describedby={undefined}
        >
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle>{isEditMode ? "Edit BOM" : "Create BOM"}</DialogTitle>
          </DialogHeader>

          <ScrollArea className="max-h-[55vh] px-6 py-4">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-2">
                <div className="mx-1">
                  <Label>BOM Product *</Label>
                  <Select
                    value={formData.bom_product_id}
                    onValueChange={(v) =>
                      setFormData({ ...formData, bom_product_id: v })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Product" />
                    </SelectTrigger>
                    <SelectContent>
                      {productData?.data?.map((p) => (
                        <SelectItem key={p.id} value={String(p.id)}>
                          {p.product_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.bom_product_id && (
                    <p className="text-sm text-red-500">
                      {errors.bom_product_id}
                    </p>
                  )}
                </div>
                <div>
                  {isEditMode && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Status *</label>

                      <div>
                        <GroupButton
                          className="w-fit"
                          value={formData.bom_status || "Active"}
                          onChange={(value) =>
                            setFormData((prev) => ({
                              ...prev,
                              bom_status: value,
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
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label>Sub Components *</Label>
                  <Button variant="outline" size="sm" onClick={handleAddSub}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add More
                  </Button>
                </div>

                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead>Component *</TableHead>
                        <TableHead>Quantity *</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {formData.subs.map((sub, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Select
                              value={sub.bom_sub_component_id}
                              onValueChange={(v) =>
                                handleSubChange(
                                  index,
                                  "bom_sub_component_id",
                                  v
                                )
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
                            {errors?.subs?.[index]?.bom_sub_component_id && (
                              <p className="text-xs text-red-500 mt-1">
                                Required
                              </p>
                            )}
                          </TableCell>

                          <TableCell>
                            <Input
                              type="number"
                              min={1}
                              value={sub.bom_sub_qnty}
                              onChange={(e) =>
                                handleSubChange(
                                  index,
                                  "bom_sub_qnty",
                                  e.target.value
                                )
                              }
                            />
                            {errors?.subs?.[index]?.bom_sub_qnty && (
                              <p className="text-xs text-red-500 mt-1">
                                Required
                              </p>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleRemoveSubClick(index)}
                              disabled={formData.subs.length <= 1}
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
                </div>
              </div>
            </div>
          </ScrollArea>

          <div className="px-6 py-4 border-t flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save BOM
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600">
              Delete Sub Component
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this sub-component? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDeleteSub}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deleting ? "Deleting" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default BomDialog;
