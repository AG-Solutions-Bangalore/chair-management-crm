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
import { useLocation } from "react-router-dom";

import { toast } from "sonner";
import BASE_URL from "@/config/base-url";
import Cookies from "js-cookie";
const StateCreate = () => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    state_name: "",
    state_country: "",
    state_zone: "",
  });
  
  const queryClient = useQueryClient();
  const { pathname } = useLocation();

  const handleSubmit = async () => {
    if (!formData.state_name.trim() || !formData.state_country.trim() || !formData.state_zone.trim()) {
      toast.error("State name, country, and zone are required");
      return;
    }

    setIsLoading(true);
    try {
      const token = Cookies.get("token");
      const response = await axios.post(
        `${BASE_URL}/api/panel-create-state`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response?.data.code == 201) {
        toast.success(response.data.message || "State created successfully");

        setFormData({
          state_name: "",
          state_country: "",
          state_zone: "",
        });
        await queryClient.invalidateQueries(["stateList"]);
        setOpen(false);
      } else {
        toast.error(response.data.message || "Failed to create state");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to create state"
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
          <SquarePlus className="h-4 w-4 mr-2" /> State
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New State</DialogTitle>
          <DialogDescription>
            Enter the details for the new State
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
                Creating...
              </>
            ) : (
              "Create State"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StateCreate;