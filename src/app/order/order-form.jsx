"use client";

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
  BOM_API,
  COMPONENTS_API,
  ORDERS_API,
  PRODUCT_API,
  VENDOR_API,
} from "@/constants/apiConstants";

import { useApiMutation } from "@/hooks/use-mutation";
import { useGetApiMutation } from "@/hooks/useGetApiMutation";
import { useQueryClient } from "@tanstack/react-query";
import { Minus, Package, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

/* ---------------- INITIAL STATES ---------------- */
const initialComponentSub = {
  order_sub_component_id: "",
  order_sub_qnty: 1,
  order_sub_unit: "",
  order_sub_rate: 0,
  order_sub_amount: 0,
};
const initialProductSub = {
  order_p_sub_product_id: "",
  order_p_sub_qnty: 1,
  order_p_sub_amount: 0,
  subs1: [initialComponentSub],
};

const initialState = {
  order_date: "",
  order_delivery_date: "",
  order_buyer_id: "",
  order_note: "",
  products: [initialProductSub],
};
const OrderForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  const queryClient = useQueryClient();

  const [data, setData] = useState(initialState);
  const [errors, setErrors] = useState({});

  const { trigger: submitTrigger, loading: submitloading } = useApiMutation();
  const { trigger: apiTrigger, loading, error } = useApiMutation();

  const { data: buyerData } = useGetApiMutation({
    url: VENDOR_API.active,
    queryKey: ["buyers"],
  });

  const { data: productData } = useGetApiMutation({
    url: PRODUCT_API.active,
    queryKey: ["products"],
  });

  const { data: componentData } = useGetApiMutation({
    url: COMPONENTS_API.active,
    queryKey: ["components"],
  });

  const fetchOrder = async () => {
    try {
      const res = await apiTrigger({ url: ORDERS_API.byId(id) });
      const o = res?.data;

      setData({
        order_date: o.order_date ?? "",
        order_delivery_date: o.order_delivery_date ?? "",
        order_buyer_id: String(o.order_buyer_id ?? ""),
        order_note: o.order_note ?? "",
        products: o.products?.map((p) => ({
          ...p,
          subs1: p.subs1 || [],
        })) || [initialProductSub],
      });
    } catch {
      toast.error("Failed to load order");
    }
  };

  useEffect(() => {
    if (isEditMode) fetchOrder();
  }, [id]);

  const validate = () => {
    const err = {};

    if (!data.order_date) err.order_date = "Required";
    if (!data.order_delivery_date) err.order_delivery_date = "Required";
    if (!data.order_buyer_id) err.order_buyer_id = "Required";

    data.products.forEach((p, pi) => {
      if (!p.order_p_sub_product_id) err[`product_${pi}`] = "Product required";
      p.subs1.forEach((c, ci) => {
        if (
          !c.order_sub_component_id ||
          !c.order_sub_qnty ||
          !c.order_sub_unit ||
          !c.order_sub_rate
        )
          err[`component_${pi}_${ci}`] = "All component fields required";
      });
    });

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const addProduct = () => {
    setData((p) => ({
      ...p,
      products: [...p.products, initialProductSub],
    }));
  };

  const removeProduct = (index) => {
    setData((p) => {
      const updated = [...p.products];
      updated.splice(index, 1);
      return { ...p, products: updated };
    });
  };

  const handleProductSelect = async (index, productId) => {
    const product = productData?.data?.find((p) => String(p.id) === productId);
    if (!product) return;

    const updatedProducts = [...data.products];
    updatedProducts[index] = {
      ...updatedProducts[index],
      order_p_sub_product_id: productId,
      order_p_sub_qnty: 1,
      order_p_sub_amount: Number(product.product_rate || 0),
      subs1: [],
    };

    setData((p) => ({ ...p, products: updatedProducts }));

    try {
      const res = await apiTrigger({
        url: BOM_API.GetSubById(productId),
      });
      const bomSubs = res?.data || [];

      updatedProducts[index].subs1 = bomSubs.map((b) => ({
        order_sub_component_id: String(b.bom_sub_component_id),
        order_sub_qnty: b.bom_sub_qnty,
        order_sub_unit: b.component_unit,
        order_sub_rate: Number(b.component_rate),
        order_sub_amount: Number(b.bom_sub_qnty) * Number(b.component_rate),
      }));

      setData((p) => ({ ...p, products: updatedProducts }));
    } catch (error) {
      toast.error(error.message || "Failed to load BOM components");
    }
  };

  const addComponent = (productIndex) => {
    const updated = [...data.products];
    updated[productIndex].subs1.push(initialComponentSub);
    setData((p) => ({ ...p, products: updated }));
  };

  const updateComponent = (productIndex, index, field, value) => {
    const updated = [...data.products];
    const component = updated[productIndex].subs1[index];
    component[field] = value;

    component.order_sub_amount =
      Number(component.order_sub_qnty || 0) *
      Number(component.order_sub_rate || 0);

    setData((p) => ({ ...p, products: updated }));
  };

  const removeComponent = (productIndex, index) => {
    const updated = [...data.products];
    updated[productIndex].subs1.splice(index, 1);
    setData((p) => ({ ...p, products: updated }));
  };
  const handleProductQuantityChange = (productIndex, value) => {
    const updated = [...data.products];
    const newQty = Number(value || 0);

    updated[productIndex].order_p_sub_qnty = newQty;

    updated[productIndex].subs1 = updated[productIndex].subs1.map((c) => ({
      ...c,
      order_sub_qnty: newQty,
      order_sub_amount: newQty * Number(c.order_sub_rate || 0),
    }));

    setData({ ...data, products: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const payload = {
      order_date: data.order_date,
      order_delivery_date: data.order_delivery_date,
      order_buyer_id: data.order_buyer_id,
      order_note: data.order_note,
      subs: data.products.map((p) => ({
        order_p_sub_product_id: p.order_p_sub_product_id,
        order_p_sub_qnty: p.order_p_sub_qnty,
        order_p_sub_amount: p.order_p_sub_amount,
      })),
      subs1: data.products.flatMap((p) =>
        p?.subs1?.map((c) => ({
          order_sub_component_id: c.order_sub_component_id,
          order_sub_qnty: c.order_sub_qnty,
          order_sub_unit: c.order_sub_unit,
          order_sub_rate: c.order_sub_rate,
          order_sub_amount: c.order_sub_amount,
          order_sub_product_id: p.order_p_sub_product_id,
        })),
      ),
    };
    try {
      const res = await submitTrigger({
        url: isEditMode ? ORDERS_API.updateById(id) : ORDERS_API.list,
        method: isEditMode ? "put" : "post",
        data: payload,
      });

      if (res?.code === 201) {
        toast.success("Order saved successfully");
        queryClient.invalidateQueries({ queryKey: ["order-list"] });
        navigate(-1);
      } else {
        toast.error(res?.message || "Failed to save");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };
  const ErrorText = ({ message }) =>
    message ? <p className="text-xs text-red-500 mt-1">{message}</p> : null;
  if (error) return <ApiErrorPage onRetry={fetchOrder} />;

  return (
    <div className="mx-6 space-y-6">
      {loading && <LoadingBar />}

      <form onSubmit={handleSubmit}>
        <PageHeader
          icon={Package}
          title={isEditMode ? "Edit Order" : "Create Order"}
          rightContent={
            <>
              <Button variant="outline" onClick={() => navigate(-1)}>
                Back
              </Button>
              <Button type="submit" className="ml-3">
                {" "}
                {submitloading ? "Submiting..." : "Submit"}
              </Button>
            </>
          }
        />

        {/* BASIC DETAILS */}
        <Card className="p-4 grid md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium">Order Date *</label>

            <Input
              type="date"
              value={data.order_date}
              onChange={(e) => setData({ ...data, order_date: e.target.value })}
            />
            <ErrorText message={errors.order_date} />
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
            <ErrorText message={errors.order_delivery_date} />
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
            <ErrorText message={errors.order_buyer_id} />
          </div>
          <div className="md:col-span-3">
            <label className="text-sm font-medium">Notes *</label>
            <Textarea
              placeholder="Order note"
              value={data.order_note}
              onChange={(e) => setData({ ...data, order_note: e.target.value })}
            />
          </div>
        </Card>
        <Card className="p-4 mt-5">
          {data.products.map((p, pi) => {
            const selectedComponentIds = p.subs1.map(
              (c) => c.order_sub_component_id,
            );

            return (
              <Card key={pi} className="p-4 space-y-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h3>Product {pi + 1}</h3>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeProduct(pi)}
                    disabled={data.products.length === 1}
                  >
                    <Minus className="w-4 h-4 text-red-500" /> Remove Product
                  </Button>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Select
                      value={p.order_p_sub_product_id}
                      onValueChange={(v) => handleProductSelect(pi, v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Product" />
                      </SelectTrigger>
                      <SelectContent>
                        {productData?.data
                          ?.filter(
                            (prod) =>
                              !data.products.some(
                                (p2, pIndex) =>
                                  pIndex !== pi &&
                                  p2.order_p_sub_product_id === String(prod.id),
                              ),
                          )
                          .map((prod) => (
                            <SelectItem key={prod.id} value={String(prod.id)}>
                              {prod.product_name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <ErrorText message={errors[`product_${pi}`]} />
                  </div>

                  <Input
                    type="number"
                    min={1}
                    value={p.order_p_sub_qnty}
                    onChange={(e) =>
                      handleProductQuantityChange(pi, e.target.value)
                    }
                  />

                  <Input
                    type="number"
                    value={p.order_p_sub_amount}
                    onChange={(e) => {
                      const updated = [...data.products];
                      updated[pi].order_p_sub_amount = e.target.value;
                      setData({ ...data, products: updated });
                    }}
                  />
                </div>

                {/* COMPONENTS TABLE */}
                <div className="flex justify-between mb-2">
                  <h4>Components</h4>
                  <Button size="sm" onClick={() => addComponent(pi)}>
                    <Plus className="w-4 h-4 mr-1" /> Add Component
                  </Button>
                </div>

                <Table className="border">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[30%]">Component</TableHead>
                      <TableHead>Qty</TableHead>
                      <TableHead>Unit</TableHead>
                      <TableHead>Rate</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {p.subs1.map((c, ci) => (
                      <TableRow key={ci}>
                        <TableCell>
                          <Select
                            value={c.order_sub_component_id}
                            onValueChange={(v) =>
                              updateComponent(
                                pi,
                                ci,
                                "order_sub_component_id",
                                v,
                              )
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              {componentData?.data
                                ?.filter(
                                  (comp) =>
                                    !selectedComponentIds.includes(
                                      String(comp.id),
                                    ) ||
                                    String(comp.id) ===
                                      c.order_sub_component_id,
                                )
                                .map((comp) => (
                                  <SelectItem
                                    key={comp.id}
                                    value={String(comp.id)}
                                  >
                                    {comp.component_name}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                          <ErrorText
                            message={errors[`component_${pi}_${ci}`]}
                          />
                        </TableCell>

                        <TableCell>
                          <Input
                            type="number"
                            value={c.order_sub_qnty}
                            onChange={(e) =>
                              updateComponent(
                                pi,
                                ci,
                                "order_sub_qnty",
                                e.target.value,
                              )
                            }
                          />
                        </TableCell>

                        <TableCell>
                          <Input
                            value={c.order_sub_unit}
                            onChange={(e) =>
                              updateComponent(
                                pi,
                                ci,
                                "order_sub_unit",
                                e.target.value,
                              )
                            }
                          />
                        </TableCell>

                        <TableCell>
                          <Input
                            type="number"
                            value={c.order_sub_rate}
                            onChange={(e) =>
                              updateComponent(
                                pi,
                                ci,
                                "order_sub_rate",
                                e.target.value,
                              )
                            }
                          />
                        </TableCell>

                        <TableCell>
                          <Input value={c.order_sub_amount} disabled />
                        </TableCell>

                        <TableCell>
                          <Button
                            size="icon"
                            variant="ghost"
                            disabled={p.subs1.length <= 1}
                            onClick={() => removeComponent(pi, ci)}
                          >
                            <Minus className="w-4 h-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            );
          })}
          <div className="flex justify-end">
            <Button type="button" onClick={addProduct}>
              <Plus className="w-4 h-4 mr-1" /> Add Product
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
};

export default OrderForm;
