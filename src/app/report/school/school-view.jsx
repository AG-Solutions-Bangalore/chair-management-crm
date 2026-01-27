import { SCHOOL_ALLOT_LETTER } from "@/api";
import ReportHeader from "@/components/common/report-header";
import { Card } from "@/components/ui/card";
import { useGetMutation } from "@/hooks/use-get-mutation";
import { useEffect } from "react";

const SchoolView = ({ indicompFullName, componentRef, onLoadingChange }) => {
  const {
    data,
    isLoading: loader,
    isError: error,
    refetch,
  } = useGetMutation(
    `school-summary-view${indicompFullName}`,
    `${SCHOOL_ALLOT_LETTER}/${indicompFullName}`,
    {},
    { enabled: false }
  );

  useEffect(() => {
    if (indicompFullName) {
      refetch();
    }
  }, [indicompFullName]);
  useEffect(() => {
    if (onLoadingChange) {
      onLoadingChange(loader);
    }
  }, [loader, onLoadingChange]);
  const SchoolAlotReceipt = data?.data?.individualCompany || {};
  const SchoolAlotView = data?.data?.SchoolAlotView || [];
  const OTSReceipts = data?.data?.OTSReceipts || [];
  return (
    <>
      {!loader && error && (
        <div className="text-red-600 text-center">{error}</div>
      )}
      {!loader && !error && (
        <div className="invoice-wrapper">
          <div className="flex flex-col items-center">
            <div className="w-full mx-auto ">
              <Card className="p-6 overflow-x-auto grid md:grid-cols-1 1fr">
                <div ref={componentRef} className="my-5">
                  <ReportHeader title="SCHOOL SUMMARY" />

                  <div>
                    <div>
                      <label>
                        Donor Id : {SchoolAlotReceipt.indicomp_fts_id}
                      </label>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div>
                      {SchoolAlotReceipt?.donor?.indicomp_type !==
                        "Individual" && (
                        <label>
                          Donor Name :{" "}
                          {SchoolAlotReceipt?.donor?.indicomp_full_name}
                        </label>
                      )}

                      {SchoolAlotReceipt?.donor?.indicomp_type ===
                        "Individual" && (
                        <label>
                          Donor Name :{" "}
                          {SchoolAlotReceipt?.donor?.indicomp_full_name}
                        </label>
                      )}
                    </div>
                    <div>
                      <label>
                        No of Schools :
                        {OTSReceipts.map((otsreceipt, key) => (
                          <> {otsreceipt.receipt_no_of_ots}</>
                        ))}
                      </label>
                    </div>
                  </div>
                  <div className="my-5 overflow-x-auto mb-14">
                    <table className="min-w-full border-collapse border border-black">
                      <thead>
                        <tr className="bg-gray-200">
                          {[
                            "STATE",
                            "ANCHAL  CLUSTER",
                            "STATE",
                            "SUB CLUSTER",
                            "VILLAGE",
                            "TEACHER",
                            "BOYS",
                            "GIRLS  ",
                            "TOTAL",
                          ].map((header) => (
                            <th
                              key={header}
                              className="border border-black px-4 py-2 text-center text-xs"
                            >
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {Array.isArray(SchoolAlotView) &&
                        SchoolAlotView.length > 0 ? (
                          SchoolAlotView.map((dataSumm) => (
                            <tr key={dataSumm.id}>
                              <td className="border border-black px-4 py-2 text-xs">
                                {dataSumm.school_state}
                              </td>
                              <td className="border border-black px-4 py-2 text-xs">
                                {dataSumm.achal}
                              </td>
                              <td className="border border-black px-4 py-2 text-xs">
                                {dataSumm.cluster}
                              </td>
                              <td className="border border-black px-4 py-2 text-xs">
                                {dataSumm.sub_cluster}
                              </td>
                              <td className="border border-black px-4 py-2 text-xs">
                                {dataSumm.village}
                              </td>
                              <td className="border border-black px-4 py-2 text-xs">
                                {dataSumm.teacher}
                              </td>
                              <td className="border border-black px-4 py-2 text-xs">
                                {dataSumm.boys}
                              </td>
                              <td className="border border-black px-4 py-2 text-xs">
                                {dataSumm.girls}
                              </td>
                              <td className="border border-black px-4 py-2 text-xs">
                                {dataSumm.total}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan="9"
                              className="border border-black px-4 py-3 text-center text-sm text-gray-500"
                            >
                              No data available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SchoolView;
