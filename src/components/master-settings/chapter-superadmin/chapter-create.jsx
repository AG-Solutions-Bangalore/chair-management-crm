import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";
import { ArrowLeft, Building, Info } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { ADD_CHAPTER_SUMBIT } from "@/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useFetchState } from "@/hooks/use-api";
import { Textarea } from "@/components/ui/textarea";

const ChapterCreate = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const token = Cookies.get("token");

  const [errors, setErrors] = useState({});
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const [chapter, setChapter] = useState({
    chapter_name: "",
    chapter_code: "",
    chapter_address: "",
    chapter_city: "",
    chapter_pin: "",
    chapter_state: "",
    chapter_phone: "",
    chapter_whatsapp: "",
    chapter_email: "",
    chapter_website: "",
    chapter_date_of_incorporation: "",
    chapter_region_code: "",
  });

  // Fetch states

  const { data: statesHooks, isLoading } = useFetchState();
  const states = statesHooks?.data || [];
  const validateOnlyDigits = (inputtxt) => {
    const phoneno = /^\d+$/;
    return inputtxt.match(phoneno) || inputtxt.length === 0;
  };

  const onInputChange = (e) => {
    const { name, value } = e.target;

    const digitFields = ["chapter_pin", "chapter_phone", "chapter_whatsapp"];

    if (digitFields.includes(name)) {
      if (validateOnlyDigits(value)) {
        setChapter((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    } else {
      setChapter((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!chapter.chapter_name?.trim()) {
      newErrors.chapter_name = "Chapter Name is required";
      isValid = false;
    }

    if (!chapter.chapter_address?.trim()) {
      newErrors.chapter_address = "Address is required";
      isValid = false;
    }

    if (!chapter.chapter_city?.trim()) {
      newErrors.chapter_city = "City is required";
      isValid = false;
    }

    if (!chapter.chapter_pin || !/^\d{6}$/.test(chapter.chapter_pin)) {
      newErrors.chapter_pin = "Valid 6-digit Pincode is required";
      isValid = false;
    }

    if (!chapter.chapter_state) {
      newErrors.chapter_state = "State is required";
      isValid = false;
    }

    if (!chapter.chapter_phone || !/^\d{10}$/.test(chapter.chapter_phone)) {
      newErrors.chapter_phone = "Valid 10-digit Phone Number is required";
      isValid = false;
    }

    if (
      chapter.chapter_whatsapp &&
      !/^\d{10}$/.test(chapter.chapter_whatsapp)
    ) {
      newErrors.chapter_whatsapp = "Valid 10-digit WhatsApp Number is required";
      isValid = false;
    }

    if (!chapter.chapter_email?.trim()) {
      newErrors.chapter_email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(chapter.chapter_email)) {
      newErrors.chapter_email = "Valid email address is required";
      isValid = false;
    }

    setErrors(newErrors);
    return { isValid, errors: newErrors };
  };

  const createChapterMutation = useMutation({
    mutationFn: async (formData) => {
      const response = await axios.post(ADD_CHAPTER_SUMBIT, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    },
    onSuccess: (data) => {
      if (data.code === 201) {
        queryClient.invalidateQueries(["chapters"]);
        toast.success(data.message);

        navigate("/master/chapter");
        setChapter({
          chapter_name: "",
          chapter_code: "",
          chapter_address: "",
          chapter_city: "",
          chapter_pin: "",
          chapter_state: "",
          chapter_phone: "",
          chapter_whatsapp: "",
          chapter_email: "",
          chapter_website: "",
          chapter_date_of_incorporation: "",
          chapter_region_code: "",
        });
      } else {
        toast.error(data.message || "Unexpected Error");
      }
    },
    onError: (error) => {
      console.error("Create chapter error:", error.response.data.message);
      toast.error(
        error.response.data.message || "An error occurred during create chapter"
      );
    },
    onSettled: () => {
      setIsButtonDisabled(false);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { isValid, errors } = validateForm();

    if (!isValid) {
      const firstError = Object.values(errors)[0];
      toast.error(firstError);
      return;
    }

    try {
      const formData = {
        chapter_name: chapter.chapter_name,
        chapter_code: chapter.chapter_code,
        chapter_address: chapter.chapter_address,
        chapter_city: chapter.chapter_city,
        chapter_pin: chapter.chapter_pin,
        chapter_state: chapter.chapter_state,
        chapter_phone: chapter.chapter_phone,
        chapter_whatsapp: chapter.chapter_whatsapp,
        chapter_email: chapter.chapter_email,
        chapter_website: chapter.chapter_website,
        chapter_date_of_incorporation: chapter.chapter_date_of_incorporation,
        chapter_region_code: chapter.chapter_region_code,
      };

      setIsButtonDisabled(true);
      createChapterMutation.mutate(formData);
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("An error occurred during submission");
      setIsButtonDisabled(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full space-y-1 p-4">
        <Card className="p-4">
          <CardHeader className="pb-3">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-56" />
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="p-4">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-6 w-32" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-1 p-4">
      {/* Header Card */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 p-4">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
              <Building className="text-muted-foreground w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <h1 className="text-md font-semibold text-gray-900">
                    Add Chapter
                  </h1>
                  <p className="text-xs text-gray-500 mt-1">
                    Create a new chapter record
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Button
            onClick={() => navigate("/master/chapter")}
            variant="outline"
            size="sm"
            className="flex items-center gap-1 flex-shrink-0 mt-2 sm:mt-0"
          >
            <ArrowLeft className="w-3 h-3" />
            Back
          </Button>
        </div>
      </Card>

      {/* Main Form */}
      <Card>
        <CardContent className="p-4">
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Chapter Details Section */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm p-1 rounded-md px-1 font-medium bg-[var(--team-color)] text-white">
                <Info className="w-4 h-4" />
                Chapter Details
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Chapter Name */}
                <div className="">
                  <Label htmlFor="chapter_name" className="text-xs font-medium">
                    Chapter Name *
                  </Label>
                  <Input
                    id="chapter_name"
                    name="chapter_name"
                    value={chapter.chapter_name}
                    onChange={onInputChange}
                    placeholder="Enter chapter name"
                  />
                  {errors?.chapter_name && (
                    <p className="text-red-500 text-xs">
                      {errors.chapter_name}
                    </p>
                  )}
                </div>

                {/* Chapter Code */}
                {/* <div className="">
                  <Label htmlFor="chapter_code" className="text-xs font-medium">
                    Chapter Code
                  </Label>
                  <Input
                    id="chapter_code"
                    name="chapter_code"
                    value={chapter.chapter_code}
                    onChange={onInputChange}
                    placeholder="Enter chapter code"
                  />
                </div> */}

                {/* Address */}
                <div className="md:col-span-2">
                  <Label
                    htmlFor="chapter_address"
                    className="text-xs font-medium"
                  >
                    Address *
                  </Label>
                  <Textarea
                    id="chapter_address"
                    name="chapter_address"
                    value={chapter.chapter_address}
                    onChange={onInputChange}
                    placeholder="Enter address"
                  />
                  {errors?.chapter_address && (
                    <p className="text-red-500 text-xs">
                      {errors.chapter_address}
                    </p>
                  )}
                </div>

                {/* City */}
                <div className="">
                  <Label htmlFor="chapter_city" className="text-xs font-medium">
                    City *
                  </Label>
                  <Input
                    id="chapter_city"
                    name="chapter_city"
                    value={chapter.chapter_city}
                    onChange={onInputChange}
                    placeholder="Enter city"
                  />
                  {errors?.chapter_city && (
                    <p className="text-red-500 text-xs">
                      {errors.chapter_city}
                    </p>
                  )}
                </div>

                {/* Pin */}
                <div className="">
                  <Label htmlFor="chapter_pin" className="text-xs font-medium">
                    Pin Code *
                  </Label>
                  <Input
                    id="chapter_pin"
                    name="chapter_pin"
                    type="tel"
                    value={chapter.chapter_pin}
                    onChange={onInputChange}
                    maxLength={6}
                    placeholder="Enter pin code"
                  />
                  {errors?.chapter_pin && (
                    <p className="text-red-500 text-xs">{errors.chapter_pin}</p>
                  )}
                </div>

                {/* State */}
                <div className="">
                  <Label
                    htmlFor="chapter_state"
                    className="text-xs font-medium"
                  >
                    State *
                  </Label>
                  <Select
                    value={chapter.chapter_state}
                    onValueChange={(value) =>
                      setChapter((prev) => ({ ...prev, chapter_state: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select State" />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map((state) => (
                        <SelectItem key={state.id} value={state.state_name}>
                          {state.state_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors?.chapter_state && (
                    <p className="text-red-500 text-xs">
                      {errors.chapter_state}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div className="">
                  <Label
                    htmlFor="chapter_phone"
                    className="text-xs font-medium"
                  >
                    Phone *
                  </Label>
                  <Input
                    id="chapter_phone"
                    name="chapter_phone"
                    type="tel"
                    value={chapter.chapter_phone}
                    onChange={onInputChange}
                    maxLength={10}
                    placeholder="Enter phone number"
                  />
                  {errors?.chapter_phone && (
                    <p className="text-red-500 text-xs">
                      {errors.chapter_phone}
                    </p>
                  )}
                </div>

                {/* WhatsApp */}
                <div className="">
                  <Label
                    htmlFor="chapter_whatsapp"
                    className="text-xs font-medium"
                  >
                    WhatsApp
                  </Label>
                  <Input
                    id="chapter_whatsapp"
                    name="chapter_whatsapp"
                    type="tel"
                    value={chapter.chapter_whatsapp}
                    onChange={onInputChange}
                    maxLength={10}
                    placeholder="Enter WhatsApp number"
                  />
                  {errors?.chapter_whatsapp && (
                    <p className="text-red-500 text-xs">
                      {errors.chapter_whatsapp}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="">
                  <Label
                    htmlFor="chapter_email"
                    className="text-xs font-medium"
                  >
                    Email *
                  </Label>
                  <Input
                    id="chapter_email"
                    name="chapter_email"
                    type="email"
                    value={chapter.chapter_email}
                    onChange={onInputChange}
                    placeholder="Enter email address"
                  />
                  {errors?.chapter_email && (
                    <p className="text-red-500 text-xs">
                      {errors.chapter_email}
                    </p>
                  )}
                </div>

                {/* Website */}
                <div className="">
                  <Label
                    htmlFor="chapter_website"
                    className="text-xs font-medium"
                  >
                    Website
                  </Label>
                  <Input
                    id="chapter_website"
                    name="chapter_website"
                    value={chapter.chapter_website}
                    onChange={onInputChange}
                    placeholder="Enter website URL"
                  />
                </div>

                {/* Region Code */}
                {/* <div className="">
                  <Label htmlFor="chapter_region_code" className="text-xs font-medium">
                    Region Code
                  </Label>
                  <Input
                    id="chapter_region_code"
                    name="chapter_region_code"
                    value={chapter.chapter_region_code}
                    onChange={onInputChange}
                    placeholder="Enter region code"
                  />
                </div> */}

                {/* Incorporation Date */}
                <div className="">
                  <Label
                    htmlFor="chapter_date_of_incorporation"
                    className="text-xs font-medium"
                  >
                    Incorporation Date
                  </Label>
                  <Input
                    id="chapter_date_of_incorporation"
                    name="chapter_date_of_incorporation"
                    type="date"
                    value={chapter.chapter_date_of_incorporation}
                    onChange={onInputChange}
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 pt-6 border-t">
              <Button
                type="submit"
                disabled={isButtonDisabled || createChapterMutation.isPending}
                className="flex items-center gap-2"
              >
                {createChapterMutation.isPending ? (
                  <>
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Building className="w-4 h-4" />
                    Create Chapter
                  </>
                )}
              </Button>
              <Button
                onClick={() => navigate("/master/chapter")}
                type="button"
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChapterCreate;
