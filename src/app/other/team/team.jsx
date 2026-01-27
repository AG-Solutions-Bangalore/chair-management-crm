import {
  DONOR_SUMMARY_FETCH_DONOR,
  OTHER_TEAM_COMMITTEE_DROPDOWN,
  OTHER_TEAM_COMMITTEE_LIST,
  OTHER_TEAM_CREATE,
  OTHER_TEAM_DESIGNATION_DROPDOWN,
} from "@/api";
import { MemoizedSelect } from "@/components/common/memoized-select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useGetMutation } from "@/hooks/use-get-mutation";
import { useState } from "react";

import { useApiMutation } from "@/hooks/use-mutation";
import moment from "moment";
import { toast } from "sonner";
import CommitteeList from "./committee-list";
import TeamLoading from "./teamloading";
import Cookies from "js-cookie";
import TeamCardLoading from "./team-cardloading";

const commiteeOptions = [
  { value: "Executive Committee", label: "Executive Committee" },
  { value: "Mahila Samiti", label: "Mahila Samiti" },
  { value: "Ekal Yuva", label: "Ekal Yuva" },
  { value: "Functional Committee", label: "Functional Committee" },
];

const Team = () => {
  const userType = Cookies.get("user_type_id");
  const [committee, setCommittee] = useState({
    committee_type: "",
    designation: "",
    indicomp_fts_id: "",
    indicomp_full_name: "",
    receipt_from_date: "",
    receipt_to_date: "",
    indicomp_full_name_dummy: "",
  });
  const { trigger, loading: updateloading } = useApiMutation();
  const {
    data: committeeResponse,
    isLoading: committeeLoading,
    isFetching: committeeFetching,
    refetch,
  } = useGetMutation("teamCommitteeList", OTHER_TEAM_COMMITTEE_LIST);
  const { data: designationOptions, isLoading: designationloading } =
    useGetMutation("teamdesignation", OTHER_TEAM_DESIGNATION_DROPDOWN);
  const { data: teamcommittes, isLoading: committesloading } = useGetMutation(
    "teamcommitte",
    OTHER_TEAM_COMMITTEE_DROPDOWN
  );

  const { data: memberdata, isLoading: membersloading } = useGetMutation(
    "memberdata",
    DONOR_SUMMARY_FETCH_DONOR
  );

  const handleInputChange = (value, field) => {
    if (field === "indicomp_full_name_dummy") {
      const selected = memberdata?.data?.find(
        (item) => item.indicomp_fts_id == value
      );
      if (selected) {
        setCommittee((prev) => ({
          ...prev,
          indicomp_full_name: selected.indicomp_fts_id,
          indicomp_full_name_dummy: selected.indicomp_full_name,
          receipt_from_date: selected.receipt_from_date || "",
          receipt_to_date: selected.receipt_to_date || "",
        }));
      }
    } else {
      setCommittee((prev) => ({ ...prev, [field]: value }));
    }
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    if (!committee.committee_type) {
      toast.warning("Please select Committee Type.");
      return;
    }

    if (!committee.designation) {
      toast.warning("Please select Designation.");
      return;
    }

    if (!committee.indicomp_full_name_dummy) {
      toast.warning("Please select Indicomp Full Name.");
      return;
    }

    const payload = {
      committee_type: committee.committee_type,
      designation: committee.designation,
      start_date: teamcommittes?.data?.committee_from,
      end_date: teamcommittes?.data?.committee_to,
      indicomp_fts_id: committee.indicomp_full_name,
      indicomp_full_name_dummy: committee.indicomp_full_name_dummy,
    };
    try {
      const res = await trigger({
        url: OTHER_TEAM_CREATE,
        method: "post",
        data: payload,
      });

      if (!res) {
        toast.warning("No response from server.");
        return;
      }
      if (res.code == 201) {
        toast.success(res?.msg || "Team created successfully!");
        refetch();
        setCommittee({
          committee_type: null,
          designation: null,
          indicomp_fts_id: null,
          indicomp_full_name: null,
          receipt_from_date: "",
          receipt_to_date: "",
          indicomp_full_name_dummy: null,
        });
      } else {
        toast.success(
          res?.msg || "Something went wrong while creating the team!"
        );
      }
    } catch (err) {
      console.error("Error creating team:", err);
      toast.error(
        err.message || "Something went wrong while creating the team."
      );
    }
  };

  return (
    <>

{/* Form Section */}
{designationloading || committesloading || membersloading ? (
  <TeamLoading />
) : (
  (userType === "1" || userType === "2") && (
    <Card className="bg-white shadow-md border  rounded-md">
      <CardContent className="p-6">
        <form className="space-y-6" onSubmit={onSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:flex lg:flex-row lg:items-end lg:gap-6 gap-6 flex-wrap">
            <div className="flex flex-col min-w-[220px]">
              <Label className="font-medium ">Active Duration</Label>
              <div className="flex gap-2 text-sm  mt-1">
                <span className="font-medium mt-1">From:</span>
                <span className="border rounded-md px-2 py-1 bg-gray-50 text-gray-700">
                  {teamcommittes?.data?.committee_from
                    ? moment(teamcommittes.data.committee_from).format(
                        "DD MMM YYYY"
                      )
                    : "—"}
                </span>
                <span className="font-medium mt-1">To:</span>
                <span className="border rounded-md px-2 py-1 bg-gray-50 text-gray-700">
                  {teamcommittes?.data?.committee_to
                    ? moment(teamcommittes.data.committee_to).format(
                        "DD MMM YYYY"
                      )
                    : "—"}
                </span>
              </div>
            </div>

            {/* Committee Type */}
            <div className="flex-1 min-w-[220px]">
              <Label className="font-medium " htmlFor="committee_type">
                Committee Type <span className="text-red-500">*</span>
              </Label>
              <MemoizedSelect
                name="committee_type"
                value={committee?.committee_type || ""}
                onChange={(e) => handleInputChange(e, "committee_type")}
                options={commiteeOptions}
                placeholder="Select Committee Type"
              />
            </div>

            {/* Designation */}
            <div className="flex-1">
              <Label className="font-medium" htmlFor="designation">
                Designation <span className="text-red-500">*</span>
              </Label>
              <MemoizedSelect
                name="designation"
                value={committee?.designation || ""}
                onChange={(e) => handleInputChange(e, "designation")}
                options={
                  designationOptions?.data?.map((item) => ({
                    label: item.designation_type,
                    value: item.designation_type,
                  })) || []
                }
                placeholder="Select Designation"
              />
            </div>

            {/* Member's Name */}
            <div className="flex-1">
              <Label className="font-medium" htmlFor="indicomp_full_name_dummy">
                Member's Name <span className="text-red-500">*</span>
              </Label>
              <MemoizedSelect
                name="indicomp_full_name_dummy"
                value={committee?.indicomp_full_name_dummy || ""}
                onChange={(e) => handleInputChange(e, "indicomp_full_name_dummy")}
                options={
                  memberdata?.data?.map((item) => ({
                    label: `${item.indicomp_full_name} (${item.indicomp_type})`,
                    value: item.indicomp_fts_id,
                  })) || []
                }
                placeholder="Select Member's Name"
              />
            </div>

            {/* Update Button */}
            <div className="flex items-end gap-4 mt-2">
              <Button className="text-white" type="submit">
                {updateloading ? "Updating..." : "Update"}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  )
)}

<div className="mt-4 w-full">
  {committeeLoading || committeeFetching ? (
    <TeamCardLoading />
  ) : (
    <CommitteeList committeeResponse={committeeResponse || []} refetch={refetch} />
  )}
</div>

    </>
  );
};

export default Team;
