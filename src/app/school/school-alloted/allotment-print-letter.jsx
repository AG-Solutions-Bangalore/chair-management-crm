import React from "react";
import Logo3 from "../../../assets/receipt/ekal.png";
import Logo1 from "../../../assets/receipt/fts.png";
import Logo2 from "../../../assets/receipt/top.png";
import moment from "moment";
const AllotmentPrintLetter = ({
  SchoolAlotView,
  OTSReceipts,
  SchoolAlotReceipt,
  componentRef,
}) => {
  const today = moment().format("DD/MM/YYYY");
  return (
    <div>
      <div className="flex flex-col items-center">
        <div className="sm:w-[90%] md:w-[90%] lg:w-[70%] mx-auto ">
          <div className="bg-white shadow-md rounded-lg px-16 pb-16 pt-6 ">
            <div ref={componentRef} className="print-container">
              <div className="flex justify-between items-center mb-4 ">
                <div className="invoice-logo">
                  <img src={Logo1} alt="session-logo" width="80" height="80" />
                </div>

                <div className="invoice-logo text-right">
                  <img src={Logo3} alt="session-logo" width="80" height="80" />
                </div>
              </div>

              <div>
                <label className="flex my-4 text-lg">Date: {today}</label>
                <label className="flex my-4 text-lg">To,</label>

                {Object.keys(SchoolAlotReceipt).length !== 0 && (
                  <div className="text-lg">
                    {SchoolAlotReceipt?.donor.indicomp_type !==
                      "Individual" && (
                      <p>
                        {SchoolAlotReceipt?.donor.title || ""}{" "}
                        {SchoolAlotReceipt?.donor.indicomp_full_name || ""}
                      </p>
                    )}
                    {SchoolAlotReceipt?.donor.indicomp_type ===
                      "Individual" && (
                      <p>
                        {SchoolAlotReceipt.donor.title}{" "}
                        {SchoolAlotReceipt.donor.indicomp_full_name}
                      </p>
                    )}
                    {SchoolAlotReceipt.donor.hasOwnProperty(
                      "indicomp_off_branch_address"
                    ) && (
                      <div className="text-lg">
                        <p>
                          {SchoolAlotReceipt.donor.indicomp_off_branch_address}
                        </p>
                        <p>
                          {SchoolAlotReceipt.donor.indicomp_off_branch_area}
                        </p>
                        <p>
                          {SchoolAlotReceipt.donor.indicomp_off_branch_ladmark}
                        </p>
                        <p>
                          {SchoolAlotReceipt.donor.indicomp_off_branch_city} -{" "}
                          {SchoolAlotReceipt.donor.indicomp_off_branch_pin_code}
                          ,{SchoolAlotReceipt.donor.indicomp_off_branch_state}
                        </p>
                      </div>
                    )}
                    {SchoolAlotReceipt.donor.hasOwnProperty(
                      "indicomp_res_reg_address"
                    ) && (
                      <div className="text-lg">
                        <p>
                          {SchoolAlotReceipt.donor.indicomp_res_reg_address}
                        </p>
                        <p>{SchoolAlotReceipt.donor.indicomp_res_reg_area}</p>
                        <p>
                          {SchoolAlotReceipt.donor.indicomp_res_reg_ladmark}
                        </p>
                        <p>
                          {SchoolAlotReceipt.donor.indicomp_res_reg_city} -{" "}
                          {SchoolAlotReceipt.donor.indicomp_res_reg_pin_code},
                          {SchoolAlotReceipt.donor.indicomp_res_reg_state}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <label className="flex my-4  text-lg">
                  {SchoolAlotReceipt?.donor?.indicomp_gender === "Female" && (
                    <>Respected Madam,</>
                  )}
                  {SchoolAlotReceipt?.donor?.indicomp_gender === "Male" && (
                    <>Respected Sir,</>
                  )}
                  {SchoolAlotReceipt?.donor?.indicomp_gender == null && (
                    <>Respected Sir,</>
                  )}
                </label>

                <div className="text-lg">
                  <div className=" mb-5 text-justify">
                    <label>
                      <b>
                        “Giving is not just about making donation, it’s about
                        making a difference”
                      </b>
                      <span>
                        {" "}
                        , we are able to bring about this difference only
                        because of the support of our kind donors. Your support
                        to FTS gives wings to the dreams of the little children
                        studying in Ekal Vidyalaya. We express our sincere
                        thanks and gratitude to you for adopting
                        <b>" One Teacher School " (OTS)</b> and thus helping us
                        in providing light of education to the weaker sections
                        of the society.
                      </span>
                    </label>
                  </div>
                  <div className="my-4 text-justify">
                    {" "}
                    <label>
                      Please find enclosed herewith details of the Ekal
                      Vidyalaya running with your assistance. You may also view
                      the details through our website: www.ekal.org. Please
                      click on <b>INSIGHTS</b> and enter your user ID{" "}
                      <b>{SchoolAlotReceipt?.donor?.indicomp_fts_code || ""}</b>{" "}
                      and Password{" "}
                      <b>{SchoolAlotReceipt?.donor?.indicomp_password || ""}</b>
                      .
                    </label>
                  </div>

                  <label className="flex my-4">
                    Please find enclosed herewith:
                  </label>

                  <label className="flex my-4">
                    • List of your adopted schools
                  </label>
                  <label className="flex my-4">
                    We hope to get your continued patronage for serving the
                    society.
                  </label>
                </div>
                <div className="text-lg">
                  <label className="flex my-4">Thanking you once again!!</label>
                  <label className="flex my-4">With Regards,</label>
                </div>
                <div className="my-2 mb-3 text-justify  text-lg">
                  <label className="flex my-4">Niraj Harodia</label>
                  <label className="flex my-4">(Secretary)</label>
                </div>
              </div>

              <div>
                <div className="invoice-logo">
                  <div className="flex justify-center">
                    <img
                      src={Logo2}
                      alt="session-logo"
                      width="300"
                      height="300"
                      className="mb-2"
                    />
                  </div>
                </div>
                <div className="text-center text-sm">
                  <label>
                    <small>
                      Head Office: Ekal Bhawan, 123/A, Harish Mukherjee Road,
                      Kolkata-26. Web: www.ftsindia.com Ph: 033 - 2454
                      4510/11/12/13 PAN: AAAAF0290L
                    </small>
                  </label>
                </div>
              </div>
              {/* page break from here  */}

              <div className="page-break">
                <div className="flex justify-between items-center mb-4  mt-12">
                  <div className="invoice-logo">
                    <img
                      src={Logo1}
                      alt="session-logo"
                      width="80"
                      height="80"
                    />
                  </div>

                  <div className="invoice-logo text-right">
                    <img
                      src={Logo3}
                      alt="session-logo"
                      width="80"
                      height="80"
                    />
                  </div>
                </div>

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
                      <tr className="bg-gray-200 ">
                        {[
                          "STATE",
                          "ANCHAL  CLUSTER",
                          "CLUSTER",
                          "SUB CLUSTER",
                          "VILLAGE",
                          "TEACHER",
                          "BOYS",
                          "GIRLS  ",
                          "TOTAL",
                        ].map((header, index) => (
                          <th
                            key={`${header}-${index}`}
                            className="border border-black px-1 py-1 text-center text-[10px]"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {Array.isArray(SchoolAlotView) &&
                        SchoolAlotView.map((dataSumm) => (
                          <tr key={dataSumm.id}>
                            <td className="border border-black px-2 py-2 text-xs">
                              {dataSumm.school_state}
                            </td>
                            <td className="border border-black px-2 py-2 text-xs">
                              {dataSumm.achal}
                            </td>
                            <td className="border border-black px-2 py-2 text-xs">
                              {dataSumm.cluster}
                            </td>
                            <td className="border border-black px-2 py-2 text-xs">
                              {dataSumm.sub_cluster}
                            </td>
                            <td className="border border-black px-2 py-2 text-xs">
                              {dataSumm.village}
                            </td>
                            <td className="border border-black px-2 py-2 text-xs">
                              {dataSumm.teacher}
                            </td>
                            <td className="border border-black px-2 py-2 text-xs">
                              {dataSumm.boys}
                            </td>
                            <td className="border border-black px-2 py-2 text-xs">
                              {dataSumm.girls}
                            </td>
                            <td className="border border-black px-2 py-2 text-xs">
                              {dataSumm.total}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
                <div>
                  <div className="invoice-logo">
                    <div className="flex justify-center">
                      <img
                        src={Logo2}
                        alt="session-logo"
                        width="300"
                        height="300"
                        className="mb-4"
                      />
                    </div>
                  </div>
                  <div className="text-center text-sm">
                    <label>
                      <small>
                        Head Office: Ekal Bhawan, 123/A, Harish Mukherjee Road,
                        Kolkata-26. Web: www.ftsindia.com Ph: 033 - 2454
                        4510/11/12/13 PAN: AAAAF0290L
                      </small>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllotmentPrintLetter;
