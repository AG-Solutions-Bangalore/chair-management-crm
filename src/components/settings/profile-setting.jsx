import React from "react";
import { User, Mail, Phone, Calendar, Camera } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme-context";

const ProfileSetting = ({
  user,
  editProfile,
  setEditProfile,
  handleProfileUpdate,
  passwordData,
  setPasswordData,
  handlePasswordChange,
  updateProfileMutation,
  changePasswordMutation,
  fileInputRef,
  handleImageChange,
  getUserImageUrl,
  
}) => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 max-w-6xl mx-auto ">
      {/* Left Sidebar - Profile Info */}
      <div className="lg:col-span-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-4 shadow-sm">
        <div className="mb-2 pb-2 border-b border-gray-100 dark:border-gray-600">
          <h2 className="text-md font-medium text-gray-900 dark:text-white">Profile Information</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">Your personal details</p>
        </div>
        
        <div className="space-y-3">
          <div className="flex flex-col items-center space-y-3">
            <div className="relative">
              <img
                src={getUserImageUrl()}
                alt="Profile"
                className="w-24 h-24 rounded-md object-cover border-2 border-gray-200 dark:border-gray-600"
              />
              <div className="absolute bottom-0 right-0 bg-blue-600 rounded-md p-1 cursor-pointer">
                <Camera className="w-3 h-3 text-white" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
              <User className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500">Full Name</p>
                <p className="font-medium text-sm truncate">{user?.first_name || user?.name}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
              <Mail className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500">Email</p>
                <p className="font-medium text-sm truncate">{user?.email}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
              <Phone className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500">Phone</p>
                <p className="font-medium text-sm">{user?.phone || "Not provided"}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
              <Calendar className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-500">Last Login</p>
                <p className="font-medium text-sm">
                  {user?.last_login ? new Date(user.last_login).toLocaleDateString() : "Never"}
                </p>
              </div>
            </div>
          </div>

          <div className="">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Theme Color</p>
            <div className="flex gap-2 flex-wrap">
              {["default", "yellow", "green", "purple", "teal", "gray"].map((color) => {
                const colorsMap = {
                  default: "bg-blue-600",
                  yellow: "bg-yellow-500",
                  green: "bg-green-600",
                  purple: "bg-purple-600",
                  teal: "bg-teal-600",
                  gray: "bg-gray-600",
                };
                const isActive = theme === color;
                return (
                  <button
                    key={color}
                    onClick={() => setTheme(color)}
                    className={`w-6 h-6 rounded-md flex items-center justify-center transition-all duration-200
                      ${colorsMap[color]} 
                      ${isActive ? "shadow-md ring-1 ring-offset-1 ring-blue-400 scale-110" : "opacity-80 hover:opacity-100"}`}
                  >
                    {isActive && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-3 h-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Right Content - Forms */}
      <div className="lg:col-span-2 space-y-3">
        {/* Edit Profile Form */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-4 shadow-sm">
          <div className="mb-2 pb-2 border-b border-gray-100 dark:border-gray-600">
            <h2 className="text-md font-medium text-gray-900 dark:text-white">Edit Profile</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">Update your personal information</p>
          </div>
          
          <form onSubmit={handleProfileUpdate} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="first_name" className="text-sm">First Name</Label>
                <Input
                  id="first_name"
                  value={editProfile.first_name}
                  onChange={(e) =>
                    setEditProfile((prev) => ({ ...prev, first_name: e.target.value }))
                  }
                  placeholder="Enter your first name"
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="phone" className="text-sm">Phone Number</Label>
                <Input
                  id="phone"
                  value={editProfile.phone}
                  onChange={(e) =>
                    setEditProfile((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  placeholder="Enter your phone number"
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email" className="text-sm">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={editProfile.email}
                  onChange={(e) =>
                    setEditProfile((prev) => ({ ...prev, email: e.target.value }))
                  }
                  placeholder="Enter your email address"
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="image" className="text-sm">Profile Image</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  className="h-9 text-sm"
                />
              </div>
            </div>
            <Button 
              type="submit" 
              disabled={updateProfileMutation.isLoading} 
              className="h-9 text-sm px-4 mt-2"
            >
              {updateProfileMutation.isLoading ? "Updating..." : "Update Profile"}
            </Button>
          </form>
        </div>

        {/* Change Password Form */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-4 shadow-sm">
          <div className="mb-2 pb-2 border-b border-gray-100 dark:border-gray-600">
            <h2 className="text-md font-medium text-gray-900 dark:text-white">Change Password</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">Update your password securely</p>
          </div>
          
          <form onSubmit={handlePasswordChange} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label htmlFor="oldPassword" className="text-sm">Old Password</Label>
                <Input
                  id="oldPassword"
                  type="password"
                  value={passwordData.oldPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({ ...prev, oldPassword: e.target.value }))
                  }
                  placeholder="Old password"
                  required
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="newPassword" className="text-sm">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))
                  }
                  placeholder="New password"
                  required
                  className="h-9 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="confirmPassword" className="text-sm">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData((prev) => ({ ...prev, confirmPassword: e.target.value }))
                  }
                  placeholder="Confirm password"
                  required
                  className="h-9 text-sm"
                />
              </div>
            </div>
            <Button
              type="submit"
              disabled={changePasswordMutation.isLoading}
              className="h-9 text-sm px-4"
            >
              {changePasswordMutation.isLoading ? "Updating..." : "Change Password"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetting;