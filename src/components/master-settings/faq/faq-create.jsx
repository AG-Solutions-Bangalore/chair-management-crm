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

import { toast } from "sonner";
import BASE_URL from "@/config/base-url";

const FaqCreate = () => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    header: "",
    text: "",
  });
  
  const queryClient = useQueryClient();
  const { pathname } = useLocation();

  const handleSubmit = async () => {
    if (!formData.header.trim() || !formData.text.trim()) {
      toast.error("Header and Message are required");
      return;
    }

    setIsLoading(true);
    try {
      const token = Cookies.get("token");
      const response = await axios.post(
        `${BASE_URL}/api/faq`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response?.data.code == 201) {
        toast.success(response.data.message || "FAQ created successfully");

        setFormData({
          header: "",
          text: "",
        });
        await queryClient.invalidateQueries(["faqList"]);
        setOpen(false);
      } else {
        toast.error(response.data.message || "Failed to create FAQ");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to create FAQ"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className={`ml-2`}>
          <SquarePlus className="h-4 w-4 mr-2" /> FAQ
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New FAQ</DialogTitle>
          <DialogDescription>
            Enter the details for the new FAQ
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
          </div>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className={`mt-2`}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create FAQ"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FaqCreate;