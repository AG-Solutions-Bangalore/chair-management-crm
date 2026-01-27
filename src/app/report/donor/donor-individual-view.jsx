import ReportHeader from "@/components/common/report-header";
import { Card } from "@/components/ui/card";
import { useGetMutation } from "@/hooks/use-get-mutation";
import Moment from "moment";
import moment from "moment/moment";
import { useEffect } from "react";
import { DONOR_SUMMARY_VIEW } from "../../../api";

const DonorIndividualView = ({
  receiptFromDate,
  receiptToDate,
  indicompFullName,
  componentRef,
}) => {
  const {
    data,
    isLoading: loader,
    isError,
    refetch,
  } = useGetMutation(
    `donor-individual-summary${indicompFullName}`,
    `${DONOR_SUMMARY_VIEW}/${indicompFullName}?from_date=${receiptFromDate}&to_date=${receiptToDate}`,
    {},
    {
      enabled: false,
    }
  );
  useEffect(() => {
    if (indicompFullName && receiptFromDate && receiptToDate) {
      refetch();
    }
  }, [indicompFullName, receiptFromDate, receiptToDate]);
  const donorsummary = data?.receipts || [];
  const individual = data?.individual_company || {};
  const receiptsummaryfooterOTS = data?.receipt_grand_total_ots || "";
  const receiptsummaryfootertotal = data?.receipt_grand_total_amount || "";
  return (
    <>
      {!loader && isError && (
        <div className="text-red-600 text-center">
          Error fetching donor summary. Please try again.
        </div>
      )}

      {!isError && (
        <div className="invoice-wrapper">
          <div className="flex flex-col items-center">
            <div className="w-full mx-auto">
              <Card className="p-6 overflow-x-auto grid md:grid-cols-1 1fr">
                <div ref={componentRef}>
                  <ReportHeader title="DONOR SUMMARY" />
                  {/* {individual?.map((individ, key) => ( */}
                  <div className="flex justify-between mb-6">
                    <div>
                      <p className="font-bold mb-1">
                        Full Name:{" "}
                        <span className="font-normal">
                          {individual.indicomp_type === "Individual"
                            ? `${individual.title} ${individual.indicomp_full_name}`
                            : `M/s ${individual.indicomp_full_name}`}
                        </span>
                      </p>
                      <p className="font-bold mb-1">
                        Contact Person/Spouse:{" "}
                        <span className="font-normal">
                          {individual.indicomp_type === "Individual"
                            ? individual.indicomp_spouse_name
                            : `${individual.title} ${individual.indicomp_com_contact_name}`}
                        </span>
                      </p>
                      <p className="font-bold mb-1">
                        Promoter:{" "}
                        <span className="font-normal">
                          {individual?.promoter?.indicomp_full_name || ""}
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="font-bold mb-1">
                        Mobile:{" "}
                        <span className="font-normal">
                          {individual.indicomp_mobile_phone}
                        </span>
                      </p>
                      <p className="font-bold mb-1">
                        PAN Number:{" "}
                        <span className="font-normal">
                          {individual.indicomp_pan_no}
                        </span>
                      </p>
                    </div>
                  </div>
                  {/* ))} */}

                  <div className="my-5">
                    <table className="min-w-full border-collapse border border-black">
                      <thead>
                        <tr className="bg-gray-200">
                          {[
                            "Receipt Date",
                            "Receipt No",
                            "Year",
                            "Amount",
                            "Exemption Type",
                            "Donation Type",
                            "No of OTS",
                            "Pay Mode",
                            "Pay Details",
                            "Realization Date",
                            "Reason",
                            "Remarks",
                          ].map((header) => (
                            <th
                              key={header}
                              className="border border-black py-2 text-center text-xs"
                            >
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>

                      <tbody>
                        {donorsummary && donorsummary.length > 0 ? (
                          donorsummary.map((dataSumm) => (
                            <tr key={dataSumm.id}>
                              <td className="border border-black px-4 py-2 text-xs">
                                {Moment(dataSumm.receipt_date).format(
                                  "DD-MM-YYYY"
                                )}
                              </td>
                              <td className="border border-black px-4 py-2 text-xs">
                                {dataSumm.receipt_no}
                              </td>
                              <td className="border border-black px-4 py-2 text-xs">
                                {dataSumm.receipt_financial_year}
                              </td>
                              <td className="border border-black px-4 py-2 text-xs">
                                {dataSumm.receipt_total_amount}
                              </td>
                              <td className="border border-black text-center text-xs">
                                {dataSumm.receipt_exemption_type}
                              </td>
                              <td className="border border-black text-center text-xs">
                                {dataSumm.receipt_donation_type}
                              </td>
                              <td className="border border-black text-center text-xs">
                                {dataSumm.receipt_no_of_ots}
                              </td>
                              <td className="border border-black text-center text-xs">
                                {dataSumm.receipt_tran_pay_mode}
                              </td>
                              <td className="border border-black text-center text-xs">
                                {dataSumm.receipt_tran_pay_details}
                              </td>
                              <td className="border border-black text-center text-xs">
                                {dataSumm.receipt_realization_date
                                  ? moment(
                                      dataSumm.receipt_realization_date
                                    ).format("DD-MM-YYYY")
                                  : ""}
                              </td>
                              <td className="border border-black text-center text-xs">
                                {dataSumm.receipt_reason || ""}
                              </td>
                              <td className="border border-black text-center text-xs">
                                {dataSumm.receipt_remarks || ""}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={12} className="text-center py-4">
                              No data available
                            </td>
                          </tr>
                        )}
                      </tbody>

                      {donorsummary.length > 0 && (
                        <tfoot>
                          <tr>
                            <td
                              colSpan={3}
                              className="border border-black text-center font-bold text-sm p-2"
                            >
                              Total
                            </td>
                            <td className="border border-black text-right px-4 text-xs font-bold">
                              {receiptsummaryfootertotal || ""}
                            </td>

                            <td colSpan={2}></td>
                            <td className="border border-black text-center text-xs font-bold">
                              {receiptsummaryfooterOTS || ""}
                            </td>
                          </tr>
                        </tfoot>
                      )}
                    </table>
                  </div>

                  <div className="flex justify-center items-center">
                    <b className="text-xl text-[#464D69]">TOTAL</b>
                  </div>
                  <div className="my-5">
                    <table className="min-w-full border-collapse border border-black">
                      <thead>
                        <tr className="bg-gray-200">
                          {["Year", "Total Amount"].map((header) => (
                            <th
                              key={header}
                              className="border border-black px-4 py-1 text-center text-sm md:text-base"
                            >
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {donorsummary && donorsummary.length > 0 ? (
                          donorsummary.map((dataSumm) => (
                            <tr key={dataSumm.id}>
                              <td className="border border-black px-4 py-2 text-sm md:text-base">
                                {dataSumm.receipt_financial_year}
                              </td>
                              <td className="border border-black px-4 py-2 text-sm md:text-base">
                                {dataSumm.receipt_total_amount}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan={2}
                              className="border border-black text-center py-4 text-sm md:text-base"
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

export default DonorIndividualView;
