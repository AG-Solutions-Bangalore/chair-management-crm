import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useGetMutation } from "@/hooks/use-get-mutation";
import { useApiMutation } from "@/hooks/use-mutation";
import { decryptId } from "@/utils/encyrption/encyrption";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  Download,
  Loader,
  Loader2,
  Mail,
  MailPlus,
  Printer,
} from "lucide-react";
import moment from "moment";
import { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { toast } from "sonner";
import {
  SCHOOL_ALLOT_LETTER,
  SEND_LETTER_EMAIL,
  UPDATE_EMAIL,
} from "../../../api";
import mailSentGif from "../../../assets/mail-sent.gif";
import AllotmentPrintLetter from "./allotment-print-letter";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const SchoolAllotLetter = () => {
  const componentRef = useRef();
  const { id } = useParams();
  const donorId = decryptId(id);
  const [isProcessing, setIsProcessing] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [donoremail, setDonorEmail] = useState("");
  const [isProcessingPdf, setIsProcessingPdf] = useState(false);
  const today = moment().format("DD/MM/YYYY");
  const { trigger: Mailtrigger, loading: mailloading } = useApiMutation();
  const { trigger: UpdateMail, loading: updatemail } = useApiMutation();

  const {
    data: schoolLetter,
    isLoading,
    isError,
    refetch,
  } = useGetMutation(
    `schoolletter-${donorId}`,
    `${SCHOOL_ALLOT_LETTER}/${donorId}`
  );

  const handlePrintPdf = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Allotment_Letter",
    pageStyle: `
      @page {
        size: A4 portrait;
        margin: 5mm 0mm;  /* top-bottom 15mm, left-right 10mm */
      }
      @media print {
        body {
          font-size: 11px;
          margin: 0 !important;
          padding: 0 !important;
        }
        .print-container {
          padding: 10mm 8mm; /* extra breathing space inside */
        }
        table {
          font-size: 10px;
        }
        .print-hide {
          display: none;
        }
      }
    `,
    onBeforeGetContent: () => setIsProcessing(true),
    onAfterPrint: () => setIsProcessing(false),
    onPrintError: () => setIsProcessing(false),
  });

  const handleSavePDF = () => {
    setIsProcessingPdf(true);

    const input = componentRef.current;
    html2canvas(input, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      scrollX: 0,
      scrollY: -window.scrollY,
      height: input.scrollHeight,
    })
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");

        const pdfWidth = 210;
        const pdfHeight = 297;

        const imgWidth = pdfWidth - 20;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight, "", "FAST");

        if (imgHeight > pdfHeight) {
          const totalPages = Math.ceil(imgHeight / pdfHeight);
          for (let page = 1; page < totalPages; page++) {
            pdf.addPage();
            pdf.addImage(
              imgData,
              "PNG",
              10,
              -page * pdfHeight + 10,
              imgWidth,
              imgHeight,
              "",
              "FAST"
            );
          }
        }

        pdf.save("Allotment-letter.pdf");
      })
      .catch((error) => {
        console.error("Error generating PDF:", error);
      })
      .finally(() => {
        setIsProcessingPdf(false);
      });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  if (isError) {
    return (
      <div className="w-full p-4  ">
        <div className="flex items-center justify-center h-64 ">
          <div className="text-center ">
            <div className="text-destructive font-medium mb-2">
              Error Fetching School Letter Data
            </div>
            <Button onClick={() => refetch()} variant="outline" size="sm">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }
  const SchoolAlotReceipt = schoolLetter?.data?.individualCompany || {};
  const SchoolAlotView = schoolLetter?.data?.SchoolAlotView || [];
  const OTSReceipts = schoolLetter?.data?.OTSReceipts || [];
  const handleClickOpen = (id) => {
    setSelectedId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setDonorEmail("");
    setSelectedId(null);
  };
  const onSubmitMail = async (e) => {
    e.preventDefault();
    if (!selectedId)
      return toast.error("Id is Missing, Please try again later");

    try {
      const res = await UpdateMail({
        url: `${UPDATE_EMAIL}/${selectedId}`,
        method: "patch",
        data: { indicomp_email: donoremail },
      });

      if (res?.code == 201) {
        toast.success(res.message);
        handleClose();
        refetch();
      } else {
        toast.error(res.message || "Unexpected error");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to update");
    }
  };
  const onSubmit = async ({ id }) => {
    if (!id) return toast.error("Id is Missing, Please try again later");

    try {
      const res = await Mailtrigger({
        url: `${SEND_LETTER_EMAIL}/${donorId}`,
      });

      if (res?.code == 201) {
        toast.success(res.message);
        refetch();
      } else {
        toast.error(res.message || "Unexpected error");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to update");
    }
  };
  return (
    <div className="invoice-wrapper overflow-x-auto grid md:grid-cols-1 1fr">
      <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-50">
        <Card className="p-3 shadow-2xl border border-white/30 backdrop-blur-lg bg-white/80 rounded-2xl hover:bg-white/90 transition-all duration-300">
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    className="border-2 hover:shadow-md"
                    onClick={handlePrintPdf}
                  >
                    {isProcessing ? (
                      <Loader className="h-5 w-5 animate-spin" />
                    ) : (
                      <Printer className="h-5 w-5" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Print Receipt</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            {SchoolAlotReceipt?.donor?.indicomp_email ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      type="button"
                      className="h-11 w-11 relative rounded-md transition-all duration-300 hover:scale-110 border  border-[var(--color-border)] hover:shadow-md"
                      onClick={() => onSubmit({ id: donorId })}
                    >
                      {SchoolAlotReceipt && (
                        <span className="absolute -top-2 -right-2 rounded-full bg-blue-500 text-white text-[12px] w-6 h-6 flex items-center justify-center border-2 border-white font-medium">
                          {SchoolAlotReceipt?.schoolalot_email_count || 0}
                        </span>
                      )}
                      {mailloading ? (
                        <img
                          src={mailSentGif}
                          alt="Sending..."
                          className="h-5 w-5"
                        />
                      ) : (
                        <Mail className="h-5 w-5" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Send Mail</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      handleClickOpen(SchoolAlotReceipt?.donor?.indicomp_fts_id)
                    }
                    className=" rounded-md transition-all duration-300 hover:scale-110 border border-[var(--color-border)]  hover:shadow-md"
                  >
                    <MailPlus className="h-5 w-5 text-red-500" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Add Mail</TooltipContent>
              </Tooltip>
            )}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
                    onClick={handleSavePDF}
                    className="border-2 hover:shadow-md"
                  >
                    {isProcessingPdf ? (
                      <Loader className="h-5 w-5 animate-spin" />
                    ) : (
                      <Download className="h-5 w-5" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Download PDF</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </Card>
      </div>
      <div className="flex flex-col items-center ">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 w-full">
          <div className="bg-white text-[12px] lg:col-span-3 shadow-md rounded-md p-6 border  transition-all hover:shadow-lg leading-relaxed">
            <div className="border-b flex justify-between  pb-2 mb-3">
              <p className="font-medium">
                Donor ID: <span>{SchoolAlotReceipt?.indicomp_fts_id}</span>
              </p>
              <p>
                Donor Name:{" "}
                <span className="font-medium">
                  {SchoolAlotReceipt?.donor?.indicomp_full_name}
                </span>
              </p>
              <p>
                No. of Schools:{" "}
                <span className="font-medium">
                  {OTSReceipts.map((o, i) => (
                    <span key={i}>{o.receipt_no_of_ots} </span>
                  ))}
                </span>
              </p>
            </div>

            <div className="my-5 overflow-x-auto mb-14">
              <table className="min-w-full border-collapse border border-gray-500">
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
                        className="border border-gray-500 px-1 py-1 text-center text-[10px]"
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
                        <td className="border border-gray-500  px-2 py-2 text-xs">
                          {dataSumm.school_state}
                        </td>
                        <td className="border border-gray-500  px-2 py-2 text-xs">
                          {dataSumm.achal}
                        </td>
                        <td className="border border-gray-500  px-2 py-2 text-xs">
                          {dataSumm.cluster}
                        </td>
                        <td className="border border-gray-500  px-2 py-2 text-xs">
                          {dataSumm.sub_cluster}
                        </td>
                        <td className="border border-gray-500  px-2 py-2 text-xs">
                          {dataSumm.village}
                        </td>
                        <td className="border border-gray-500  px-2 py-2 text-xs">
                          {dataSumm.teacher}
                        </td>
                        <td className="border border-gray-500  px-2 py-2 text-xs">
                          {dataSumm.boys}
                        </td>
                        <td className="border border-gray-500  px-2 py-2 text-xs">
                          {dataSumm.girls}
                        </td>
                        <td className="border border-gray-500  px-2 py-2 text-xs">
                          {dataSumm.total}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="bg-white text-sm lg:col-span-2  text-[#464D69] font-serif  shadow-md rounded-md p-6 border  transition-all hover:shadow-lg leading-relaxed">
            <p className="font-medium">Date: {today}</p>
            <p>To,</p>

            {Object.keys(SchoolAlotReceipt).length !== 0 && (
              <div className="mt-1">
                <p>
                  {SchoolAlotReceipt?.donor?.title}{" "}
                  {SchoolAlotReceipt?.donor?.indicomp_full_name}
                </p>
                <p>{SchoolAlotReceipt?.donor?.indicomp_res_reg_address}</p>
                <p>{SchoolAlotReceipt?.donor?.indicomp_res_reg_city}</p>
                <p>
                  {SchoolAlotReceipt?.donor?.indicomp_res_reg_state} -{" "}
                  {SchoolAlotReceipt?.donor?.indicomp_res_reg_pin_code}
                </p>
              </div>
            )}

            <p className="mt-1">
              {SchoolAlotReceipt?.donor?.indicomp_gender === "Female"
                ? "Respected Madam,"
                : "Respected Sir,"}
            </p>

            <p className="mt-2 text-justify">
              <p>
                “Giving is not just about making donation, it’s about making a
                difference.”
              </p>{" "}
              We are able to bring about this difference only because of the
              support of our kind donors. Your support to FTS gives wings to the
              dreams of the little children studying in Ekal Vidyalaya. We
              express our sincere thanks and gratitude to you for adopting One
              Teacher School (OTS) and helping us in providing light of
              education to the weaker sections of society.
            </p>

            <p className="mt-1 text-justify">
              Please find enclosed the details of the Ekal Vidyalaya running
              with your assistance. You may also view the details through our
              website www.ekal.org. Click on INSIGHTSand enter your user ID{" "}
              <p>{SchoolAlotReceipt?.donor?.indicomp_fts_code || ""}</p> and
              password{" "}
              <p>{SchoolAlotReceipt?.donor?.indicomp_password || ""}</p>
            </p>

            <p className="mt-2">
              We hope to get your continued patronage for serving the society.
            </p>
          </div>
        </div>
      </div>
      <div
        className="flex flex-col items-center"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: -10,
        }}
      >
        <AllotmentPrintLetter
          SchoolAlotView={SchoolAlotView}
          OTSReceipts={OTSReceipts}
          SchoolAlotReceipt={SchoolAlotReceipt}
          componentRef={componentRef}
        />
      </div>
      {/* Email Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Donor Email</DialogTitle>
          </DialogHeader>
          <form onSubmit={onSubmitMail} autoComplete="off">
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="donoremail">Email *</Label>
                <Input
                  type="email"
                  id="donoremail"
                  name="donoremail"
                  value={donoremail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                  required
                  placeholder="Enter donor email"
                />
              </div>
              <div className="flex justify-center">
                <Button type="submit" disabled={updatemail}>
                  {updatemail ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </CardContent>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SchoolAllotLetter;
