import React from "react";
import { useState } from "react";

import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";

import { Loader2, SquarePlus } from "lucide-react";
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
const DesignationCreate = () => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    designation_type: "",
  });
  
  const queryClient = useQueryClient();


  const handleSubmit = async () => {
    if (!formData.designation_type.trim()) {
      toast({
        title: "Error",
        description: "Designation type is required",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const token = Cookies.get("token");
      const response = await axios.post(
        `${BASE_URL}/api/designation`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response?.data.code == 201) {
        toast.success(response.data.message || 'Designation Created Successfully')
  
        setFormData({
          designation_type: "",
        });
        await queryClient.invalidateQueries(["designationList"]);
        setOpen(false);
      } else {
        toast.error(response.data.message || 'Error while creating Designation');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create designation");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
      
          <div>
              <Button
                                   variant="default"
                                   
                                  
                                 >
                                   <SquarePlus className="h-4 w-4" /> Designation
                                 </Button>
          </div>
      
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">
              Create New Designation
            </h4>
            <p className="text-sm text-muted-foreground">
              Enter the details for the new designation
            </p>
          </div>
          <div className="grid gap-2">
            <Input
              id="designation_type"
              placeholder="Enter Designation Type"
              value={formData.designation_type}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  designation_type: e.target.value,
                }))
              }
            />

            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`mt-2  `}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Designation"
              )}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DesignationCreate;