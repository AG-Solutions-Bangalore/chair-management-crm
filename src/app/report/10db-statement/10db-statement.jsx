import {
  DB_DOCUMENT_DOWNLOAD,
  DB_DOCUMENT_DOWNLOAD_GROUP,
  DB_DOCUMENT_DOWNLOAD_NO_PAN,
} from "@/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useApiMutation } from "@/hooks/use-mutation";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Download, FileType, Printer } from "lucide-react";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { toast } from "sonner";
import DbStatementAll from "./db-statement-all-view";
import DbStatementGroup from "./db-statement-group-view";
import DbStatementNoPan from "./db-statement-nopan-view";
import DbStatementLoading from "./loading";
const DBStatement = () => {
  const todayback = moment().format("YYYY-MM-DD");
  const firstdate = moment().startOf("month").format("YYYY-MM-DD");
  const componentRef = useRef();
  const [downloadDonor, setDonorDownload] = useState({
    receipt_from_date: firstdate,
    receipt_to_date: todayback,
  });
  const [isLoading, setIsLoading] = useState(true);

  const [viewType, setViewType] = useState(null);
  const [viewText, setViewText] = useState(null);
  const { trigger } = useApiMutation();
  const handleInputChange = (e, field) => {
    const value = e.target ? e.target.value : e;

    setDonorDownload({ ...downloadDonor, [field]: value });
    if (downloadDonor.receipt_from_date) {
      setViewType(true);
    }
  };
  const handleAllViewClick = (e) => {
    e.preventDefault();
    if (downloadDonor.receipt_from_date && downloadDonor.receipt_to_date) {
      setViewType("all");
      setViewText("ALL");
    }
  };

  const handleNoPanViewClick = (e) => {
    e.preventDefault();
    if (downloadDonor.receipt_from_date && downloadDonor.receipt_to_date) {
      setViewType("nopan");
      setViewText("NO PAN");
    }
  };
  const handleGroupViewClick = (e) => {
    e.preventDefault();
    if (downloadDonor.receipt_from_date && downloadDonor.receipt_to_date) {
      setViewType("group");
      setViewText("GROUP");
    }
  };
  const handlePrintPdf = useReactToPrint({
    content: () => {
      if (!downloadDonor.receipt_from_date || !viewType) {
        toast.warning("Please select a 10db form  and view  before printing!");
        return null;
      }
      return componentRef.current;
    },
    documentTitle: viewType == "Donation_Report",
    pageStyle: `
    @page { size: A4 portrait; margin: 5mm; }
    @media print {
      body { font-size: 10px; margin: 0; padding: 0; }
      table { font-size: 11px; }
      .print-hide { display: none; }
    }
  `,
  });

  const handleSavePDF = () => {
    if (!downloadDonor.receipt_from_date || !viewType) {
      toast.warning("Please select a 10db form  and view  before saving PDF.");
      return;
    }

    const input = componentRef.current;
    if (!input) {
      toast.warning("No data available");
      return;
    }

    html2canvas(input, { scale: 2 })
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        const imgWidth = canvas.width;
        const imgHeight = canvas.height;

        const margin = 20;
        const availableWidth = pdfWidth - 2 * margin;
        const ratio = Math.min(
          availableWidth / imgWidth,
          pdfHeight / imgHeight
        );

        pdf.addImage(
          imgData,
          "PNG",
          margin,
          margin,
          imgWidth * ratio,
          imgHeight * ratio
        );

        pdf.save(
          viewType === "group"
            ? "Donor_Group_Summary.pdf"
            : "Donor_Individual_Summary.pdf"
        );
      })
      .catch((error) => {
        console.error("Error generating PDF: ", error);
      });
  };
  const handleDownload = async (e) => {
    e.preventDefault();

    if (!viewType) {
      toast.warning("Please select a 10db form and view  before downloading.");
      return;
    }

    try {
      const payload = {
        receipt_from_date: downloadDonor.receipt_from_date,
        receipt_to_date: downloadDonor.receipt_to_date,
      };

      let url = "";
      if (viewType == "all") {
        url = DB_DOCUMENT_DOWNLOAD;
      } else if (viewType == "nopan") {
        url = DB_DOCUMENT_DOWNLOAD_NO_PAN;
      } else if (viewType == "group") {
        url = DB_DOCUMENT_DOWNLOAD_GROUP;
      }

      const res = await trigger({
        url,
        method: "post",
        data: payload,
        responseType: "blob",
      });

      if (!res) {
        toast.warning("No data found.");
        return;
      }

      const blob = new Blob([res], { type: "text/csv" });
      const urlObj = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = urlObj;

      // Set file name based on viewType
      let fileName = "";
      if (viewType === "all") fileName = "all_donor.csv";
      else if (viewType === "nopan") fileName = "donor_no_pan.csv";
      else if (viewType === "group") fileName = "donor_group_summary.csv";

      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Error downloading donor summary:", err);
    }
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);
  if (isLoading) {
    return <DbStatementLoading />;
  }
  return (
    <>
      <Card className="mt-4">
        <CardContent className="p-6">
          <form id="dowRecp" autoComplete="off" className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 items-end w-full">
              {/* From Date */}
              <div className="flex flex-col space-y-2 min-w-0">
                <Label htmlFor="receipt_from_date" required>
                  From Date 
                </Label>
                
                <Input
                  id="receipt_from_date"
                  name="receipt_from_date"
                  type="date"
                  value={downloadDonor.receipt_from_date}
                  onChange={(e) => handleInputChange(e, "receipt_from_date")}
                  required
                />
              </div>

              {/* To Date */}
              <div className="flex flex-col space-y-2 min-w-0">
                <Label htmlFor="receipt_to_date" required>
                  To Date
                </Label>
                <Input
                  id="receipt_to_date"
                  name="receipt_to_date"
                  type="date"
                  value={downloadDonor.receipt_to_date}
                  onChange={(e) => handleInputChange(e, "receipt_to_date")}
                  required
                />
              </div>

              {/* View Buttons */}
              <div className="flex flex-wrap gap-2 md:col-span-4 min-w-0">
                <Button className="text-white " onClick={handleAllViewClick}>
                  View
                </Button>
                <Button className="text-white " onClick={handleNoPanViewClick}>
                  No Pan View
                </Button>
                <Button className="text-white " onClick={handleGroupViewClick}>
                  Group View
                </Button>
                <div className="flex gap-2 justify-start flex-wrap md:col-span-2 ">
                  {/* Print */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          disabled={
                            !downloadDonor?.receipt_from_date ||
                            !downloadDonor?.receipt_to_date
                          }
                          onClick={handlePrintPdf}
                          className="transition-all duration-300 hover:scale-110 border border-[var(--color-border)] hover:shadow-md flex-shrink-0"
                        >
                          <Printer className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Print</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  {/* Download PDF */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          disabled={
                            !downloadDonor?.receipt_from_date ||
                            !downloadDonor?.receipt_to_date
                          }
                          onClick={handleSavePDF}
                          className="transition-all duration-300 hover:scale-110 border border-[var(--color-border)] hover:shadow-md flex-shrink-0"
                        >
                          <Download className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Download PDF</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  {/* Download Report */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={handleDownload}
                          className="transition-all duration-300 hover:scale-110 border border-[var(--color-border)] hover:shadow-md flex-shrink-0"
                        >
                          <FileType className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Download Report</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {viewType == "all" && (
        <div className="mt-4">
          <DbStatementAll
            receiptFromDate={downloadDonor?.receipt_from_date}
            receiptToDate={downloadDonor?.receipt_to_date}
            componentRef={componentRef}
            viewText={viewText}
          />
        </div>
      )}
      {viewType == "nopan" && (
        <div className="mt-4">
          <DbStatementNoPan
            receiptFromDate={downloadDonor?.receipt_from_date}
            receiptToDate={downloadDonor?.receipt_to_date}
            componentRef={componentRef}
            viewText={viewText}
          />
        </div>
      )}
      {viewType == "group" && (
        <div className="mt-4">
          <DbStatementGroup
            receiptFromDate={downloadDonor?.receipt_from_date}
            receiptToDate={downloadDonor?.receipt_to_date}
            componentRef={componentRef}
            viewText={viewText}
          />
        </div>
      )}
    </>
  );
};

export default DBStatement;
