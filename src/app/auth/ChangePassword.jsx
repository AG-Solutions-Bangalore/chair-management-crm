"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

import { useApiMutation } from "@/hooks/useApiMutation";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CHANGE_PASSWORD_API } from "@/constants/apiConstants";

const ChangePassword = ({ open, setOpen }) => {
  const { trigger, loading: isLoading } = useApiMutation();

  const user = useSelector((state) => state.auth.user);

  const [formData, setFormData] = useState({
    username: "",
    oldPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    if (user?.name) {
      setFormData((prev) => ({
        ...prev,
        username: user.name,
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const { username, oldPassword, newPassword } = formData;

    if (!oldPassword || !newPassword) {
      toast.error("Please fill in all fields");
      return;
    }



    try {
      const res = await trigger({
        url: CHANGE_PASSWORD_API.create,
        method: "POST",
        data: {
          username,
          old_password: oldPassword,
          new_password: newPassword,
        },
      });

      if (res?.code === 201) {
        toast.success(res?.message || "Password updated successfully");
        setFormData((prev) => ({
          ...prev,
          oldPassword: "",
          newPassword: "",
        }));
        setOpen(false);
      } else {
        toast.error(res?.message || "Failed to update password");
      }
    } catch (error) {
      toast.error(error?.message || "Something went wrong");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-full max-w-sm" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="oldPassword">Current Password</Label>
            <Input
              id="oldPassword"
              name="oldPassword"
              type="password"
              placeholder="Enter current password"
              value={formData.oldPassword}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              name="newPassword"
              type="password"
              placeholder="Enter new password"
              value={formData.newPassword}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Change Password"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePassword;
