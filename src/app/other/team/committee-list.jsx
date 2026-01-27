import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useApiMutation } from "@/hooks/use-mutation";
import { ImagePlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { OTHER_TEAM_COMMITTEE_CREATE_IMAGE } from "../../../api";
import Cookies from "js-cookie";

const CommitteeList = ({ committeeResponse, refetch }) => {
  const userType = Cookies.get("user_type_id");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDonorId, setSelectedDonorId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const { trigger, loading: isSubmitting } = useApiMutation();
  const committeeData = committeeResponse?.data || [];
  const userImageBase =
    committeeResponse?.image_url?.find((i) => i.image_for == "Donor")
      ?.image_url || "";
  const noImageUrl =
    committeeResponse?.image_url?.find((i) => i.image_for == "No Image")
      ?.image_url || "";
  const groupedCommittees = committeeData.reduce((acc, item) => {
    const type = item.committee_type || "Others";
    if (!acc[type]) acc[type] = [];
    acc[type].push(item);
    return acc;
  }, {});

  const handleOpenDialog = (id) => {
    setSelectedFile(null);
    setSelectedDonorId(id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedDonorId(null);
    setSelectedFile(null);
  };

  const handleFileSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error("Please select an image before submitting.");
      return;
    }

    const formData = new FormData();
    formData.append("indicomp_fts_id", selectedDonorId);
    formData.append("indicomp_image_logo", selectedFile);

    try {
      const res = await trigger({
        url: OTHER_TEAM_COMMITTEE_CREATE_IMAGE,
        method: "post",
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res?.code === 201) {
        toast.success(res.msg || "Image uploaded successfully");
        handleCloseDialog();
        refetch();
      } else {
        toast.error(res?.msg || "Failed to upload image");
      }
    } catch (error) {
      toast.error(
        error.message || "Something went wrong while uploading image."
      );
      console.error(error);
    }
  };

  const committeeTypes = Object.keys(groupedCommittees);

  return (
    <>
      <div className="w-full">
        {committeeTypes.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            No committee data available.
          </p>
        ) : (
          <Tabs defaultValue={committeeTypes[0]} className="w-full">
            <div className="mt-4">
              <TabsList className="grid w-full grid-cols-4 mb-2 sticky top-16 shadow-sm">
                {committeeTypes.map((type) => (
                  <TabsTrigger key={type} value={type}>
                    {type}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            {committeeTypes.map((type) => (
              <TabsContent
                key={type}
                value={type}
                className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-0"
              >
                {groupedCommittees[type].length > 0 ? (
                  groupedCommittees[type].map((member) => {
                    const img = member?.indicomp_image_logo
                      ? `${userImageBase}${
                          member.indicomp_image_logo
                        }?t=${Date.now()}`
                      : noImageUrl;
                    return (
                      <Card
                        key={member?.id}
                        className="hover:shadow-md transition-all rounded-xl border border-gray-200 bg-white flex items-center gap-4 p-4"
                      >
                        <div className="relative shrink-0">
                          <img
                            src={img}
                            alt={member?.indicomp_full_name}
                            className="w-16 h-16 rounded-md object-cover border"
                            onError={(e) => (e.currentTarget.src = noImageUrl)}
                          />
                          {(userType === "1" || userType === "2") && (
                            <button
                              type="button"
                              onClick={() =>
                                handleOpenDialog(member?.indicomp_fts_id)
                              }
                              className="absolute bottom-0 right-0 bg-primary text-white p-1 rounded-md shadow-md hover:scale-105 transition"
                            >
                              <ImagePlus size={14} />
                            </button>
                          )}
                        </div>

                        <div className="flex flex-col justify-center">
                          <p className="text-sm font-semibold text-gray-800 leading-tight">
                            {member?.indicomp_full_name || "Unnamed"}
                          </p>
                          <p className="text-xs text-gray-600 font-medium">
                            {member?.designation || "—"}
                          </p>
                        </div>
                      </Card>
                    );
                  })
                ) : (
                  <div className="col-span-full text-center text-gray-500 py-6 text-sm">
                    No members found in this category.
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-md" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Add Donor Image</DialogTitle>
          </DialogHeader>

          <form
            onSubmit={handleFileSubmit}
            className="px-4 space-y-4"
            autoComplete="off"
          >
            <div>
              <Label className="font-medium" htmlFor="indicomp_image_logo">
                Donor Image <span className="text-red-500">*</span>
              </Label>
              <Input
                type="file"
                name="indicomp_image_logo"
                onChange={(e) => setSelectedFile(e.target.files[0])}
              />
            </div>

            <div className="flex justify-center gap-4">
              <Button
                type="submit"
                className="text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating..." : "Update"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CommitteeList;
