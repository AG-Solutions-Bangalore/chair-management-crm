import {
  DONOR_SUMMARY_DOWNLOAD,
  DONOR_SUMMARY_FETCH_DONOR,
  DONOR_SUMMARY_GROUP_DOWNLOAD,
} from "@/api";
import { MemoizedSelect } from "@/components/common/memoized-select";
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
import DonorGroupView from "./donor-group-view";
import DonorIndividualView from "./donor-individual-view";
import DonorLoading from "./loading";
const Donor = () => {
  const today = moment().format("YYYY-MM-DD");
  const firstOfMonth = moment().startOf("month").format("YYYY-MM-DD");
  const [viewType, setViewType] = useState(null);
  const [donorSummary, setDonorSummary] = useState({
    indicomp_full_name: "",
    receipt_from_date: firstOfMonth,
    receipt_to_date: today,
  });

  const { trigger, loading } = useApiMutation();
  const componentRef = useRef();

  const handleInputChange = (e, field) => {
    const value = e.target ? e.target.value : e;
    setDonorSummary({ ...donorSummary, [field]: value });
  };

  const { data: donorsData, isLoading } = useGetMutation(
    "donors",
    DONOR_SUMMARY_FETCH_DONOR
  );

  const handleIndividualViewClick = (e) => {
    e.preventDefault();
    if (!donorSummary.indicomp_full_name) {
      toast.warning("Please select a donor.");
      return;
    }
    if (donorSummary.indicomp_full_name) {
      setViewType("individual");
    }
  };

  const handleGroupViewClick = (e) => {
    e.preventDefault();
    if (!donorSummary.indicomp_full_name) {
      toast.warning("Please select a donor.");
      return;
    }
    if (donorSummary.indicomp_full_name) {
      setViewType("group");
    }
  };

  const handlePrintPdf = useReactToPrint({
    content: () => {
      if (!donorSummary.indicomp_full_name || !viewType) {
        toast.warning("Please select a donor and view type before printing!");
        return null;
      }
      return componentRef.current;
    },
    documentTitle:
      viewType === "group" ? "Donor_Group_Report" : "Donor_Individual_Report",
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
    if (!donorSummary.indicomp_full_name || !viewType) {
      toast.warning("Please select a donor and view type before saving PDF.");
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

    if (!donorSummary.indicomp_full_name || !viewType) {
      toast.warning("Please select a donor and view type before downloading.");
      return;
    }

    try {
      const payload = {
        indicomp_fts_id: donorSummary.indicomp_full_name,
        receipt_from_date: donorSummary.receipt_from_date,
        receipt_to_date: donorSummary.receipt_to_date,
      };

      const url =
        viewType === "group"
          ? DONOR_SUMMARY_GROUP_DOWNLOAD
          : DONOR_SUMMARY_DOWNLOAD;

      const res = await trigger({
        url,
        method: "post",
        data: payload,
        responseType: "blob",
      });

      if (!res) {
        toast.warning("No data found for the selected donor.");
        return;
      }

      const blob = new Blob([res], { type: "text/csv" });
      const urlObj = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = urlObj;
      link.setAttribute(
        "download",
        viewType === "group"
          ? "donor_group_summary.csv"
          : "donor_individual_summary.csv"
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("Error downloading donor summary:", err);
    }
  };
  if (isLoading) {
    return <DonorLoading />;
  }
  return (
    <>
      <Card className="bg-white shadow-md border text-[var(--label-color) rounded-md">
        <CardContent className="p-6">
          <form id="dowRecp" className="space-y-6" autoComplete="off">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:flex lg:flex-row lg:items-end lg:gap-6 gap-6">
              <div className="flex-1 min-w-[220px]">
                <Label className="font-medium" htmlFor="indicomp_full_name">
                  Donor Name <span className="text-red-500">*</span>
                </Label>
                <MemoizedSelect
                  name="indicomp_full_name"
                  value={donorSummary?.indicomp_full_name}
                  onChange={(e) => handleInputChange(e, "indicomp_full_name")}
                  options={
                    donorsData?.data?.map((item) => ({
                      label: item.indicomp_full_name,
                      value: item.indicomp_fts_id,
                    })) || []
                  }
                  placeholder="Select Donor Name"
                />
              </div>

              {/* From Date */}
              <div>
                <Label className="font-medium" htmlFor="receipt_from_date">
                  From Date
                </Label>
                <Input
                  type="date"
                  name="receipt_from_date"
                  value={donorSummary.receipt_from_date}
                  onChange={(e) => handleInputChange(e, "receipt_from_date")}
                  required
                />
              </div>

              <div>
                <Label className="font-medium" htmlFor="receipt_to_date">
                  To Date
                </Label>
                <Input
                  type="date"
                  id="receipt_to_date"
                  name="receipt_to_date"
                  value={donorSummary.receipt_to_date}
                  onChange={(e) => handleInputChange(e, "receipt_to_date")}
                  required
                />
              </div>

              <div className="flex gap-4">
                <Button
                  className="text-white"
                  onClick={handleIndividualViewClick}
                >
                  Individual View
                </Button>
                <Button className="text-white" onClick={handleGroupViewClick}>
                  Group View
                </Button>
              </div>

              <div className="flex gap-4">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handlePrintPdf}
                        type="button"
                        className="transition-all duration-300 hover:scale-110 border border-[var(--color-border)] hover:shadow-md"
                      >
                        <Printer className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Print Receipt</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                {/* PDF */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        type="button"
                        onClick={handleSavePDF}
                        className="transition-all duration-300 hover:scale-110 border border-[var(--color-border)] hover:shadow-md"
                      >
                        <Download className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Download PDF</TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                {/* Excel */}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleDownload}
                        type="button"
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

      {viewType == "individual" && (
        <div className="mt-4">
          <DonorIndividualView
            receiptFromDate={donorSummary?.receipt_from_date}
            receiptToDate={donorSummary?.receipt_to_date}
            indicompFullName={donorSummary?.indicomp_full_name}
            componentRef={componentRef}
          />
        </div>
      )}
      {viewType == "group" && (
        <div className="mt-4">
          <DonorGroupView
            receiptFromDate={donorSummary?.receipt_from_date}
            receiptToDate={donorSummary?.receipt_to_date}
            indicompFullName={donorSummary?.indicomp_full_name}
            componentRef={componentRef}
          />
        </div>
      )}
    </>
  );
};

export default Donor;
