import { FOLLOWUP_GET_DATA } from "@/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";
import {
  Download,
  FileText,
  History,
  Mail,
  Phone,
  PlusCircle,
  Printer
} from "lucide-react";
import moment from "moment";
import { useState } from "react";

const TimelineReceipt = ({ donorId }) => {
  const [isFollowUpOpen, setIsFollowUpOpen] = useState(false);
  const token = Cookies.get("token");

  const {
    data: followupData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["followup-data", donorId],
    queryFn: async () => {
      const response = await axios.get(`${FOLLOWUP_GET_DATA}/${donorId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      return response.data.data.reverse();
    },
    enabled: !!donorId,
    retry: 2,
  });

  const mapApiDataToUiFormat = (apiData) => {
    if (!apiData) return [];

    return apiData.map((item, index) => {
      let type = "general";
      let icon = FileText;
      let color = "bg-gray-500";

      if (item.followup_heading?.toLowerCase().includes("email")) {
        type = "email";
        icon = Mail;
        color = "bg-blue-500";
      } else if (
        item.followup_heading?.toLowerCase().includes("receipt created")
      ) {
        type = "creation";
        icon = PlusCircle;
        color = "bg-green-500";
      } else if (item.followup_heading?.toLowerCase().includes("download")) {
        type = "download";
        icon = Download;
        color = "bg-purple-500";
      } else if (item.followup_heading?.toLowerCase().includes("print")) {
        type = "print";
        icon = Printer;
        color = "bg-orange-500";
      } else if (item.followup_heading?.toLowerCase().includes("call")) {
        type = "call";
        icon = Phone;
        color = "bg-indigo-500";
      }

      const formatTime = (timeString) => {
        if (!timeString) return "";
        const [hours, minutes] = timeString.split(":");
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? "PM" : "AM";
        const formattedHour = hour % 12 || 12;
        return `${formattedHour}:${minutes} ${ampm}`;
      };

      return {
        id: item.id,
        action: item.followup_heading,
        date: item.followup_date,
        time: formatTime(item.followup_time),
        description: item.followup_description,
        type: type,
        status: item.followup_status?.toLowerCase(),
        user: item.created_by || "System",
        followTime: item.followup_time,
        followDate: item.followup_date,
        icon: icon,
        color: color,
        textColor: `text-${color.replace("bg-", "")}-700`,
        bgColor: `bg-${color.replace("bg-", "")}-50`,
      };
    });
  };

  const followUpData = mapApiDataToUiFormat(followupData) || [];

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: {
        variant: "default",
        className: "bg-green-100 text-green-800 border-green-200",
      },
      sent: {
        variant: "secondary",
        className: "bg-blue-100 text-blue-800 border-blue-200",
      },
      delivered: {
        variant: "outline",
        className: "bg-teal-100 text-teal-800 border-teal-200",
      },
      viewed: {
        variant: "default",
        className: "bg-purple-100 text-purple-800 border-purple-200",
      },
      pending: {
        variant: "outline",
        className: "bg-yellow-100 text-yellow-800 border-yellow-200",
      },
    };

    const config = statusConfig[status] || {
      variant: "outline",
      className: "bg-gray-100 text-gray-800 border-gray-200",
    };

    return (
      <Badge
        variant={config.variant}
        className={`text-xs h-4 px-1.5 ${config.className}`}
      >
        {status?.charAt(0).toUpperCase() + status?.slice(1) || "Unknown"}
      </Badge>
    );
  };

  const groupEventsByDate = () => {
    const grouped = {};
    followUpData.forEach((event) => {
      if (!grouped[event.date]) {
        grouped[event.date] = [];
      }
      grouped[event.date].push(event);
    });
    return grouped;
  };

  const groupedEvents = groupEventsByDate();

  const renderSkeleton = () => {
    return Array.from({ length: 5 }).map((_, index) => (
      <div key={index} className="flex gap-3 p-2">
        <Skeleton className="w-7 h-7 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-12" />
          </div>
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-3/4" />
          <div className="flex gap-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </div>
    ));
  };

  return (
    <Sheet open={isFollowUpOpen} onOpenChange={setIsFollowUpOpen}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-md transition-all duration-300 hover:scale-110 border border-[var(--color-border)] hover:shadow-md relative"
                disabled={!donorId}
              >
                <History className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center border-2 border-white">
                  {followupData?.length || 0}
                </span>
              </Button>
            </SheetTrigger>
          </TooltipTrigger>
          <TooltipContent>View Receipt Timeline</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <SheetContent className="sm:max-w-lg">
        <SheetHeader className="border-b pb-3 mb-4">
          <SheetTitle className="flex items-center gap-2 text-lg">
            <History className="h-5 w-5 text-blue-600" />
            Receipt Timeline
          </SheetTitle>
          <div className="flex gap-2 mt-1">
            <Badge variant="outline" className="text-xs bg-blue-50">
              Total: {followUpData.length} events
            </Badge>
            {followUpData.length > 0 && (
              <Badge variant="outline" className="text-xs bg-green-50">
                Last:{" "}
                {followUpData[0]?.date
                  ? moment(followUpData[0].date).format("DD-MM-YYYY")
                  : "N/A"}
              </Badge>
            )}
          </div>
        </SheetHeader>

        {/* <ScrollArea className="h-[calc(100vh-14rem)]">
          <div className="space-y-4 pr-4">
            {isLoading ? (
              renderSkeleton()
            ) : error ? (
              <div className="text-center py-8 text-red-600">
                Error loading timeline data
              </div>
            ) : followUpData.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No timeline events found
              </div>
            ) : (
              Object.entries(groupedEvents).map(([date, events]) => (
                <div key={date} className="space-y-2">
           
                  <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span className="font-semibold text-sm text-gray-800">
                      {new Date(date).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                    <span className="text-xs text-blue-600 font-medium">
                      ({new Date(date).toLocaleDateString('en-US', { weekday: 'short' })})
                    </span>
                    <div className="flex-1" />
                    <Badge variant="secondary" className="bg-white text-blue-800 border-blue-200 text-xs h-5">
                      {events.length} {events.length === 1 ? 'event' : 'events'}
                    </Badge>
                  </div>

       
                  <div className="space-y-2 ml-1">
                    {events.map((item, index) => {
                      const IconComponent = item.icon;
                      return (
                        <div key={item.id} className="flex gap-3 group hover:bg-gray-50 rounded-lg p-2 transition-all duration-200 border border-transparent hover:border-gray-200">
               
                          <div className="flex flex-col items-center pt-0.5">
                            <div className={`w-7 h-7 rounded-full ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-sm border-2 border-white`}>
                              <IconComponent className="h-3.5 w-3.5 text-white" />
                            </div>
                            {index !== events.length - 1 && (
                              <div className="w-0.5 h-full bg-gradient-to-b from-gray-200 to-gray-100 mt-1" />
                            )}
                          </div>
                          
                    
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-1 gap-2">
                              <div className="flex items-center gap-2 flex-wrap min-w-0">
                                <h4 className="font-semibold text-sm text-gray-900 truncate">{item.action}</h4>
                                {getStatusBadge(item.status)}
                              </div>
                              <span className="text-xs text-gray-500 whitespace-nowrap shrink-0">
                                {item.time}
                              </span>
                            </div>
                            
                            <p className="text-xs text-gray-600 mb-1.5 line-clamp-2 leading-relaxed">{item.description}</p>
                            
                            <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
                              <div className="flex items-center gap-1 bg-gray-100 px-1.5 py-0.5 rounded">
                                <User className="h-3 w-3" />
                                <span className="truncate max-w-[80px]">{item.user}</span>
                              </div>
                              <div className="flex items-center gap-1 bg-gray-100 px-1.5 py-0.5 rounded">
                                <span className="text-xs">⏱️ {item.duration}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea> */}

        {/* 📧 Email sent on 10:45 AM by John Doe
(with status badge + duration) */}

        <ScrollArea className="h-[calc(100vh-14rem)]">
          <div className="space-y-3 pr-4">
            {isLoading ? (
              renderSkeleton()
            ) : error ? (
              <div className="text-center py-8 text-red-600">
                Error loading timeline data
              </div>
            ) : followUpData.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No timeline events found
              </div>
            ) : (
              followUpData.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={item.id}
                    className="flex gap-3 group hover:bg-gray-50 rounded-lg p-2 transition-all duration-200 border border-transparent hover:border-gray-200"
                  >
                    <div className="flex flex-col items-center pt-0.5">
                      <div
                        className={`w-7 h-7 rounded-full ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shadow-sm border-2 border-white`}
                      >
                        <IconComponent className="h-3.5 w-3.5 text-white" />
                      </div>
                      {index !== followUpData.length - 1 && (
                        <div className="w-0.5 h-full bg-gradient-to-b from-blue-800 to-gray-100 mt-1" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* <div className="flex justify-between items-start mb-1 gap-2">
                <div className="flex items-center gap-2 flex-wrap min-w-0">
                  <h4 className="font-semibold text-sm text-gray-900 truncate">
                    {item.action}
                  </h4>
                  {getStatusBadge(item.status)}
                </div>
                <span className="text-xs text-gray-500 whitespace-nowrap shrink-0">
                  {item.time}
                </span>
              </div> */}

                      <p className="text-sm font-medium  mb-1.5 leading-relaxed">
                        {item.action} on {item.time} by{" "}
                        <span className="font-medium text-gray-800">
                          {item.user}
                        </span>{" "}
                        {getStatusBadge(item.status)}
                      </p>

                      <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
                        {/* <div className="flex items-center gap-1 bg-gray-100 px-1.5 py-0.5 rounded">
                  <User className="h-3 w-3" />
                  <span className="truncate max-w-[80px]">{item.user}</span>
                </div> */}
                        <div className="flex items-center gap-1 bg-gray-100 px-1.5 py-0.5 rounded">
                          <span className="text-xs">
                            ⏱️ {moment(item.followDate).format("MMM DD, YYYY")}{" "}
                            ,
                            {moment(item.followTime, "HH:mm:ss").format(
                              "h:mm A"
                            )}{" "}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>

        {!isLoading && !error && followUpData.length > 0 && (
          <div className="pt-3 mt-4 ">
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="bg-blue-50 p-2 rounded">
                <div className="text-sm font-bold text-blue-600">
                  {followUpData.filter((item) => item.type === "email").length}
                </div>
                <div className="text-xs text-blue-700 font-medium">Emails</div>
              </div>
              <div className="bg-purple-50 p-2 rounded">
                <div className="text-sm font-bold text-purple-600">
                  {
                    followUpData.filter((item) => item.type === "download")
                      .length
                  }
                </div>
                <div className="text-xs text-purple-700 font-medium">
                  Downloads
                </div>
              </div>
              <div className="bg-orange-50 p-2 rounded">
                <div className="text-sm font-bold text-orange-600">
                  {followUpData.filter((item) => item.type === "print").length}
                </div>
                <div className="text-xs text-orange-700 font-medium">
                  Prints
                </div>
              </div>
              <div className="bg-green-50 p-2 rounded">
                <div className="text-sm font-bold text-green-600">
                  {
                    followUpData.filter((item) => item.type === "creation")
                      .length
                  }
                </div>
                <div className="text-xs text-green-700 font-medium">
                  Created
                </div>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default TimelineReceipt;
