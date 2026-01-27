import { CREATE_FILE_FOLDER } from "@/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useApiMutation } from "@/hooks/use-mutation";
import { Loader } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const CreateFile = ({ id, refetch }) => {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [filename, setFileName] = useState(null);
  const { trigger: CreateFileFolderTrigger, loading: isLoading } =
    useApiMutation();

  const handleSubmit = async () => {
    if (!file || !id || !filename) {
      toast.error("File Name  and File  are required");
      return;
    }

    const formData = new FormData();
    formData.append("file_folder_unique", id);
    formData.append("file_name", file);
    formData.append("folder_file_name", filename);
    try {
      const response = await CreateFileFolderTrigger({
        url: CREATE_FILE_FOLDER,
        method: "post",
        data: formData,
      });
      if (response?.code == 201) {
        toast.success(response.message || "File uploaded successfully");
        refetch();
        setFile(null);
        setOpen(false);
      } else {
        toast.error(response.message || "Failed to upload file");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to upload file");
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="inline-block">
          <Button variant="default" size="sm">
            Create File
          </Button>
        </div>
      </PopoverTrigger>

      <PopoverContent side="bottom" align="start" className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Upload File</h4>
            <p className="text-sm text-muted-foreground">
              Choose a file to upload
            </p>
          </div>
          <div className="grid gap-2">
            <div>
              <Input
                label="File Name"
                id="folder_file_name"
                type="text"
                onChange={(e) => setFileName(e.target.value)}
                placeholder="Enter your File Name"
              />
            </div>
            <div>
              <Input
                id="file_name"
                type="file"
                accept=".pdf, .xls, .xlsx, application/pdf, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </div>

            <Button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Upload File"
              )}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CreateFile;
