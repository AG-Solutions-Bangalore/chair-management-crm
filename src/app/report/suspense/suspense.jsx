"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Download, FileType, Loader, Printer } from "lucide-react";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { toast } from "sonner";

import { SUSPENSE_SUMMARY_DOWNLOAD, SUSPENSE_SUMMARY_VIEW } from "@/api";
import ReportHeader from "@/components/common/report-header";
import { useGetMutation } from "@/hooks/use-get-mutation";
import { useApiMutation } from "@/hooks/use-mutation";
import { Button } from "@/components/ui/button";
import SuspenseLoading from "./loading";

const SuspenseSummary = () => {
  const componentRef = useRef();

  const { trigger, loading } = useApiMutation();
  const { data, isLoading } = useGetMutation(
    "supense-summary-view",
    SUSPENSE_SUMMARY_VIEW
  );
  const donorsummary = data?.data || [];

  const handlePrintPdf = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Suspense_Summary_Report",
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
    if (!donorsummary.length) return toast.warning("No data to generate PDF.");

    const input = componentRef.current;
    if (!input) return toast.warning("No data available for PDF.");

    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const ratio = Math.min(
        pdfWidth / canvas.width,
        pdfHeight / canvas.height
      );

      pdf.addImage(
        imgData,
        "PNG",
        10,
        10,
        canvas.width * ratio,
        canvas.height * ratio
      );
      pdf.save("Suspense_Summary.pdf");
    });
  };

  const handleDownload = async () => {
    if (!donorsummary.length) return toast.warning("No data to download.");

    try {
      const res = await trigger({
        url: SUSPENSE_SUMMARY_DOWNLOAD,
        method: "post",
        responseType: "blob",
      });

      if (!res) return toast.warning("No data available for download.");

      const blob = new Blob([res], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "suspense_summary.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("Suspense Summary downloaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to download Suspense Summary.");
    }
  };
  if (isLoading) {
    return <SuspenseLoading />;
  }
  return (
    <div className="p-6 bg-white shadow rounded-md">
      <>
        <div className="flex justify-end gap-2 z-50">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handlePrintPdf}
                  variant="ghost"
                  size="icon"
                  className="border hover:shadow-md"
                >
                  <Printer className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Print PDF</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleSavePDF}
                  variant="ghost"
                  size="icon"
                  className="border hover:shadow-md"
                >
                  <Download className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Download PDF</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleDownload}
                  variant="ghost"
                  size="icon"
                  className="border hover:shadow-md"
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

        <div ref={componentRef} className="overflow-x-auto">
          <ReportHeader title="SUSPENSE SUMMARY" />
          <table className="min-w-full border-collapse border border-black">
            <thead>
              <tr className="bg-gray-200">
                {["CHAPTER", "YEAR", "TOTAL"].map((header) => (
                  <th
                    key={header}
                    className="border border-black px-4 py-2 text-center"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.isArray(donorsummary) && donorsummary.length > 0 ? (
                donorsummary.map((item, idx) => (
                  <tr key={idx}>
                    <td className="border border-black px-4 py-2 text-center">
                      {item.chapter_name}
                    </td>
                    <td className="border border-black px-4 py-2 text-center">
                      {item.receipt_financial_year}
                    </td>
                    <td className="border border-black px-4 py-2 text-center">
                      {item.receipt_total_count}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    className="border border-black px-4 py-3 text-center text-gray-500 text-sm"
                  >
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </>
    </div>
  );
};

export default SuspenseSummary;
