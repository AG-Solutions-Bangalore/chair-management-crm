import React from "react";
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";

import Cookies from "js-cookie";
import { Loader2, Edit } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import BASE_URL from "@/config/base-url";

const FaqEdit = ({ faqData }) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    header: "",
    text: "",
    status: "",
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    if (faqData && open) {
      setFormData({
        header: faqData.header || "",
        text: faqData.text || "",
        status: faqData.status || "",
      });
    }
  }, [faqData, open]);

  const handleSubmit = async () => {
    if (!formData.header.trim() || !formData.text.trim()) {
      toast.error("Header and Message are required");
      return;
    }

    if (!faqData?.id) {
      toast.error("No FAQ data selected for editing");
      return;
    }

    setIsLoading(true);
    try {
      const token = Cookies.get("token");
      const response = await axios.put(
        `${BASE_URL}/api/faq/${faqData.id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response?.data.code == 201) {
        toast.success(response.data.message || "FAQ updated successfully");

        
        
        await queryClient.invalidateQueries(["faqList"]);
        
       
        setOpen(false);
      } else {
        toast.error(response.data.message || "Failed to update FAQ");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update FAQ"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleStatusChange = (value) => {
    setFormData((prev) => ({ ...prev, status: value }));
  };

  const handleOpenChange = (isOpen) => {
    setOpen(isOpen);
   
    if (!isOpen) {
      setFormData({
        header: "",
        text: "",
        status: "",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
       <Button
                    variant="ghost"
                    size="icon"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit FAQ</DialogTitle>
          <DialogDescription>
            Update the details for the FAQ 
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Input
              id="header"
              placeholder="Enter header"
              value={formData.header}
              onChange={handleInputChange}
            />
            <Textarea
              id="text"
              placeholder="Enter message"
              value={formData.text}
              onChange={handleInputChange}
              rows={5}
            />
              <Select
                        value={formData.status}
                        onValueChange={handleStatusChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
          </div>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="mt-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update FAQ"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FaqEdit;