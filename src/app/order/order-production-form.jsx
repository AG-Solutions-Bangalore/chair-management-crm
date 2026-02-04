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
import {
  COMPONENTS_API,
  ORDERS_API,
  PRODUCT_API,
  PRODUCTION_API,
} from "@/constants/apiConstants";
import { useApiMutation } from "@/hooks/use-mutation";
import { useGetApiMutation } from "@/hooks/useGetApiMutation";
import { useQueryClient } from "@tanstack/react-query";
import { Minus, Package, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
const createInitialProductionComponent = () => ({
  id: "",
  production_c_component_id: "",
  production_c_qnty: 1,
  production_c_unit: "",
  production_c_rate: 0,
  production_c_amount: 0,
});

const createInitialProductionProduct = () => ({
  id: "",
  production_p_product_id: "",
  production_p_qnty: 1,
  production_p_amount: 0,
  subs1: [createInitialProductionComponent()],
});

const initialState = {
  production_p_date: "",
  order_ref: "",
  production: [createInitialProductionProduct()],
};
const OrderProductionForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  const queryClient = useQueryClient();
  const [data, setData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const { trigger: submitTrigger, loading: submitloading } = useApiMutation();
  const { trigger: apiTrigger, loading, error } = useApiMutation();
  const [allowedProductIds, setAllowedProductIds] = useState([]);
  const [orderSubsMap, setOrderSubsMap] = useState({});
  const { data: productData } = useGetApiMutation({
    url: PRODUCT_API.active,
    queryKey: ["products"],
  });
  const { data: componentData } = useGetApiMutation({
    url: COMPONENTS_API.active,
    queryKey: ["components"],
  });
  const getAvailableProducts = (currentIndex) => {
    const selectedIds = data.production
      .map((p, i) =>
        i !== currentIndex ? String(p.production_p_product_id) : null,
      )
      .filter(Boolean);
    console.log(selectedIds, "selectedIds");
    return (
      productData?.data?.filter((prod) => {
        const prodId = String(prod.id);
        if (isEditMode && !allowedProductIds.includes(prodId)) {
          return false;
        }
        return !selectedIds.includes(prodId);
      }) || []
    );
  };
  console.log(data, "data");
  const fetchOrder = async () => {
    try {
      const res = await apiTrigger({ url: ORDERS_API.byId(id) });
      const o = res?.data;
      const productIdsFromOrder =
        o?.subs?.map((p) => String(p.order_p_sub_product_id)) || [];
      setAllowedProductIds(productIdsFromOrder);
      const subsByProduct = (o?.subs1 || []).reduce((acc, c) => {
        const pid = String(c.order_sub_product_id);
        if (!acc[pid]) acc[pid] = [];

        acc[pid].push({
          id: c.id,
          production_c_component_id: String(c?.order_sub_component_id),
          production_c_qnty: Number(c.order_sub_qnty),
          production_c_unit: c.order_sub_unit,
          production_c_rate: Number(c.order_sub_rate),
          production_c_amount: Number(c.order_sub_amount),
        });

        return acc;
      }, {});
      setOrderSubsMap(subsByProduct);
      setData({
        production_p_date: o?.order_date,
        order_ref: o?.order_ref,
        production: initialState?.production,
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

    if (!data.production_p_date) err.production_p_date = "Required";
    if (!data.order_ref) err.order_ref = "Required";

    data.production.forEach((p, pi) => {
      if (!p.production_p_product_id)
        err[`production_${pi}`] = "Production required";
      p.subs1.forEach((c, ci) => {
        if (
          !c.production_c_component_id ||
          !c.production_c_qnty ||
          !c.production_c_unit ||
          !c.production_c_rate
        )
          err[`production_${pi}_${ci}`] = "All component fields required";
      });
    });

    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleProductSelect = async (index, productId) => {
    const product = productData?.data?.find((p) => String(p.id) === productId);
    if (!product) return;

    const updatedProducts = [...data.production];

    updatedProducts[index] = {
      ...updatedProducts[index],
      production_p_product_id: productId,
      production_p_qnty: updatedProducts[index].production_p_qnty || 1,
      production_p_amount: Number(product.product_rate || 0),
      subs1: [],
    };

    if (isEditMode) {
      const existingSubs = orderSubsMap[productId] || [];
      updatedProducts[index].subs1 = existingSubs;
      setData((p) => ({ ...p, production: updatedProducts }));
      return;
    }

    setData((p) => ({ ...p, production: updatedProducts }));
  };

  const handleProductQuantityChange = (productIndex, value) => {
    const updated = [...data.production];
    const newQty = Number(value || 0);

    updated[productIndex].production_p_qnty = newQty;

    updated[productIndex].subs1 = updated[productIndex].subs1.map((c) => ({
      ...c,
      production_c_qnty: newQty,
      production_c_amount: newQty * Number(c.production_c_rate || 0),
    }));

    setData({ ...data, production: updated });
  };
  const availableProductsCount = getAvailableProducts().length;

  const addProduct = () => {
    setData((p) => ({
      ...p,
      production: [...p.production, createInitialProductionProduct()],
    }));
  };
  const removeProduct = (index) => {
    setData((p) => {
      const updated = [...p.production];
      updated.splice(index, 1);
      return { ...p, production: updated };
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const payload = {
      order_date: data.order_date,
      production: data.production.map((p) => ({
        order_ref: data.order_ref,
        production_p_date: data.production_p_date,
        production_p_product_id: p.production_p_product_id,
        production_p_qnty: p.production_p_qnty,
        production_p_amount: p.production_p_amount,
      })),
      subs: data.production.flatMap((p) =>
        p?.subs1?.map((c) => ({
          production_c_component_id: c.production_c_component_id,
          production_c_qnty: c.production_c_qnty,
          production_c_unit: c.production_c_unit,
          production_c_rate: c.production_c_rate,
          production_c_amount: c.production_c_amount,
          production_c_product_id: p.production_p_product_id,
          production_c_date: data.production_p_date,
          order_ref: data.order_ref,
        })),
      ),
    };
    try {
      const res = await submitTrigger({
        url: PRODUCTION_API.list,
        method: "post",
        data: payload,
      });

      if (res?.code === 201) {
        toast.success(res.message || "Production saved successfully");
        queryClient.invalidateQueries({ queryKey: ["production-list"] });
        navigate("/production");
      } else {
        toast.error(res?.message || "Failed to save");
      }
    } catch (error) {
      toast.error(error?.message || "Something went wrong");
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
          title="Create Production"
          rightContent={
            <>
              <Button
                variant="outline"
                type="button"
                onClick={() => navigate(-1)}
              >
                Back
              </Button>
              <Button type="submit" className="ml-3">
                {submitloading ? "Submiting..." : "Submit"}
              </Button>
            </>
          }
        />

        <Card className="p-4 grid md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium">Order Date *</label>

            <Input
              type="date"
              value={data.production_p_date}
              onChange={(e) =>
                setData({ ...data, production_p_date: e.target.value })
              }
            />
            <ErrorText message={errors.production_p_date} />
          </div>
          <div>
            <label className="text-sm font-medium">Ref</label>

            <Input
              value={data.order_ref}
              onChange={(e) => setData({ ...data, order_ref: e.target.value })}
              disabled
            />
          </div>
        </Card>
        <Card className="p-4 mt-5">
          {data.production.map((p, pi) => {
            const selectedComponentIds = p.subs1.map(
              (c) => c.production_c_component_id,
            );
            console.log(selectedComponentIds, "selectedComponentIds");
            return (
              <Card key={pi} className="p-4 space-y-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h3>Product {pi + 1}</h3>
                  <TableCell>
                    <Button
                      size="sm"
                      variant="ghost"
                      type="button"
                      onClick={() => removeProduct(pi)}
                      disabled={data.production.length === 1}
                    >
                      <Minus className="w-4 h-4 text-red-500" /> Remove Product
                    </Button>
                  </TableCell>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Select
                      value={p.production_p_product_id}
                      onValueChange={(v) => handleProductSelect(pi, v)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Product" />
                      </SelectTrigger>
                      <SelectContent>
                        {getAvailableProducts(pi).map((prod) => (
                          <SelectItem key={prod.id} value={String(prod.id)}>
                            {prod.product_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <ErrorText message={errors[`production_${pi}`]} />
                  </div>

                  <Input
                    type="number"
                    min={1}
                    value={p.production_p_qnty}
                    onChange={(e) =>
                      handleProductQuantityChange(pi, e.target.value)
                    }
                  />

                  <Input
                    type="number"
                    value={p.production_p_amount}
                    readOnly
                    onChange={(e) => {
                      const updated = [...data.production];
                      updated[pi].production_p_amount = e.target.value;
                      setData({ ...data, production: updated });
                    }}
                  />
                </div>
                <div className="flex justify-between mb-2">
                  <h4>Components</h4>
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
                      <TableRow
                        key={`${pi}-${ci}-${c.production_c_component_id || "new"}`}
                      >
                        <TableCell>
                          <Select value={c.production_c_component_id}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {componentData?.data?.map((comp) => (
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
                            message={errors[`production_${pi}_${ci}`]}
                          />
                        </TableCell>

                        <TableCell>
                          <Input
                            type="number"
                            value={c.production_c_qnty}
                            readOnly
                          />
                        </TableCell>

                        <TableCell>
                          <Input value={c.production_c_unit} readOnly />
                        </TableCell>

                        <TableCell>
                          <Input
                            type="number"
                            value={c.production_c_rate}
                            readOnly
                          />
                        </TableCell>

                        <TableCell>
                          <Input value={c.production_c_amount} readOnly />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            );
          })}
          <div className="flex justify-end">
            <Button
              type="button"
              onClick={addProduct}
              disabled={availableProductsCount === 0}
            >
              <Plus className="w-4 h-4 mr-1" /> Add Product
            </Button>
          </div>
          {availableProductsCount === 0 && (
            <p className="text-xs text-gray-500 mt-1 text-right">
              All products are already added
            </p>
          )}
        </Card>
      </form>
    </div>
  );
};

export default OrderProductionForm;
