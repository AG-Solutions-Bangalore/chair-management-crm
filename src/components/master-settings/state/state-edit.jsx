import React from "react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";

import { Loader2, Edit } from "lucide-react";
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const StateEdit = ({ state }) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    state_name: "",
    state_country: "",
    state_zone: "",
  });

  const queryClient = useQueryClient();


  React.useEffect(() => {
    if (state && open) {
      setFormData({
        state_name: state.state_name || "",
        state_country: state.state_country || "",
        state_zone: state.state_zone || "",
      });
    }
  }, [state, open]);

  const handleSubmit = async () => {
    if (!formData.state_name.trim() || !formData.state_country.trim() || !formData.state_zone.trim()) {
      toast.error("State name, country, and zone are required");
      return;
    }

    setIsLoading(true);
    try {
      const token = Cookies.get("token");
      const response = await axios.put(
        `${BASE_URL}/api/panel-update-state/${state.id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response?.data.code == 201) {
        toast.success(response.data.message || "State updated successfully");

        setFormData({
          state_name: "",
          state_country: "",
          state_zone: "",
        });
        
        
        await queryClient.invalidateQueries(["stateList"]);
        
       
        
        setOpen(false);
      } else {
        toast.error(response.data.message || "Failed to update state");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update state"
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
      {/* <TooltipProvider>
<Tooltip>
  <TooltipTrigger > */}
      <Button
      variant="ghost"
      size="icon"
    >
      <Edit className="h-4 w-4" />
    </Button>
    {/* </TooltipTrigger>
  <TooltipContent>
    <p>Edit State</p>
  </TooltipContent>
</Tooltip>
</TooltipProvider> */}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit State</DialogTitle>
          <DialogDescription>
            Update the details for this state
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Input
              id="state_name"
              placeholder="Enter state name"
              value={formData.state_name}
              onChange={handleInputChange}
            />
            <Input
              id="state_country"
              placeholder="Enter country"
              value={formData.state_country}
              onChange={handleInputChange}
            />
            <Input
              id="state_zone"
              placeholder="Enter zone"
              value={formData.state_zone}
              onChange={handleInputChange}
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
                Updating...
              </>
            ) : (
              "Update State"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StateEdit;