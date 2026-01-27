import { RECEIPT_SUMMARY_VIEW } from "@/api";
import ReportHeader from "@/components/common/report-header";
import { Card } from "@/components/ui/card";
import { useGetMutation } from "@/hooks/use-get-mutation";
import { useEffect } from "react";
import { NumericFormat } from "react-number-format";

const RecepitView = ({ componentRef, receiptFromDate, receiptToDate }) => {
  const {
    data,
    isLoading: loader,
    isError: error,
    refetch,
  } = useGetMutation(
    "recepit-summary-view",
    `${RECEIPT_SUMMARY_VIEW}?from_date=${receiptFromDate}&to_date=${receiptToDate}`,
    {},
    { enabled: false }
  );

  useEffect(() => {
    if (receiptFromDate && receiptToDate) {
      refetch();
    }
  }, [receiptFromDate, receiptToDate]);
  const donorsummary = data?.receipt || [];
  const receiptsummary = data?.receiptTotal || [];
  const grandots = data?.receipt_grand_total_ots || "";
  const totalsummarygeneral = data?.recveiptTotalGeneral || "";
  const receiptsummaryfootertotal = data?.receipt_grand_total_amount || "";
  const grandtotal = data?.receipt_grand_total_count || "";
  const receiptTotalMembership = data?.receiptTotalMembership || "";
  const receiptTotalOTS = data?.receiptTotalOTS || "";
  const safeNumber = (value) => {
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  };

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
                  <ReportHeader title="RECEPIT SUMMARY" />

                  <table className="min-w-full border-collapse border border-black">
                    <thead>
                      <tr className="bg-gray-200">
                        {[
                          "Month",
                          "Recepit Type",
                          "NO of Recpits",
                          "No of OTS",
                          "Amount",
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
                      {donorsummary.length > 0 ? (
                        donorsummary.map((dataSumm) => (
                          <tr key={dataSumm.id}>
                            <td className="border border-black px-4 py-2 text-xs">
                              {dataSumm.month_year}
                            </td>
                            <td className="border border-black px-4 py-2 text-xs">
                              {dataSumm.receipt_donation_type}
                            </td>
                            <td className="border border-black px-4 py-2 text-xs">
                              {dataSumm.total_count}
                            </td>
                            <td className="border border-black px-4 py-2 text-xs">
                              {dataSumm.total_ots}
                            </td>
                            <td className="border border-black text-right px-4 text-xs">
                              <NumericFormat
                                value={safeNumber(dataSumm.total_amount)}
                                displayType="text"
                                thousandSeparator
                                thousandsGroupStyle="lakh"
                                prefix="₹"
                                decimalScale={0}
                                fixedDecimalScale
                              />
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={5}
                            className="border border-black text-center py-4"
                          >
                            No data available
                          </td>
                        </tr>
                      )}
                    </tbody>
                    {donorsummary.length > 0 && (
                      <tfoot>
                        <tr>
                          <td
                            colSpan={2}
                            className="border border-black text-center font-bold text-xs"
                          >
                            Total
                          </td>
                          <td className="border border-black px-4 py-2 text-xs font-bold">
                            {grandtotal}
                          </td>

                          <td className="border border-black px-4 py-2 text-xs font-bold">
                            {grandots}
                          </td>

                          <td className="border border-black text-right px-4 py-2 text-xs font-bold">
                            <NumericFormat
                              value={safeNumber(receiptsummaryfootertotal)}
                              displayType="text"
                              thousandSeparator
                              thousandsGroupStyle="lakh"
                              prefix="₹"
                              decimalScale={0}
                              fixedDecimalScale
                            />
                          </td>
                        </tr>
                      </tfoot>
                    )}
                  </table>

                  <div className="grid grid-cols-4 mt-6">
                   
                      <div className="col-xl-3 flex items-center flex-col mb-4 md:mb-0">
                        <b className="items-center text-center">
                          One Teacher School
                        </b>
                        <NumericFormat
                          thousandSeparator
                          thousandsGroupStyle="lakh"
                          displayType="text"
                          prefix="₹ "
                          value={safeNumber(receiptTotalOTS)}
                          className="mt-2"
                        />
                      </div>
                 

                      <div className="col-xl-3 flex items-center flex-col mb-4 md:mb-0">
                        <b className="items-center text-center">
                          Membership Fees
                        </b>
                        <NumericFormat
                          thousandSeparator={true}
                          thousandsGroupStyle="lakh"
                          displayType={"text"}
                          prefix={"₹ "}
                          value={safeNumber(receiptTotalMembership)}
                          className="mt-2"
                        />
                      </div>
             

                 
                      <div className="col-xl-3 flex items-center flex-col mb-4 md:mb-0">
                        <b className="items-center text-center">Gn. Donation</b>
                        <NumericFormat
                          thousandSeparator={true}
                          thousandsGroupStyle="lakh"
                          displayType={"text"}
                          prefix={"₹ "}
                          value={safeNumber(totalsummarygeneral)}
                          className="mt-2"
                        />
                      </div>
                 

                      <div className="col-xl-3 flex items-center flex-col mb-4 md:mb-0">
                        <b className="items-center text-center">Total</b>
                        <NumericFormat
                          thousandSeparator={true}
                          thousandsGroupStyle="lakh"
                          displayType={"text"}
                          prefix={"₹ "}
                          value={safeNumber(receiptsummary)}
                          className="mt-2"
                        />
                      </div>
                  
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

export default RecepitView;
