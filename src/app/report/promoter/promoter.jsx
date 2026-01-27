import { PROMOTER_SUMMARY_DOWNLOAD, PROMOTER_SUMMARY_DROPDOWN } from "@/api";
import { MemoizedProductSelect } from "@/components/common/memoized-product-select";
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
import { useGetMutation } from "@/hooks/use-get-mutation";
import { useApiMutation } from "@/hooks/use-mutation";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Download, FileType, Loader, Printer } from "lucide-react";
import moment from "moment";
import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { toast } from "sonner";
import PromoterLoading from "./loading";
import PromoterView from "./promoter-view";
const Promoter = () => {
  const [childLoading, setChildLoading] = useState(false);

  const todayback = moment().format("YYYY-MM-DD");
  const firstdate = moment().startOf("month").format("YYYY-MM-DD");
  const [viewType, setViewType] = useState(false);
  const [downloadDonor, setDonorDownload] = useState({
    receipt_from_date: firstdate,
    receipt_to_date: todayback,
    indicomp_promoter: "",
  });
  const componentRef = useRef();
  const { trigger, loading } = useApiMutation();
  const { data: PromoterData, isLoading } = useGetMutation(
    "promter-summary-dropdown",
    PROMOTER_SUMMARY_DROPDOWN
  );
  const handleInputChange = (e, field) => {
    const value = e.target ? e.target.value : e;

    setDonorDownload({ ...downloadDonor, [field]: value });
    if (downloadDonor.indicomp_promoter) {
      setViewType(true);
    }
  };
  const handleClick = (e) => {
    e.preventDefault();
    if (!downloadDonor.indicomp_promoter) {
      toast.warning("Please select a promoter.");
      return;
    }
    if (downloadDonor.indicomp_promoter) {
      setViewType(true);
    }
  };

  const handlePrintPdf = useReactToPrint({
    content: () => {
      if (!downloadDonor.indicomp_promoter || !viewType) {
        toast.warning(
          "Please select a promoter and view type before printing!"
        );
        return null;
      }
      return componentRef.current;
    },
    documentTitle: viewType === "Promoter_Report",
    pageStyle: `
    @page { size: A4 portrait; margin: 5mm; }
    @media print {
      body { font-size: 10px; margin: 0; padding: 0; }
      table { font-size: 11px; }
      .print-hide { display: none; }
    }
  `,
  });

  const handleSavePDF = (e) => {
    e.preventDefault();
    if (!downloadDonor.indicomp_promoter || !viewType) {
      toast.warning(
        "Please select a promoter and view type before saving PDF."
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

    if (!downloadDonor.indicomp_promoter) {
      toast.warning("Please select a promoter before downloading.");
      return;
    }

    try {
      const payload = {
        indicomp_promoter: downloadDonor.indicomp_promoter,
        receipt_from_date: downloadDonor.receipt_from_date,
        receipt_to_date: downloadDonor.receipt_to_date,
      };

      const res = await trigger({
        url: PROMOTER_SUMMARY_DOWNLOAD,
        method: "post",
        data: payload,
        responseType: "blob",
      });

      if (!res) {
        toast.warning("No data found for the selected promoter.");
        return;
      }

      const blob = new Blob([res], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "promoter_summary.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("Promoter Summary Downloaded Successfully!");
    } catch (err) {
      console.error("Error downloading promoter summary:", err);
      toast.error("Promoter Summary could not be downloaded.");
    }
  };
  if (isLoading) {
    return <PromoterLoading />;
  }
  return (
    <>
      <Card className="bg-white shadow-md border text-[var(--label-color) rounded-md">
        <CardContent className="p-6">
          <form id="dowRecp" autoComplete="off" className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div>
                <Label className="font-medium" htmlFor="indicomp_promoter">
                  Promoter <span className="text-red-500">*</span>
                </Label>

                <MemoizedProductSelect
                  name="indicomp_promoter"
                  value={downloadDonor?.indicomp_promoter}
                  onChange={(e) => handleInputChange(e, "indicomp_promoter")}
                  options={
                    PromoterData?.data?.map((item) => ({
                      label: item.indicomp_full_name,
                      value: item.indicomp_fts_id,
                    })) || []
                  }
                  placeholder="Select Promoter"
                />
              </div>

              {/* From Date */}
              <div>
                <Label htmlFor="receipt_from_date">From Date</Label>
                <Input
                  id="receipt_from_date"
                  name="receipt_from_date"
                  type="date"
                  value={downloadDonor.receipt_from_date}
                  onChange={(e) => handleInputChange(e, "receipt_from_date")}
                />
              </div>

              {/* To Date */}
              <div>
                <Label htmlFor="receipt_to_date">To Date</Label>
                <Input
                  id="receipt_to_date"
                  name="receipt_to_date"
                  type="date"
                  value={downloadDonor.receipt_to_date}
                  onChange={(e) => handleInputChange(e, "receipt_to_date")}
                  required
                />
              </div>

              <div className="flex gap-4 pt-6">
                <Button onClick={handleClick}>
                  {childLoading ? "Loading" : "View"}
                </Button>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        type="button"
                        onClick={handlePrintPdf}
                        className="transition-all duration-300 hover:scale-110 border border-[var(--color-border)] hover:shadow-md"
                      >
                        <Printer className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Print Receipt</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        type="button"
                        onClick={handleSavePDF}
                        className=" transition-all duration-300 hover:scale-110 border border-[var(--color-border)] hover:shadow-md"
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
                        variant="ghost"
                        size="icon"
                        type="button"
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
          <PromoterView
            receiptFromDate={downloadDonor?.receipt_from_date}
            receiptToDate={downloadDonor?.receipt_to_date}
            indicompFullName={downloadDonor?.indicomp_promoter}
            componentRef={componentRef}
            onLoadingChange={setChildLoading}
          />
        </div>
      )}
    </>
  );
};

export default Promoter;
