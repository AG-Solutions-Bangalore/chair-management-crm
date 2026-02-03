"use client";

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
  BOM_API,
  COMPONENTS_API,
  PRODUCT_API,
  PRODUCTION_API,
} from "@/constants/apiConstants";
import { useApiMutation } from "@/hooks/use-mutation";
import { useGetApiMutation } from "@/hooks/useGetApiMutation";
import { useQueryClient } from "@tanstack/react-query";
import { Minus, Package, Plus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
const ProductionForm = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [data, setData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const { trigger: submitTrigger, loading: submitloading } = useApiMutation();
  const { trigger: apiTriggerSubs, loading: loadingsubs } = useApiMutation();

  const { data: productData } = useGetApiMutation({
    url: PRODUCT_API.active,
    queryKey: ["products"],
  });
  const { data: componentData } = useGetApiMutation({
    url: COMPONENTS_API.active,
    queryKey: ["components"],
  });
  const getAvailableProducts = (currentIndex = null) => {
    return (
      productData?.data?.filter((prod) => {
        if (
          currentIndex !== null &&
          data.production[currentIndex]?.production_p_product_id ===
            String(prod.id)
        ) {
          return true;
        }

        return !data.production.some(
          (p) => p.production_p_product_id === String(prod.id),
        );
      }) || []
    );
  };
  const availableProductsCount = getAvailableProducts().length;

  const validate = () => {
    const err = {};

    if (!data.production_p_date) err.production_p_date = "Required";

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
  const handleProductSelect = async (index, productId) => {
    const product = productData?.data?.find((p) => String(p.id) === productId);
    if (!product) return;

    const updatedProducts = [...data.production];
    updatedProducts[index] = {
      ...updatedProducts[index],
      production_p_product_id: productId,
      order_p_sub_qnty: 1,
      production_p_amount: Number(product.product_rate || 0),
      subs1: [],
    };

    setData((p) => ({ ...p, production: updatedProducts }));

    try {
      const res = await apiTriggerSubs({
        url: BOM_API.GetSubById(productId),
      });
      const bomSubs = res?.data || [];

      updatedProducts[index].subs1 = bomSubs.map((b) => ({
        production_c_component_id: String(b.bom_sub_component_id),
        production_c_qnty: b.bom_sub_qnty,
        production_c_unit: b.component_unit,
        production_c_rate: Number(b.component_rate),
        production_c_amount: Number(b.bom_sub_qnty) * Number(b.component_rate),
      }));

      setData((p) => ({ ...p, production: updatedProducts }));
    } catch (error) {
      toast.error(error.message || "Failed to load BOM components");
    }
  };

  const addComponent = (pi) => {
    setData((prev) => {
      const production = [...prev.production];
      production[pi] = {
        ...production[pi],
        subs1: [...production[pi].subs1, createInitialProductionComponent()],
      };
      return { ...prev, production };
    });
  };

  const updateComponent = (pi, ci, field, value) => {
    setData((prev) => {
      const production = [...prev.production];
      const subs = [...production[pi].subs1];

      const updatedComponent = {
        ...subs[ci],
        [field]: value,
      };

      updatedComponent.production_c_amount =
        Number(updatedComponent.production_c_qnty || 0) *
        Number(updatedComponent.production_c_rate || 0);

      subs[ci] = updatedComponent;

      production[pi] = {
        ...production[pi],
        subs1: subs,
        production_p_amount: subs.reduce(
          (a, c) => a + Number(c.production_c_amount || 0),
          0,
        ),
      };

      return { ...prev, production };
    });
  };

  const removeComponent = (pi, ci) => {
    setData((prev) => {
      const production = [...prev.production];
      const subs = production[pi].subs1.filter((_, i) => i !== ci);

      production[pi] = {
        ...production[pi],
        subs1: subs,
        production_p_amount: subs.reduce(
          (a, c) => a + c.production_c_amount,
          0,
        ),
      };

      return { ...prev, production };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const payload = {
      order_date: data.order_date,
      production: data.production.map((p) => ({
        order_ref: "",
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
          order_ref: "",
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
        toast.success(res.message || "Order saved successfully");
        queryClient.invalidateQueries({ queryKey: ["order-list"] });
        navigate(-1);
      } else {
        toast.error(res?.message || "Failed to save");
      }
    } catch (error) {
      toast.error(error?.message || "Something went wrong");
    }
  };
  const ErrorText = ({ message }) =>
    message ? <p className="text-xs text-red-500 mt-1">{message}</p> : null;

  return (
    <div className="mx-6 space-y-6">
      {loadingsubs && <LoadingBar />}

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
                {" "}
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
        </Card>
        <Card className="p-4 mt-5">
          {data.production.map((p, pi) => {
            const selectedComponentIds = p.subs1.map(
              (c) => c.production_c_component_id,
            );

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
                      value={p.order_p_sub_product_id}
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
                    <ErrorText message={errors[`product_${pi}`]} />
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
                    onChange={(e) => {
                      const updated = [...data.production];
                      updated[pi].production_p_amount = e.target.value;
                      setData({ ...data, production: updated });
                    }}
                  />
                </div>
                <div className="flex justify-between mb-2">
                  <h4>Components</h4>
                  <Button
                    size="sm"
                    onClick={() => addComponent(pi)}
                    type="button"
                  >
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
                            value={c.production_c_component_id}
                            onValueChange={(v) =>
                              updateComponent(
                                pi,
                                ci,
                                "production_c_component_id",
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
                                      c.production_c_component_id,
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
                            value={c.production_c_qnty}
                            onChange={(e) =>
                              updateComponent(
                                pi,
                                ci,
                                "production_c_qnty",
                                e.target.value,
                              )
                            }
                          />
                        </TableCell>

                        <TableCell>
                          <Input
                            value={c.production_c_unit}
                            onChange={(e) =>
                              updateComponent(
                                pi,
                                ci,
                                "production_c_unit",
                                e.target.value,
                              )
                            }
                          />
                        </TableCell>

                        <TableCell>
                          <Input
                            type="number"
                            value={c.production_c_rate}
                            onChange={(e) =>
                              updateComponent(
                                pi,
                                ci,
                                "production_c_rate",
                                e.target.value,
                              )
                            }
                          />
                        </TableCell>

                        <TableCell>
                          <Input value={c.production_c_amount} disabled />
                        </TableCell>

                        <TableCell>
                          <Button
                            size="icon"
                            variant="ghost"
                            type="button"
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
              All production are already added
            </p>
          )}
        </Card>
      </form>
    </div>
  );
};

export default ProductionForm;
