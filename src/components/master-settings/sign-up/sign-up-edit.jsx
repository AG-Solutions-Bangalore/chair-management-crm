import React from "react";
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";
import { Loader2, Edit, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import BASE_URL from "@/config/base-url";

const SignUpEdit = ({ signUpData }) => {



  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [chapters, setChapters] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);

  const queryClient = useQueryClient();

  // Fetch chapters data
  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const token = Cookies.get("token");
        const response = await axios.get(`${BASE_URL}/api/fetch-profile-chapter`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        if (response?.data?.data) {
          setChapters(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching chapters:", error);
        toast.error("Failed to load chapters");
      }
    };

    if (open) {
      fetchChapters();
    }
  }, [open]);

  // Initialize form with user data when dialog opens
  useEffect(() => {
    if (signUpData && open) {
      setSelectedChapter(signUpData.chapter_id?.toString() || "");
    }
  }, [signUpData, open]);

  // Handle chapter selection
  const handleChapterChange = (value) => {
    setSelectedChapter(value);
  };

  // Handle confirmation dialog open
  const handleUpdateClick = () => {
    if (!selectedChapter) {
      toast.error("Please select a chapter");
      return;
    }
    setConfirmOpen(true);
  };

  // Handle actual API update
  const handleConfirmUpdate = async () => {
    if (!selectedChapter) {
      toast.error("Please select a chapter");
      setConfirmOpen(false);
      return;
    }

    if (!signUpData?.id) {
      toast.error("No user data selected for updating");
      setConfirmOpen(false);
      return;
    }

    setIsLoading(true);
    try {
      const token = Cookies.get("token");
      const updateData = {
        chapter_id: parseInt(selectedChapter),
      };

      const response = await axios.put(
        `${BASE_URL}/api/update-signupuser/${signUpData.id}`,
        updateData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response?.data?.code === 200 || response?.status === 200) {
        toast.success(response.data?.message || "User chapter updated successfully");
        
        // Invalidate and refetch queries
        await queryClient.invalidateQueries(["signupUsers"]);
        
        // Close both dialogs
        setConfirmOpen(false);
        setOpen(false);
        
        // Reset form
        setSelectedChapter("");
      } else {
        toast.error(response.data?.message || "Failed to update user chapter");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update user chapter"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle dialog open/close
  const handleOpenChange = (isOpen) => {
    setOpen(isOpen);
    if (!isOpen) {
      // Reset form when dialog closes
      setSelectedChapter("");
      setConfirmOpen(false);
    }
  };

  // Get selected chapter name for display
  const getSelectedChapterName = () => {
    if (!selectedChapter) return "";
    const chapter = chapters.find(ch => ch.chapter_code.toString() === selectedChapter);
    return chapter ? chapter.chapter_name : "";
  };

  return (
    <>
      {/* Main Edit Dialog */}
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon">
            <Edit className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update User Chapter</DialogTitle>
            <DialogDescription>
              Assign a chapter to this user. This will determine their regional association.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-4">
              {/* User Information Display */}
              <div className="p-3 bg-muted rounded-md">
                <p className="text-sm font-medium">User Details:</p>
                <p className="text-sm text-muted-foreground">
               Name:   {signUpData?.name || "N/A"} <br/>
               Email:     {signUpData?.email || "N/A"}
                </p>
                <p className="text-sm text-muted-foreground">
                Chapter: {signUpData?.user_chapter || "Not Assigned"}
                </p>
              </div>

              {/* Chapter Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Chapter</label>
                <Select
                  value={selectedChapter}
                  onValueChange={handleChapterChange}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a chapter">
                      {selectedChapter ? getSelectedChapterName() : "Select chapter"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {chapters.length > 0 ? (
                      chapters.map((chapter) => (
                        <SelectItem 
                          key={chapter.chapter_code} 
                          value={chapter.chapter_code.toString()}
                        >
                          {chapter.chapter_name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-chapters" disabled>
                        No chapters available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  This will update the user's assigned chapter permanently.
                </p>
              </div>
            </div>

            {/* Update Button */}
            <Button
              onClick={handleUpdateClick}
              disabled={isLoading || !selectedChapter}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Update Chapter
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Chapter Update</DialogTitle>
            <DialogDescription>
              Are you sure you want to update this user's chapter assignment?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="p-4 bg-muted rounded-md space-y-2">
              <p className="text-sm">
                <span className="font-medium">User:</span> {signUpData?.name || "N/A"}
              </p>
              <p className="text-sm">
                <span className="font-medium">Chapter:</span> {getSelectedChapterName() || "N/A"}
              </p>
              <p className="text-sm text-muted-foreground">
                This action cannot be undone. The user will be associated with this chapter for all future activities.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirmUpdate}
              disabled={isLoading}
              variant="default"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Yes, Update Chapter"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SignUpEdit;