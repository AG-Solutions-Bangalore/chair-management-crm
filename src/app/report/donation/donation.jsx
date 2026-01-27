import { DONATION_SUMMARY_DOWNLOAD } from "@/api";
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
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Download, FileType, Loader, Printer } from "lucide-react";
import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { toast } from "sonner";
// import RecepitView from "./receipt-view";
import { useApiMutation } from "@/hooks/use-mutation";
import DonationView from "./donation-view";
import ReceiptLoading from "../receipt/loading";
const DonationSummary = () => {
  const [childLoading, setChildLoading] = useState(false);
  const todayback = moment().format("YYYY-MM-DD");
  const [isLoading, setIsLoading] = useState(true);
  const firstdate = moment().startOf("month").format("YYYY-MM-DD");
  const componentRef = useRef();
  const [downloadDonor, setDonorDownload] = useState({
    receipt_from_date: firstdate,
    receipt_to_date: todayback,
  });
  const [viewType, setViewType] = useState(false);
  const { trigger, loading } = useApiMutation();
  
  const handleInputChange = (e, field) => {
    const value = e.target ? e.target.value : e;

    setDonorDownload({ ...downloadDonor, [field]: value });
    if (downloadDonor.receipt_from_date) {
      setViewType(true);
    }
  };
  const handleClick = (e) => {
    e.preventDefault();
    if (downloadDonor.receipt_from_date) {
      setViewType(true);
    }
  };
  const handlePrintPdf = useReactToPrint({
    content: () => {
      if (
        !downloadDonor.receipt_from_date ||
        !downloadDonor.receipt_to_date ||
        !viewType
      ) {
        toast.warning(
          "Please select a donation and view type before printing!"
        );
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
    if (
      !downloadDonor.receipt_from_date ||
      !downloadDonor.receipt_to_date ||
      !viewType
    ) {
      toast.warning(
        "Please select a donation and view type before saving PDF."
      );
      return;
    }

    const input = componentRef.current;
    if (!input) {
      toast.warning("No data available to generate PDF.");
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

    if (
      !downloadDonor.receipt_from_date ||
      !downloadDonor.receipt_to_date ||
      !viewType
    ) {
      toast.warning("Please view a donation before downloading.");
      return;
    }

    try {
      const payload = {
        receipt_from_date: downloadDonor.receipt_from_date,
        receipt_to_date: downloadDonor.receipt_to_date,
      };

      const res = await trigger({
        url: DONATION_SUMMARY_DOWNLOAD,
        method: "post",
        data: payload,
        responseType: "blob",
      });

      if (!res) {
        toast.warning("No data found for the selected donation.");
        return;
      }

      const blob = new Blob([res], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "donation_summary.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("Donation Summary Downloaded Successfully!");
    } catch (err) {
      console.error("Error downloading Donation summary:", err);
      toast.error("Donation Summary could not be downloaded.");
    }
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);
  if (isLoading) {
    return <ReceiptLoading />;
  }
  return (
    <>
      <Card className="mt-4">
        <CardContent className="p-6">
          <form id="dowRecp" autoComplete="off" className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-end">
              {/* From Date */}
              <div className="flex flex-col space-y-2">
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
              <div className="flex flex-col space-y-2">
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

              {/* Action Icons (Print, PDF, Excel) */}
              <div className="flex gap-2 justify-start items-center col-span-2">
                <Button onClick={handleClick}>
                  {childLoading ? "Loading" : "View"}
                </Button>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={handlePrintPdf}
                        className="transition-all duration-300 hover:scale-110 border border-[var(--color-border)] hover:shadow-md"
                      >
                        <Printer className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Print Receipt</TooltipContent>
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
                        onClick={handleSavePDF}
                        className="transition-all duration-300 hover:scale-110 border border-[var(--color-border)] hover:shadow-md"
                      >
                        <Download className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Download PDF</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                {/* Download Excel */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={handleDownload}
                        className="transition-all duration-300 hover:scale-110 border border-[var(--color-border)] hover:shadow-md"
                      >
                        {loading ? (
                          <Loader className="h-5 w-5 animate-spin" />
                        ) : (
                          <FileType className="h-5 w-5" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Download Excel</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {viewType == true && (
        <div className="mt-4">
          <DonationView
            receiptFromDate={downloadDonor?.receipt_from_date}
            receiptToDate={downloadDonor?.receipt_to_date}
            componentRef={componentRef}
            onLoadingChange={setChildLoading}
          />
        </div>
      )}
    </>
  );
};

export default DonationSummary;
