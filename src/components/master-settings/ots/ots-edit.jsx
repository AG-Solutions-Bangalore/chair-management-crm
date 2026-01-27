import React from "react";
import { useState } from "react";

import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";

import { Loader2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import BASE_URL from "@/config/base-url";
import { toast } from "sonner";
import Cookies from "js-cookie";

const OtsEdit = ({ otsData }) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    ots_exp_type: "",
  });

  const queryClient = useQueryClient();

  
  React.useEffect(() => {
    if (otsData && open) {
      setFormData({
        ots_exp_type: otsData.ots_exp_type || "",
      });
    }
  }, [otsData, open]);

  const handleSubmit = async () => {
    if (!formData.ots_exp_type.trim()) {
      toast({
        title: "Error",
        description: "Ots type is required",
        variant: "destructive",
      });
      return;
    }

    if (!otsData?.id) {
      toast({
        title: "Error",
        description: "No OTS data selected for editing",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const token = Cookies.get("token");
      const response = await axios.put(
        `${BASE_URL}/api/ots-exp-type/${otsData.id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response?.data.code == 201) {
        toast.success(response.data.message || 'OTS Updated Successfully');
        
        setFormData({
          ots_exp_type: "",
        });
        
      
        await queryClient.invalidateQueries(["otsList"]);
        
       
        
        setOpen(false);
      } else {
        toast.error(response.data.message || 'Error while updating OTS');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update OTS");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
         <Button
             variant="ghost"
             size="icon"
           >
             <Edit className="h-4 w-4" />
           </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">
              Edit OTS
            </h4>
            <p className="text-sm text-muted-foreground">
              Update the details for the OTS expensive type
            </p>
          </div>
          <div className="grid gap-2">
            <Input
              id="ots_exp_type"
              placeholder="Enter Expensive Type"
              value={formData.ots_exp_type}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  ots_exp_type: e.target.value,
                }))
              }
            />

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
                "Update OTS"
              )}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default OtsEdit;