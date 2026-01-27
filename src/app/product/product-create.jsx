import React from "react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";

import Cookies from "js-cookie";
import { Loader2, SquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useLocation } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

import { toast } from "sonner";
import BASE_URL from "@/config/base-url";

const ProductCreate = () => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    product_name: "",
    product_code: "",
    category: "",
    price: "",
    description: "",
    status: "1", // Default to active (1)
  });
  
  const queryClient = useQueryClient();
  const { pathname } = useLocation();

  const handleSubmit = async () => {
    // Validation
    if (!formData.product_name.trim()) {
      toast.error("Product name is required");
      return;
    }
    if (!formData.product_code.trim()) {
      toast.error("Product code is required");
      return;
    }
    if (!formData.category.trim()) {
      toast.error("Category is required");
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error("Valid price is required");
      return;
    }

    setIsLoading(true);
    try {
      const token = Cookies.get("token");
      const response = await axios.post(
        `${BASE_URL}/api/products`,
        {
          ...formData,
          price: parseFloat(formData.price), // Convert to number
          status: parseInt(formData.status), // Convert to integer
        },
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          },
        }
      );

      if (response?.data.code == 201) {
        toast.success(response.data.message || "Product created successfully");

        // Reset form
        setFormData({
          product_name: "",
          product_code: "",
          category: "",
          price: "",
          description: "",
          status: "1",
        });
        
     
        await queryClient.invalidateQueries(["productsList"]);
        setOpen(false);
      } else {
        toast.error(response.data.message || "Failed to create product");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to create product"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="ml-2">
          <SquarePlus className="h-4 w-4 mr-2" /> Add Product
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Product</DialogTitle>
          <DialogDescription>
            Enter the details for the new product
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="product_name" className="text-sm">
                Product Name *
              </Label>
              <Input
                id="product_name"
                placeholder="Enter product name"
                value={formData.product_name}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="product_code" className="text-sm">
                Product Code *
              </Label>
              <Input
                id="product_code"
                placeholder="Enter product code"
                value={formData.product_code}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="category" className="text-sm">
                Category *
              </Label>
              <Input
                id="category"
                placeholder="Enter category"
                value={formData.category}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="price" className="text-sm">
                Price *
              </Label>
              <Input
                id="price"
                type="number"
                placeholder="Enter price"
                value={formData.price}
                onChange={handleInputChange}
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description" className="text-sm">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Enter product description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="status" className="text-sm">
              Status *
            </Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleSelectChange("status", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Active</SelectItem>
                <SelectItem value="0">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="mt-4"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Product"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductCreate;