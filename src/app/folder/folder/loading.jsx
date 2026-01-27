import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const LoadingFolderCard = ({ index }) => {
  return (
    <div
      key={index}
      className="flex justify-between items-center border rounded-lg p-3 shadow-sm"
    >
      <div className="flex items-center gap-2">
        <Skeleton className="w-6 h-6 rounded" />{" "}
        <Skeleton className="h-4 w-[100px] rounded" />{" "}
      </div>
      <Skeleton className="w-4 h-4 rounded" />{" "}
    </div>
  );
};

export default LoadingFolderCard;
