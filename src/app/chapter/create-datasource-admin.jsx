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
import Cookies from "js-cookie";
import { ADMIN_DATASOURCE_CREATE } from "@/api";

const CreateDatasourceAdmin = ({ refetch }) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    data_source_type: "",
    chapter_id: "",
  });

  const queryClient = useQueryClient();

  const handleSubmit = async () => {
    if (!formData.data_source_type.trim()) {
      toast.error("Data source type is required");
      return;
    }

    setIsLoading(true);
    try {
      const token = Cookies.get("token");
      const chapterId = Cookies.get("chapter_id");
      
      const requestData = {
        data_source_type: formData.data_source_type,
        chapter_id: chapterId,
      };

      const response = await axios.post(
        ADMIN_DATASOURCE_CREATE, 
        requestData,
        {
          headers: { 
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response?.data.code === 201) {
        toast.success(response.data.message || "Data source created successfully");

        // Reset form
        setFormData({
          data_source_type: "",
          chapter_id: "",
        });
        
        // Invalidate queries and refetch
        await queryClient.invalidateQueries(["chapter-datasource-admin"]);
        refetch();
        setOpen(false);
      } else {
        toast.error(response.data.message || "Failed to create data source");
      }
    } catch (error) {
      console.error("Error creating data source:", error.response?.data?.message);
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
        chapter_id: "",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm" className="h-8 text-xs">
          <SquarePlus className="h-4 w-4 mr-2" /> Data Source
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
         
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
                className="h-9"
                required
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="h-9"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="h-9"
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
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDatasourceAdmin;