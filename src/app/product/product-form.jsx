import { GroupButton } from "@/components/group-button";
import LoadingBar from "@/components/loader/loading-bar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { PRODUCT_API, VENDOR_API } from "@/constants/apiConstants";
import { useApiMutation } from "@/hooks/use-mutation";
import { useGetApiMutation } from "@/hooks/useGetApiMutation";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const initialState = {
  product_code: "",
  product_name: "",
  product_category: "",
  product_rate: "",
  product_description: "",
  product_color: "",
  vendor_id: "",
  product_damage: "",
  product_status: "Active",
};
const ProductForm = ({ isOpen, onClose, productId }) => {
  const isEditMode = Boolean(productId);
  const [data, setData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const { trigger: fetchProduct, loading } = useApiMutation();
  const { trigger: submitProduct, loading: submitLoading } = useApiMutation();
  const queryClient = useQueryClient();
  const { data: vendorData } = useGetApiMutation({
    url: VENDOR_API.active,
    queryKey: ["vendor-active-product"],
  });
  const vendorOptions = vendorData?.data?.filter((v) =>
    v.vendor_type?.includes("1"),
  );
  useEffect(() => {
    if (!isOpen) return;

    if (!isEditMode) {
      setData(initialState);
      setErrors({});
      return;
    }

    const fetchData = async () => {
      try {
        const res = await fetchProduct({
          url: PRODUCT_API.byId(productId),
        });

        setData({
          product_code: res.data.product_code || "",
          product_name: res.data.product_name || "",
          product_category: res.data.product_category || "",
          product_rate: res.data.product_rate || "",
          product_color: res.data.product_color || "",
          vendor_id: String(res.data.vendor_id || ""),
          product_description: res.data.product_description || "",
          product_damage: res.data.product_damage || "",
          product_status: res.data.product_status || "Active",
        });
      } catch (err) {
        toast.error("Failed to load Product data");
      }
    };

    fetchData();
  }, [isOpen, productId]);

  const validate = () => {
    const newErrors = {};

    if (!data.product_name.trim())
      newErrors.product_name = "Product Name is Required";
    if (!data.product_category)
      newErrors.product_category = "Product Category is Required";
    if (!data.product_rate)
      newErrors.product_rate = " Product Rate is Required";
    if (!data.vendor_id) newErrors.vendor_id = "Vendor is Required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      return;
    }

    try {
      const res = await submitProduct({
        url: isEditMode ? `${PRODUCT_API.byId(productId)}` : PRODUCT_API.list,
        method: isEditMode ? "put" : "post",
        data: data,
      });

      if (res?.code == 201) {
        toast.success(res?.message || "Saved successfully");
        onClose();
        queryClient.invalidateQueries({ queryKey: ["product-list"] });
      } else {
        toast.error(res?.message || "Failed to update product");
      }
    } catch (err) {
      toast.error("Operation failed");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Product" : "Create Product"}
          </DialogTitle>
        </DialogHeader>

        {loading && <LoadingBar />}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-sm font-medium">Product Code</label>

            <Input
              placeholder="Product Code"
              value={data.product_code}
              onChange={(e) =>
                setData({ ...data, product_code: e.target.value })
              }
            />
          </div>
          <div>
            <label className="text-sm font-medium">Product Category *</label>
            <Input
              placeholder="Product Category"
              value={data.product_category}
              onChange={(e) =>
                setData({ ...data, product_category: e.target.value })
              }
            />
            {errors.product_category && (
              <p className="text-xs text-red-500">{errors.product_category}</p>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Product Name *</label>

          <Input
            placeholder="Product Name"
            value={data.product_name}
            onChange={(e) => setData({ ...data, product_name: e.target.value })}
          />
          {errors.product_name && (
            <p className="text-xs text-red-500">{errors.product_name}</p>
          )}
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="text-sm font-medium">Rate *</label>
            <Input
              placeholder="Rate"
              type="number"
              min={0}
              value={data.product_rate}
              onChange={(e) =>
                setData({ ...data, product_rate: e.target.value })
              }
            />
            {errors.product_rate && (
              <p className="text-xs text-red-500">{errors.product_rate}</p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium">Color</label>
            <Input
              placeholder="Enter Color"
              min={0}
              value={data.product_color}
              onChange={(e) =>
                setData({ ...data, product_color: e.target.value })
              }
            />
          </div>
          <div>
            <label className="text-sm font-medium">Damage</label>
            <Input
              placeholder="Damage"
              type="number"
              min={0}
              value={data.product_damage}
              onChange={(e) =>
                setData({ ...data, product_damage: e.target.value })
              }
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Vendor *</label>
          <Select
            value={data.vendor_id}
            onValueChange={(v) => setData({ ...data, vendor_id: v })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Vendor" />
            </SelectTrigger>
            <SelectContent>
              {vendorOptions?.map((v) => (
                <SelectItem key={v.id} value={String(v.id)}>
                  {v.vendor_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {errors.vendor_id && (
            <p className="text-xs text-red-500 mt-1">{errors.vendor_id}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium">Description</label>

          <Textarea
            placeholder="Description"
            value={data.product_description}
            onChange={(e) =>
              setData({ ...data, product_description: e.target.value })
            }
          />
        </div>

        {isEditMode && (
          <>
            <label className="text-sm font-medium">Status *</label>

            <GroupButton
              className="w-fit"
              value={data.product_status}
              onChange={(value) => setData({ ...data, product_status: value })}
              options={[
                { label: "Active", value: "Active" },
                { label: "Inactive", value: "Inactive" },
              ]}
            />
          </>
        )}

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={submitLoading}>
            {isEditMode ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductForm;
