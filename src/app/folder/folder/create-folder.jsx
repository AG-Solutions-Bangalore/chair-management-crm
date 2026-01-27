import { CREATE_FOLDER } from "@/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useApiMutation } from "@/hooks/use-mutation";
import { Loader, SquarePlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const CreateFolder = ({ refetch }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    file_folder: "",
  });
  const { trigger: CreateFolderTrigger, loading: isLoading } = useApiMutation();

  const handleSubmit = async () => {
    if (!formData.file_folder.trim()) {
      toast.error("Folder name  are required");
      return;
    }

    try {
      const response = await CreateFolderTrigger({
        url: CREATE_FOLDER,
        method: "post",
        data: formData,
      });
      if (response.code == 201) {
        toast.success(response.message || "Folder sucess created");
        refetch();
        setFormData({
          file_folder: "",
        });
        setOpen(false);
      } else {
        toast.error(response.message || "Failed to create folder");
      }
    } catch (error) {
      toast.error(error.message || "Failed to create folder");
    }
  };
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="default">Create Folder</Button>
      </PopoverTrigger>

      <PopoverContent side="bottom" align="start" className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Create New Folder</h4>
            <p className="text-sm text-muted-foreground">
              Enter the details for the new Folder
            </p>
          </div>
          <div className="grid gap-2">
            <Input
              id="file_folder"
              placeholder="Enter folder name"
              value={formData.file_folder}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  file_folder: e.target.value,
                }))
              }
            />

            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Folder"
              )}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CreateFolder;
