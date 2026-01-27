import { DONATION_SUMMARY_VIEW } from "@/api";
import ReportHeader from "@/components/common/report-header";
import { Card } from "@/components/ui/card";
import { useGetMutation } from "@/hooks/use-get-mutation";
import React, { useEffect, useMemo } from "react";

const DonationView = ({
  componentRef,
  receiptFromDate,
  receiptToDate,
  onLoadingChange,
}) => {
  const {
    data,
    isLoading: loader,
    isError: error,
    refetch,
  } = useGetMutation(
    "donation-summary-view",
    `${DONATION_SUMMARY_VIEW}?from_date=${receiptFromDate}&to_date=${receiptToDate}`,
    {},
    { enabled: false }
  );
  
  useEffect(() => {
    if (receiptFromDate && receiptToDate) {
      refetch();
    }
  }, [receiptFromDate, receiptToDate]);

  const donorsummary = data?.data || [];
  
  const groupedData = useMemo(() => {
    const result = {};
    donorsummary.forEach((item) => {
      const year = item.chapter_name;
      const donationType = item.receipt_donation_type;
      const amount = parseFloat(item.receipt_total_amount) || 0;
      const donationCount = item.total_count;
      const otsCount = item.receipt_no_of_ots;
      const donorCount = item.distinct_indicomp_count;

      if (!result[year]) {
        result[year] = {};
      }
      if (!result[year][donationType]) {
        result[year][donationType] = {
          totalAmount: 0,
          donationCount: 0,
          otsCount: 0,
          donorCount: 0,
        };
      }

      result[year][donationType].totalAmount += amount;
      result[year][donationType].donationCount += donationCount;
      result[year][donationType].otsCount += parseInt(otsCount, 10);
      result[year][donationType].donorCount += parseInt(donorCount, 10);
    });

    return result;
  }, [donorsummary]);

  const donationTypes = useMemo(() => {
    const types = new Set();
    donorsummary.forEach((item) => {
      types.add(item.receipt_donation_type);
    });
    return Array.from(types);
  }, [donorsummary]);

  const financialYearLabel =
    donorsummary.length > 0 ? "Financial Year" : "Financial Year";

  // Calculate grand totals
  const grandTotalDonations = Object.keys(groupedData).reduce((total, year) => {
    return (
      total +
      Object.values(groupedData[year]).reduce(
        (sum, type) => sum + type.donationCount,
        0
      )
    );
  }, 0);

  const grandTotalDonors = Object.keys(groupedData).reduce((total, year) => {
    return (
      total +
      Object.values(groupedData[year]).reduce(
        (sum, type) => sum + type.donorCount,
        0
      )
    );
  }, 0);

  const grandTotalOTS = Object.keys(groupedData).reduce((total, year) => {
    return (
      total +
      Object.values(groupedData[year]).reduce(
        (sum, type) => sum + type.otsCount,
        0
      )
    );
  }, 0);

  const grandTotalAmount = Object.keys(groupedData).reduce((total, year) => {
    return (
      total +
      Object.values(groupedData[year]).reduce(
        (sum, type) => sum + type.totalAmount,
        0
      )
    );
  }, 0);

  useEffect(() => {
    if (onLoadingChange) {
      onLoadingChange(loader);
    }
  }, [loader, onLoadingChange]);

  return (
    <>
      {!loader && error && (
        <div className="text-red-600 text-center">{error}</div>
      )}
      {!loader && !error && (
        <div className="invoice-wrapper">
          <div className="flex flex-col items-center">
            <div className="w-full mx-auto">
              <Card className="p-6 overflow-x-auto">
                <div ref={componentRef} className="my-5">
                  <ReportHeader title="DONATION SUMMARY" />
                  <table
                    border="1"
                    style={{
                      width: "100%",
                      textAlign: "left",
                      borderCollapse: "collapse",
                    }}
                  >
                    <thead className="bg-gray-200 text-xs">
                      <tr>
                        <th
                          style={{ border: "1px solid black", padding: "8px" }}
                        >
                          {financialYearLabel}
                        </th>
                        {donationTypes.map((type, index) => (
                          <th
                            key={index}
                            colSpan={4} // Changed from 3 to 4 for the new column
                            style={{
                              border: "1px solid black",
                              padding: "8px",
                              textAlign: "center",
                              verticalAlign: "middle",
                            }}
                          >
                            {type}
                          </th>
                        ))}
                        <th
                          style={{
                            border: "1px solid black",
                            padding: "8px",
                            textAlign: "center",
                            verticalAlign: "middle",
                          }}
                          colSpan={4} // Changed from 3 to 4
                        >
                          Grand Total
                        </th>
                      </tr>
                      <tr>
                        <th
                          style={{ border: "1px solid black", padding: "8px" }}
                        ></th>
                        {donationTypes.map((type, index) => (
                          <React.Fragment key={index}>
                            <th
                              style={{
                                border: "1px solid black",
                                padding: "8px",
                              }}
                            >
                              No of Donation
                            </th>
                            <th
                              style={{
                                border: "1px solid black",
                                padding: "8px",
                              }}
                            >
                              Donor Count
                            </th>
                            <th
                              style={{
                                border: "1px solid black",
                                padding: "8px",
                              }}
                            >
                              No of OTS
                            </th>
                            <th
                              style={{
                                border: "1px solid black",
                                padding: "8px",
                              }}
                            >
                              Amount
                            </th>
                          </React.Fragment>
                        ))}
                        <th
                          style={{ border: "1px solid black", padding: "8px" }}
                        >
                          No of Donation
                        </th>
                        <th
                          style={{ border: "1px solid black", padding: "8px" }}
                        >
                          Donor Count
                        </th>
                        <th
                          style={{ border: "1px solid black", padding: "8px" }}
                        >
                          No of OTS
                        </th>
                        <th
                          style={{ border: "1px solid black", padding: "8px" }}
                        >
                          Amount
                        </th>
                      </tr>
                    </thead>

                    <tbody className="text-xs">
                      {Object.keys(groupedData).length === 0 ? (
                        <tr>
                          <td
                            colSpan={donationTypes.length * 4 + 1 + 4} // Updated column calculation
                            style={{
                              textAlign: "center",
                              padding: "8px",
                              border: "1px solid black",
                            }}
                          >
                            No data available
                          </td>
                        </tr>
                      ) : (
                        Object.keys(groupedData).map((year) => (
                          <tr key={year}>
                            <td
                              style={{
                                border: "1px solid black",
                                padding: "8px",
                              }}
                            >
                              {year}
                            </td>
                            {donationTypes.map((type, index) => (
                              <React.Fragment key={index}>
                                <td
                                  style={{
                                    border: "1px solid black",
                                    padding: "8px",
                                    textAlign: "right",
                                  }}
                                >
                                  {groupedData[year][type]?.donationCount || 0}
                                </td>
                                <td
                                  style={{
                                    border: "1px solid black",
                                    padding: "8px",
                                    textAlign: "right",
                                  }}
                                >
                                  {groupedData[year][type]?.donorCount || 0}
                                </td>
                                <td
                                  style={{
                                    border: "1px solid black",
                                    padding: "8px",
                                    textAlign: "right",
                                  }}
                                >
                                  {groupedData[year][type]?.otsCount || 0}
                                </td>
                                <td
                                  style={{
                                    border: "1px solid black",
                                    padding: "8px",
                                    textAlign: "right",
                                  }}
                                >
                                  {groupedData[year][type]?.totalAmount || 0}
                                </td>
                              </React.Fragment>
                            ))}
                            <td
                              style={{
                                border: "1px solid black",
                                padding: "8px",
                                textAlign: "right",
                              }}
                            >
                              {grandTotalDonations}
                            </td>
                            <td
                              style={{
                                border: "1px solid black",
                                padding: "8px",
                                textAlign: "right",
                              }}
                            >
                              {grandTotalDonors}
                            </td>
                            <td
                              style={{
                                border: "1px solid black",
                                padding: "8px",
                                textAlign: "right",
                              }}
                            >
                              {grandTotalOTS}
                            </td>
                            <td
                              style={{
                                border: "1px solid black",
                                padding: "8px",
                                textAlign: "right",
                              }}
                            >
                              {grandTotalAmount}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>

                    {Object.keys(groupedData).length > 0 && (
                      <tfoot className="text-xs">
                        <tr>
                          <td
                            style={{
                              border: "1px solid black",
                              padding: "8px",
                              textAlign: "left",
                            }}
                          >
                            <strong>Grand Total:</strong>
                          </td>
                          {donationTypes.map((type, index) => {
                            const totalDonationsForType = Object.keys(
                              groupedData
                            ).reduce(
                              (total, year) =>
                                total +
                                (groupedData[year][type]?.donationCount || 0),
                              0
                            );
                            const totalDonorsForType = Object.keys(
                              groupedData
                            ).reduce(
                              (total, year) =>
                                total +
                                (groupedData[year][type]?.donorCount || 0),
                              0
                            );
                            const totalOTSForType = Object.keys(
                              groupedData
                            ).reduce(
                              (total, year) =>
                                total +
                                (groupedData[year][type]?.otsCount || 0),
                              0
                            );
                            const totalAmountForType = Object.keys(
                              groupedData
                            ).reduce(
                              (total, year) =>
                                total +
                                (groupedData[year][type]?.totalAmount || 0),
                              0
                            );

                            return (
                              <React.Fragment key={index}>
                                <td
                                  style={{
                                    border: "1px solid black",
                                    padding: "8px",
                                    textAlign: "right",
                                  }}
                                >
                                  <strong>{totalDonationsForType}</strong>
                                </td>
                                <td
                                  style={{
                                    border: "1px solid black",
                                    padding: "8px",
                                    textAlign: "right",
                                  }}
                                >
                                  <strong>{totalDonorsForType}</strong>
                                </td>
                                <td
                                  style={{
                                    border: "1px solid black",
                                    padding: "8px",
                                    textAlign: "right",
                                  }}
                                >
                                  <strong>{totalOTSForType}</strong>
                                </td>
                                <td
                                  style={{
                                    border: "1px solid black",
                                    padding: "8px",
                                    textAlign: "right",
                                  }}
                                >
                                  <strong>{totalAmountForType}</strong>
                                </td>
                              </React.Fragment>
                            );
                          })}
                          <td
                            style={{
                              border: "1px solid black",
                              padding: "8px",
                              textAlign: "right",
                            }}
                          >
                            <strong>{grandTotalDonations}</strong>
                          </td>
                          <td
                            style={{
                              border: "1px solid black",
                              padding: "8px",
                              textAlign: "right",
                            }}
                          >
                            <strong>{grandTotalDonors}</strong>
                          </td>
                          <td
                            style={{
                              border: "1px solid black",
                              padding: "8px",
                              textAlign: "right",
                            }}
                          >
                            <strong>{grandTotalOTS}</strong>
                          </td>
                          <td
                            style={{
                              border: "1px solid black",
                              padding: "8px",
                              textAlign: "right",
                            }}
                          >
                            <strong>{grandTotalAmount}</strong>
                          </td>
                        </tr>
                      </tfoot>
                    )}
                  </table>
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DonationView;