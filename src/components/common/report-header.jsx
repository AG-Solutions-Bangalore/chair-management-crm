import React from "react";
import image3 from "../../assets/receipt/ekal.png";
import image1 from "../../assets/receipt/fts_log.png";
import image2 from "../../assets/receipt/top.png";
const ReportHeader = ({ title }) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <img src={image1} alt="fts-logo" width="120" height="120" />
      <div className="address text-center">
        <img src={image2} alt="session-logo" width="320px" />
        <h2 className="pt-3">
          <b className="text-xl text-[#464D69]">{title || ""}</b>
        </h2>
      </div>
      <img src={image3} alt="ekal-logo" width="80" height="80" />
    </div>
  );
};

export default ReportHeader;
