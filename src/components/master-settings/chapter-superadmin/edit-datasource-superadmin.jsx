import React, { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { CHAPTER_DATASOURCE_UPDATE_BY_ID } from "@/api";

const EditDatasourceSuperadmin = ({ datasourceData, open, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    data_source_type: "",
    chapter_id: "",
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    if (datasourceData) {
      setFormData({
        data_source_type: datasourceData.data_source_type || "",
        chapter_id: datasourceData.chapter_id || "",
      });
    }
  }, [datasourceData]);

  const handleSubmit = async () => {
    if (!formData.data_source_type.trim()) {
      toast.error("Data source type is required");
      return;
    }

    setIsLoading(true);
    try {
      const token = Cookies.get("token");
      
      const response = await axios.put(
        `${CHAPTER_DATASOURCE_UPDATE_BY_ID}/${datasourceData.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response?.data.code === 201) {
        toast.success(response.data.message || "Data source updated successfully");
        

        await queryClient.invalidateQueries(["chapter-datasource", datasourceData.chapter_id]);
        onClose();
      } else {
        toast.error(response.data.message || "Failed to update data source");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update data source"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Data Source</DialogTitle>
          <DialogDescription>
            Update the data source information below
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

          <div className="flex justify-end pt-2">
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-[120px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditDatasourceSuperadmin;