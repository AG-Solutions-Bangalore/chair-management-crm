import { DELETE_FOLDER, FETCH_FOLDER } from "@/api";
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
import { useGetMutation } from "@/hooks/use-get-mutation";
import { useApiMutation } from "@/hooks/use-mutation";
import { Folder as FolderIcon, Loader, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import CreateFolder from "./create-folder";
import LoadingFolderCard from "./loading";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
const FolderList = () => {
  const navigate = useNavigate();
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteItemdata, setDeleteItemdata] = useState(null);
  const {
    data: folderdata,
    isError,
    isFetching,
    refetch,
  } = useGetMutation("folderlist", FETCH_FOLDER);
  const { trigger: DeleteTrigger, loading: isLoading } = useApiMutation();

  const handleDeleteFile = (name) => {
    setDeleteItemdata(name);
    setDeleteConfirmOpen(true);
  };
  const fetchfolder = folderdata?.data;

  const confirmDelete = async () => {
    if (!deleteItemdata) {
      toast.error("Invalid folder selected for deletion");
      return;
    }
    const formData = new FormData();
    formData.append("file_folder_unique", deleteItemdata);
    try {
      const response = await DeleteTrigger({
        url: DELETE_FOLDER,
        method: "post",
        data: formData,
      });
      if (response.code == 201) {
        toast.success(response?.message || "Folder deleted successfully");
        refetch();
      } else {
        toast.error(response.message || "Failed to delete folder");
      }
    } catch (error) {
      toast.error(error || "Failed to delete folder");
    } finally {
      setDeleteConfirmOpen(false);
      setDeleteItemdata(null);
    }
  };
  if (isError) {
    return (
      <div className="w-full p-4  ">
        <div className="flex items-center justify-center h-64 ">
          <div className="text-center ">
            <div className="text-destructive font-medium mb-2">
              Error Fetching Folder List Data
            </div>
            <Button onClick={() => refetch()} variant="outline" size="sm">
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
        <h1 className="text-left text-2xl text-gray-800 font-[500]">Folders</h1>
        <CreateFolder refetch={refetch} />
      </div>
      {isFetching ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <LoadingFolderCard index={index} />
          ))}
        </div>
      ) : fetchfolder && fetchfolder?.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 ">
          {fetchfolder?.map((folder) => (
            <div
              key={folder.file_folder_unique}
              className="flex justify-between items-center border rounded-lg p-3 shadow-sm hover:shadow-md transition cursor-pointer group"
              onClick={() => navigate(`/file/${folder.file_folder_unique}`)}
            >
              <div className="flex items-center gap-2">
                <FolderIcon className="text-primary" size={24} />

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-gray-700 truncate max-w-[120px] group-hover:underline cursor-pointer">
                        {folder.file_folder}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      {folder.file_folder}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Trash2
                className="text-red-500 cursor-pointer"
                size={18}
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteFile(folder?.file_folder_unique);
                }}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-500 text-center py-10 col-span-full">
          No folders found.
        </div>
      )}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              folder.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              {isLoading ? (
                <Loader className="ml-2 h-4 w-4 animate-spin" />
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

export default FolderList;
