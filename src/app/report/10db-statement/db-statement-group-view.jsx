import { DB_DOCUMENT_VIEW_GROUP } from "@/api";
import ReportHeader from "@/components/common/report-header";
import { Card } from "@/components/ui/card";
import { useGetMutation } from "@/hooks/use-get-mutation";
import { useEffect } from "react";

const DbStatementGroup = ({
  receiptFromDate,
  receiptToDate,
  componentRef,
  viewText,
}) => {
  const {
    data: dbgroupdata,
    isLoading: loader,
    isError: error,
    refetch,
  } = useGetMutation(
    "db-group-view",
    `${DB_DOCUMENT_VIEW_GROUP}?from_date=${receiptFromDate}&to_date=${receiptToDate}`,
    {},
    { enabled: false }
  );
  useEffect(() => {
    if (receiptFromDate && receiptToDate) {
      refetch();
    }
  }, [receiptFromDate, receiptToDate]);
  const DBGroupDataView = dbgroupdata?.data || [];
  return (
    <>
      <div className="invoice-wrapper">
        <div className="flex flex-col items-center">
          <div className="w-full mx-auto">
            <Card className="p-6 overflow-x-auto grid md:grid-cols-1 1fr">
              {/* Table */}
              <div ref={componentRef}>
                <ReportHeader title={`FORM No. 10BD ${viewText || ""}`} />
                <table className="min-w-full border-collapse border border-black">
                  <thead>
                    <tr className="bg-gray-200">
                      {[
                        "Unique Identification Number of the donor	",
                        "ID code",
                        "Section code",
                        "Name of donor",
                        "Address of donor",
                        "Donation Type",
                        "Mode of receipt",
                        "Amount of donation (Indian rupees)",
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
                  {DBGroupDataView.length > 0 ? (
                    <tbody>
                      {DBGroupDataView?.map((dataSumm) => (
                        <tr key={dataSumm.id}>
                          <td className="border border-black px-4 py-2 text-xs">
                            {dataSumm.indicomp_pan_no}
                          </td>
                          <td className="border border-black px-4 py-2 text-xs">
                            1
                          </td>
                          <td className="border border-black px-4 py-2 text-xs">
                            Section 80G
                          </td>
                          <td className="border border-black px-4 py-2 text-xs">
                            {dataSumm.indicomp_type !== "Individual" && (
                              <>M/s {dataSumm.indicomp_full_name} </>
                            )}
                            {dataSumm.indicomp_type === "Individual" && (
                              <>
                                {dataSumm.title} {dataSumm.indicomp_full_name}
                              </>
                            )}
                          </td>

                          <td className="border border-black text-center text-xs">
                            {dataSumm.indicomp_corr_preffer == "Residence" && (
                              <>
                                {dataSumm.indicomp_res_reg_address}
                                {" ,"}
                                {dataSumm.indicomp_res_reg_area}
                                {" ,"}
                                {dataSumm.indicomp_res_reg_ladmark}
                                {" ,"}
                                {dataSumm.indicomp_res_reg_city}
                                {" - "}
                                {dataSumm.indicomp_res_reg_pin_code}
                                {" ,"}
                                {dataSumm.indicomp_res_reg_state}
                              </>
                            )}
                            {dataSumm.indicomp_corr_preffer == "Registered" && (
                              <>
                                {dataSumm.indicomp_res_reg_address}
                                {" ,"}
                                {dataSumm.indicomp_res_reg_area}
                                {" ,"}
                                {dataSumm.indicomp_res_reg_ladmark}
                                {" ,"}
                                {dataSumm.indicomp_res_reg_city}
                                {" - "}
                                {dataSumm.indicomp_res_reg_pin_code}
                                {" ,"}
                                {dataSumm.indicomp_res_reg_state}
                              </>
                            )}{" "}
                            {dataSumm.indicomp_corr_preffer == "Office" && (
                              <>
                                {dataSumm.indicomp_off_branch_address}
                                {" ,"}
                                {dataSumm.indicomp_off_branch_area}
                                {" ,"}
                                {dataSumm.indicomp_off_branch_ladmark}
                                {" ,"}
                                {dataSumm.indicomp_off_branch_city}
                                {" - "}
                                {dataSumm.indicomp_off_branch_pin_code}
                                {" ,"}
                                {dataSumm.indicomp_off_branch_state}
                              </>
                            )}
                            {dataSumm.indicomp_corr_preffer ==
                              "Branch Office" && (
                              <>
                                {dataSumm.indicomp_off_branch_address}
                                {" ,"}
                                {dataSumm.indicomp_off_branch_area}
                                {" ,"}
                                {dataSumm.indicomp_off_branch_ladmark}
                                {" ,"}
                                {dataSumm.indicomp_off_branch_city}
                                {" - "}
                                {dataSumm.indicomp_off_branch_pin_code}
                                {" ,"}
                                {dataSumm.indicomp_off_branch_state}
                              </>
                            )}
                          </td>
                          <td className="border border-black text-center text-xs">
                            {dataSumm.receipt_donation_type}
                          </td>
                          <td className="border border-black text-center text-xs">
                            {dataSumm.receipt_tran_pay_mode}
                          </td>
                          <td className="border border-black text-center text-xs">
                            {dataSumm.receipt_total_amount}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  ) : (
                    <tr>
                      <td colSpan={12} className="text-center py-4">
                        No data available
                      </td>
                    </tr>
                  )}
                </table>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default DbStatementGroup;
