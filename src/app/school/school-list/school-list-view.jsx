import { SCHOOL_FULL_LIST_VIEW } from "@/api";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetMutation } from "@/hooks/use-get-mutation";
import moment from "moment";
import { useParams } from "react-router-dom";
import SchoolViewLoading from "./loading";
import { decryptId } from "@/utils/encyrption/encyrption";

const SectionHeader = ({ title }) => (
  <div className="flex justify-between items-center">
    <h5 className="text-lg font-semibold">{title}</h5>
  </div>
);

const InfoField = ({ label, value }) => (
  <div className="flex justify-between py-2">
    <p className="text-sm font-medium">{label}</p>
    <p className="text-sm text-muted-foreground">{value || "Not Available"}</p>
  </div>
);

const SchoolListView = () => {
  const { id } = useParams();
  const decryptedId = decryptId(id);
  const { data: schoolviewdata, isLoading } = useGetMutation(
    `school-full-list-view${decryptedId}`,
    `${SCHOOL_FULL_LIST_VIEW}/${decryptedId}`
  );
  const school = schoolviewdata?.data?.schools || {};

  const schoolAdoption = schoolviewdata?.data?.schoolsadoption || [];
  if (isLoading) {
    return <SchoolViewLoading />;
  }

  return (
    <>
      <div className="max-w-screen">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main School Info */}
          <Card className="lg:col-span-8 p-6 space-y-6 shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-medium">School Details</span>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-blue-600">
                  {school.msid_fund || ""}
                </h3>
                <p>
                  {school.village || ""}, {school.district || ""}
                </p>
              </div>
            </div>

            <div>
              <InfoField
                label="School"
                value={`${school.village || ""} (${school.school_id || ""})`}
              />
              <InfoField
                label="Opening Date"
                value={
                  school.date_of_opening
                    ? moment(school.date_of_opening).format("DD-MM-YYYY")
                    : "-"
                }
              />
              <InfoField
                label="Region"
                value={`${school.region || ""} (${school.region_code || ""})`}
              />
              <InfoField
                label="Acchal"
                value={`${school.achal || ""} (${school.achal_code || ""})`}
              />
              <InfoField
                label="Cluster"
                value={`${school.cluster || ""} (${school.cluster_code || ""})`}
              />
              <InfoField
                label="Sub Cluster"
                value={`${school.sub_cluster || ""} (${
                  school.sub_cluster_code || ""
                })`}
              />
              <InfoField
                label="Teacher Name"
                value={`${school.teacher || ""} (${
                  school.teacher_gender || ""
                })`}
              />
              <InfoField
                label="Total Students (Boys/Girls)"
                value={`${school.total || ""} (${school.boys || ""} / ${
                  school.girls || ""
                })`}
              />
            </div>
          </Card>

          {/* Right Side Info */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="p-6 shadow">
              <SectionHeader title="Contact Information" />
              <div className="mt-4">
                <InfoField
                  label="Samiti Pramukh"
                  value={school.vidyalaya_samity_pramukh || ""}
                />
                <InfoField
                  label="VCF"
                  value={`${school.vcf_name || ""} (${school.vcf_phone || ""})`}
                />
                <InfoField
                  label="SCF"
                  value={`${school.scf_name || ""} (${school.scf_phone || ""})`}
                />
              </div>
            </Card>

            <Card className="p-6 shadow">
              <SectionHeader title="Village Statistics" />
              <div className="mt-4">
                <InfoField
                  label="Total Population"
                  value={school.population || ""}
                />
                <InfoField
                  label="Male Literacy"
                  value={school.literacy_rate_male || ""}
                />
                <InfoField
                  label="Female Literacy"
                  value={school.literacy_rate_female || ""}
                />
              </div>
            </Card>
          </div>
        </div>

        <Card className="p-6 mt-4 shadow-sm">
          <SectionHeader title="Adoption Details" />
          {schoolAdoption.length > 0 ? (
            <Table className="mt-4 border border-gray-300 rounded-lg overflow-hidden">
              <TableHeader>
                <TableRow className="h-10 bg-[var(--team-color)] hover:bg-[var(--team-color)]">
                  <TableHead className="text-left text-[var(--label-color)] text-sm font-medium px-4 py-2">
                    FTS
                  </TableHead>
                  <TableHead className="text-left text-[var(--label-color)] text-sm font-medium px-4 py-2">
                    Name
                  </TableHead>
                  <TableHead className="text-left text-[var(--label-color)] text-sm font-medium px-4 py-2">
                    Year
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {schoolAdoption?.map((adoption, idx) => (
                  <TableRow
                    key={idx}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <TableCell className="px-4 py-2 text-sm font-medium text-gray-700">
                      {adoption?.indicomp_fts_id || ""}
                    </TableCell>
                    <TableCell className="px-4 py-2 text-sm text-gray-700">
                      {adoption?.donor?.indicomp_full_name || ""}
                    </TableCell>
                    <TableCell className="px-4 py-2 text-sm text-gray-700">
                      {adoption?.schoolalot_financial_year || ""}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground mt-4">
              No adoption data available
            </p>
          )}
        </Card>
      </div>
    </>
  );
};

export default SchoolListView;
