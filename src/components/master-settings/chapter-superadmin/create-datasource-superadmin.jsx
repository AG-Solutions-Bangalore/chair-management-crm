import React from "react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Loader2, SquarePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import BASE_URL from "@/config/base-url";
import Cookies from "js-cookie";
import { CHAPTER_DATASOURCE_CREATE } from "@/api";

const CreateDatasourceSuperadmin = ({ chapterId }) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    data_source_type: "",
    chapter_id: chapterId || "",
  });

  const queryClient = useQueryClient();

  const handleSubmit = async () => {
    if (!formData.data_source_type.trim()) {
      toast.error("Data source type is required");
      return;
    }

    if (!formData.chapter_id) {
      toast.error("Chapter ID is required");
      return;
    }

    setIsLoading(true);
    try {
      const token = Cookies.get("token");
      
      const response = await axios.post(
        `${CHAPTER_DATASOURCE_CREATE}`, 
        formData,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response?.data.code === 201) {
        toast.success(response.data.message || "Data source created successfully");

     
        setFormData({
          data_source_type: "",
          chapter_id: chapterId || "",
        });
        
        
        await queryClient.invalidateQueries(["chapterDataSources"]);
        setOpen(false);
      } else {
        toast.error(response.data.message || "Failed to create data source");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to create data source"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenChange = (isOpen) => {
    setOpen(isOpen);
    // Reset form when dialog closes
    if (!isOpen) {
      setFormData({
        data_source_type: "",
        chapter_id: chapterId || "",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm" className="ml-2">
          <SquarePlus className="h-4 w-4 mr-2" /> DataSource 
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Create Data Source</span>
          
          </DialogTitle>
          <DialogDescription>
            Enter the details for the new data source
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <label htmlFor="data_source_type" className="text-sm font-medium">
                Data Source Type <span className="text-red-500">*</span>
              </label>
              <Input
                id="data_source_type"
                name="data_source_type"
                placeholder="Enter data source type"
                value={formData.data_source_type}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="mt-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Data Source"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDatasourceSuperadmin;