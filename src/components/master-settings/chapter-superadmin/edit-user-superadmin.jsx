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
import { CHAPTER_VIEW_UPDATE_USER } from "@/api";

const EditUserSuperadmin = ({ userData, ImageUrl, open, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState({
    name: "",
    email: "",
    first_name: "",
    image: null,
    last_name: "",
    phone: "",
    user_type_id: "",
    chapter_id: "",
    viewer_chapter_ids: "",
    user_school_ids: "",
    user_status: "",
    
  });
  const [currentImage, setCurrentImage] = useState("");

  const queryClient = useQueryClient();

  const UserDrop = [
    { value: "1", label: "User" },
    { value: "2", label: "Admin" },
  ];
  const statusOptions = [
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
  ];
  useEffect(() => {
    if (userData) {
      setUser({
        name: userData.name || "",
        email: userData.email || "",
        first_name: userData.first_name || "",
        image: userData.image || null,
        last_name: userData.last_name || "",
        phone: userData.phone || "",
        user_school_ids: userData.user_school_ids || "",
        viewer_chapter_ids: userData.viewer_chapter_ids || "",
        user_type_id: userData.user_type_id?.toString() || "",
        chapter_id: userData.chapter_id || "",
        user_status: userData.user_status || "Active",
      });
      setCurrentImage(userData.image || "");
    }
  }, [userData]);

  const handleSubmit = async () => {
    if (
      !user.name.trim() ||
      !user.email.trim() ||
      !user.first_name.trim() ||
      !user.phone.trim() ||
      !user.user_type_id || 
      !user.user_status
    ) {
      toast.error("All required fields must be filled");
      return;
    }

    setIsLoading(true);
    try {
      const token = Cookies.get("token");
      const formData = new FormData();

      formData.append("name", user.name);
      formData.append("first_name", user.first_name);
      formData.append("last_name", user.last_name || "");
      formData.append("email", user.email);
      formData.append("phone", user.phone);
      formData.append("user_status", user.user_status);
      formData.append("user_school_ids", user.user_school_ids);
      formData.append("viewer_chapter_ids", user.viewer_chapter_ids);
      formData.append("user_type", parseInt(user.user_type_id, 10));
      formData.append("chapter_id", user.chapter_id);
      formData.append("_method", "PUT");

      if (user.image instanceof File) {
        formData.append("image", user.image);
      }

      const response = await axios.post(
        `${CHAPTER_VIEW_UPDATE_USER}/${userData.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response?.data.code === 201) {
        toast.success(response.data.message || "User updated successfully");
        await queryClient.invalidateQueries(["chapter", userData.chapter_id]);
        onClose(); 
      } else {
        toast.error(response.data.message || "Failed to update user");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update user");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      if (/^\d*$/.test(value) && value.length <= 10) {
        setUser((prev) => ({ ...prev, [name]: value }));
      }
    } else {
      setUser((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    setUser((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };

  const getImageUrl = () => {
    if (user.image instanceof File) {
      return URL.createObjectURL(user.image);
    }
    if (currentImage) {
      const imageUrl =
        ImageUrl?.find((img) => img.image_for === "User")?.image_url || "";
      return `${imageUrl}${currentImage}`;
    }
    return "";
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>Update user information below</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">
                Username <span className="text-red-500">*</span>
              </label>
              <Input
                id="name"
                name="name"
                value={user.name}
                disabled
                placeholder="Username"
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email <span className="text-red-500">*</span>
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={user.email}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="first_name" className="text-sm font-medium">
                Full Name <span className="text-red-500">*</span>
              </label>
              <Input
                id="first_name"
                name="first_name"
                value={user.first_name}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="phone" className="text-sm font-medium">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <Input
                id="phone"
                name="phone"
                value={user.phone}
                onChange={handleInputChange}
                maxLength={10}
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="user_type_id" className="text-sm font-medium">
                User Type <span className="text-red-500">*</span>
              </label>
              <select
                id="user_type_id"
                name="user_type_id"
                value={user.user_type_id}
                onChange={handleInputChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Select User Type</option>
                {UserDrop.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <label htmlFor="user_status" className="text-sm font-medium">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                id="user_status"
                name="user_status"
                value={user.user_status}
                onChange={handleInputChange}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-2">
              <label htmlFor="image" className="text-sm font-medium">
                Profile Image
              </label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              {getImageUrl() && (
                <img
                  src={getImageUrl()}
                  alt="User"
                  className="mt-2 h-16 w-16 rounded-full object-cover"
                />
              )}
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

export default EditUserSuperadmin;
