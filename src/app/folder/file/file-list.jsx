import { DELETE_FILE, DOWNLOAD_FILE, FETCH_FILE_FOLDER } from "@/api";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useApiMutation } from "@/hooks/use-mutation";
import {
  Download,
  File,
  FileMinus,
  FileSpreadsheet,
  Loader,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import LoadingFolderCard from "../folder/loading";
import CreateFile from "./create-file";

const FileList = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const [files, setFiles] = useState([]);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);
  const [downloadingFile, setDownloadingFile] = useState(null);
  const {
    trigger: fetchFilesTrigger,
    loading: isFetching,
    isError,
  } = useApiMutation();
  const { trigger: downloadTrigger } = useApiMutation();
  const { trigger: deleteTrigger, loading: isDeleting } = useApiMutation();

  const fetchFiles = async () => {
    if (!id) {
      toast.error("Folder ID is missing");
      return;
    }

    try {
      const response = await fetchFilesTrigger({
        url: FETCH_FILE_FOLDER,
        method: "post",
        data: { file_folder_unique: id },
      });

      const fileList = response?.data || response?.files || [];
      if (Array.isArray(fileList)) {
        setFiles(fileList);
      } else {
        setFiles([]);
        toast.error("Invalid response format from server");
      }
    } catch (error) {
      toast.error("Failed to fetch file data");
    }
  };

  useEffect(() => {
    if (id) fetchFiles();
  }, [id, location.state]);

  const handleDownload = async (fileName, e) => {
    e.stopPropagation();
    setDownloadingFile(fileName);

    try {
      const response = await downloadTrigger({
        url: DOWNLOAD_FILE,
        method: "post",
        data: { file_folder_unique: id, file_name: fileName },
        responseType: "blob",
      });

      const blob =
        response instanceof Blob
          ? response
          : new Blob([response.data], {
              type:
                response.headers?.["content-type"] ||
                "application/octet-stream",
            });

      if (blob.size > 0) {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        link.click();
        window.URL.revokeObjectURL(url);
        toast.success("File downloaded successfully");
      } else {
        toast.error("Failed to download file. Empty response.");
      }
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Unable to download file");
    } finally {
      setDownloadingFile(null);
    }
  };

  const handleDelete = (fileName, e) => {
    e.stopPropagation();
    setDeleteItem(fileName);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!id || !deleteItem) {
      toast.error("Missing file or folder ID");
      return;
    }

    const formData = new FormData();
    formData.append("file_folder_unique", id);
    formData.append("file_name", deleteItem);

    try {
      const response = await deleteTrigger({
        url: DELETE_FILE,
        method: "post",
        data: formData,
      });

      if (response?.code === 201) {
        toast.success(response?.message || "File deleted successfully");
        fetchFiles();
      } else {
        toast.error(response?.message || "Failed to delete file");
      }
    } catch {
      toast.error("Error deleting file");
    } finally {
      setDeleteConfirmOpen(false);
      setDeleteItem(null);
    }
  };

  if (isError) {
    return (
      <div className="w-full p-4">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-destructive font-medium mb-2">
              Error Fetching File Data
            </div>
            <Button onClick={fetchFiles} variant="outline" size="sm">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-left text-2xl text-gray-800 font-[500]">Files</h1>
        <CreateFile id={id} refetch={fetchFiles} />
      </div>

      {isFetching ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <LoadingFolderCard key={i} />
          ))}
        </div>
      ) : files.length === 0 ? (
        <h1 className="text-center text-xl text-gray-500 font-[500] py-8">
          No Files Available
        </h1>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {files.map((file) => {
            const fileUrl = file.path;
            const fileName = file.name;
            const ext = fileName.split(".").pop().toLowerCase();

            let Icon = File;
            let iconColor = "text-gray-500";
            if (["xlsx", "xls"].includes(ext)) {
              Icon = FileSpreadsheet;
              iconColor = "text-green-500";
            } else if (ext == "pdf") {
              Icon = FileMinus;
              iconColor = "text-red-500";
            }

            return (
              <div
                key={file.path}
                className="flex justify-between items-center border rounded-lg p-3 shadow-sm hover:shadow-md transition cursor-pointer"
       
                onClick={(e) => {
                  const ext = fileName.split(".").pop().toLowerCase();
                  const isXL = window.innerWidth >= 1280;

                  if (ext == "pdf" && isXL) {
                    handleDownload(fileName, e);
                    return;
                  }

                  navigate(`/file-preview?=${Date.now()}`, {
                    state: {
                      fileUrl: `${fileUrl}?t=${Date.now()}`,
                      fileName,
                      id,
                    },
                  });
                }}
              >
                <div className="flex items-center gap-2">
                  <Icon className={iconColor} size={24} />
                  <span
                    className="text-gray-700 truncate max-w-[120px]"
                    title={fileName}
                  >
                    {fileName.split(".")[0]}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {downloadingFile == fileName ? (
                    <Loader size={18} className="text-blue-500 animate-spin" />
                  ) : (
                    <Download
                      size={18}
                      className="text-blue-500 cursor-pointer"
                      onClick={(e) => handleDownload(fileName, e)}
                    />
                  )}
                  <Trash2
                    size={18}
                    className="text-red-500 cursor-pointer"
                    onClick={(e) => handleDelete(fileName, e)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. It will permanently delete the file.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              {isDeleting ? (
                <Loader size={16} className="animate-spin" />
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default FileList;
