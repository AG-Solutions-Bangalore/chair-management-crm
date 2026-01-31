import ApiErrorPage from "@/components/api-error/api-error";
import MemoizedSelect from "@/components/common/memoized-select";
import PageHeader from "@/components/common/page-header";
import LoadingBar from "@/components/loader/loading-bar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useApiMutation } from "@/hooks/use-mutation";
import { useGetApiMutation } from "@/hooks/useGetApiMutation";
import { useQueryClient } from "@tanstack/react-query";
import { Package, Plus, Minus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  COMPONENTS_API,
  ORDERS_API,
  PRODUCT_API,
  VENDOR_API,
} from "@/constants/apiConstants";

const initialSub = {
  id: "",
  order_sub_component_id: "",
  order_sub_qnty: "",
  order_sub_unit: "",
  order_sub_rate: "",
  order_sub_amount: "",
};

const initialState = {
  order_date: "",
  order_delivery_date: "",
  order_buyer_id: "",
  order_product_id: "",
  order_qnty: "",
  order_note: "",
  subs: [initialSub],
};

const OrderForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  const queryClient = useQueryClient();

  const [data, setData] = useState(initialState);
  const [errors, setErrors] = useState({});

  const {
    trigger: fetchOrder,
    loading: fetchLoading,
    error: fetchError,
  } = useApiMutation();
  const { trigger: submitOrder, loading: submitLoading } = useApiMutation();

  const { data: buyerData } = useGetApiMutation({
    url: VENDOR_API.active,
    queryKey: ["buyer-active"],
  });

  const { data: productData } = useGetApiMutation({
    url: PRODUCT_API.active,
    queryKey: ["product-active"],
  });

  const { data: componentData } = useGetApiMutation({
    url: COMPONENTS_API.active,
    queryKey: ["component-active"],
  });

  const fetchData = async () => {
    try {
      const res = await fetchOrder({ url: ORDERS_API.byId(id) });
      const apiData = res?.data;

      setData({
        order_date: apiData.order_date ?? "",
        order_delivery_date: apiData.order_delivery_date ?? "",
        order_buyer_id: String(apiData.order_buyer_id ?? ""),
        order_product_id: String(apiData.order_product_id ?? ""),
        order_qnty: apiData.order_qnty ?? "",
        order_note: apiData.order_note ?? "",
        subs:
          apiData.subs?.length > 0
            ? apiData.subs.map((s) => ({
                id: s.id,
                order_sub_component_id: String(s.order_sub_component_id),
                order_sub_qnty: String(s.order_sub_qnty),
                order_sub_unit: s.order_sub_unit,
                order_sub_rate: s.order_sub_rate,
                order_sub_amount: s.order_sub_amount,
              }))
            : [initialSub],
      });
    } catch {
      toast.error("Failed to load order details");
    }
  };

  useEffect(() => {
    if (isEditMode) fetchData();
  }, [id]);

  const validate = () => {
    const err = {};

    if (!data.order_date) err.order_date = "Required";
    if (!data.order_delivery_date) err.order_delivery_date = "Required";
    if (!data.order_buyer_id) err.order_buyer_id = "Required";
    if (!data.order_product_id) err.order_product_id = "Required";
    if (!data.order_qnty) err.order_qnty = "Required";

    const subErrors = data.subs.map((s) => {
      const e = {};
      if (!s.order_sub_component_id) e.order_sub_component_id = "Required";
      if (!s.order_sub_qnty) e.order_sub_qnty = "Required";
      if (!s.order_sub_unit) e.order_sub_unit = "Required";
      if (!s.order_sub_rate) e.order_sub_rate = "Required";
      return e;
    });

    if (subErrors.some((e) => Object.keys(e).length > 0)) {
      err.subs = subErrors;
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleAddSub = () => {
    setData((p) => ({ ...p, subs: [...p.subs, { ...initialSub }] }));
  };

  const handleRemoveSub = (index) => {
    const updated = [...data.subs];
    updated.splice(index, 1);
    setData((p) => ({ ...p, subs: updated }));
  };

  const handleSubChange = (index, field, value) => {
    const updated = [...data.subs];
    updated[index] = { ...updated[index], [field]: value };

    if (field === "order_sub_qnty" || field === "order_sub_rate") {
      const q = Number(updated[index].order_sub_qnty || 0);
      const r = Number(updated[index].order_sub_rate || 0);
      updated[index].order_sub_amount = q * r;
    }

    setData((p) => ({ ...p, subs: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await submitOrder({
        url: isEditMode ? ORDERS_API.updateById(id) : ORDERS_API.list,
        method: isEditMode ? "put" : "post",
        data,
      });

      if (res?.code === 201) {
        toast.success(res?.message || "Order saved successfully");
        queryClient.invalidateQueries({ queryKey: ["order-list"] });
        navigate(-1);
      } else {
        toast.error(res?.message || "Failed to save order");
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
          icon={Package}
          title={isEditMode ? "Edit Order" : "Create Order"}
          description="Enter order details below"
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

        {/* ---------------- BASIC DETAILS ---------------- */}
        <Card className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-sm font-medium">Order Date *</label>
              <Input
                type="date"
                value={data.order_date}
                onChange={(e) =>
                  setData({ ...data, order_date: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium">Delivery Date *</label>
              <Input
                type="date"
                value={data.order_delivery_date}
                onChange={(e) =>
                  setData({ ...data, order_delivery_date: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium">Buyer *</label>
              <Select
                value={data.order_buyer_id}
                onValueChange={(v) => setData({ ...data, order_buyer_id: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Buyer" />
                </SelectTrigger>
                <SelectContent>
                  {buyerData?.data?.map((b) => (
                    <SelectItem key={b.id} value={String(b.id)}>
                      {b.vendor_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Product *</label>
              <Select
                value={data.order_product_id}
                onValueChange={(v) => setData({ ...data, order_product_id: v })}
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
            </div>

            <div>
              <label className="text-sm font-medium">Quantity *</label>
              <Input
                type="number"
                min={1}
                value={data.order_qnty}
                onChange={(e) =>
                  setData({ ...data, order_qnty: e.target.value })
                }
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-sm font-medium">Order Note</label>
              <Textarea
                value={data.order_note}
                onChange={(e) =>
                  setData({ ...data, order_note: e.target.value })
                }
              />
            </div>
          </div>
        </Card>

        {/* ---------------- SUB COMPONENTS ---------------- */}
        <Card className="p-4 mt-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium">Sub Components *</h3>
            <Button size="sm" variant="outline" onClick={handleAddSub}>
              <Plus className="w-4 h-4 mr-1" /> Add More
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Component *</TableHead>
                <TableHead>Qty *</TableHead>
                <TableHead>Unit *</TableHead>
                <TableHead>Rate *</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {data.subs.map((sub, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Select
                      value={sub.order_sub_component_id}
                      onValueChange={(v) =>
                        handleSubChange(index, "order_sub_component_id", v)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {componentData?.data?.map((c) => (
                          <SelectItem key={c.id} value={String(c.id)}>
                            {c.component_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>

                  <TableCell>
                    <Input
                      type="number"
                      min={1}
                      value={sub.order_sub_qnty}
                      onChange={(e) =>
                        handleSubChange(index, "order_sub_qnty", e.target.value)
                      }
                    />
                  </TableCell>

                  <TableCell>
                    <Input
                      value={sub.order_sub_unit}
                      onChange={(e) =>
                        handleSubChange(index, "order_sub_unit", e.target.value)
                      }
                    />
                  </TableCell>

                  <TableCell>
                    <Input
                      type="number"
                      value={sub.order_sub_rate}
                      onChange={(e) =>
                        handleSubChange(index, "order_sub_rate", e.target.value)
                      }
                    />
                  </TableCell>

                  <TableCell>
                    <Input value={sub.order_sub_amount} disabled />
                  </TableCell>

                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={data.subs.length <= 1}
                      onClick={() => handleRemoveSub(index)}
                    >
                      <Minus className="w-4 h-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </form>
    </div>
  );
};

export default OrderForm;
