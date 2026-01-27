import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
const TeamLoading = () => {
  return (
    <>
      <Card className="bg-white shadow-md border text-[var(--label-color)] rounded-md">
        <CardContent className="p-6">
          <form id="dowRecp" className="space-y-6" autoComplete="off">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:flex lg:flex-row lg:items-end lg:gap-6 gap-6 flex-wrap">
              <div className="flex flex-col min-w-[220px] mt-2">
                <Skeleton className="h-4 w-32 mb-2" /> 
                <div className="flex gap-2 text-sm mt-1">
                  <Skeleton className="h-6 w-12 rounded-md" /> 
                  <Skeleton className="h-6 w-16 rounded-md" /> 
                  <Skeleton className="h-6 w-10 rounded-md" />
                  <Skeleton className="h-6 w-16 rounded-md" /> 
                </div>
              </div>

              <div className="flex-1 min-w-[220px]">
                <Skeleton className="h-4 w-40 mb-2" /> 
                <Skeleton className="h-10 w-full rounded-md" /> 
              </div>

              <div className="flex-1">
                <Skeleton className="h-4 w-40 mb-2" />
                <Skeleton className="h-10 w-full rounded-md" /> 
              </div>

              <div className="flex-1">
                <Skeleton className="h-4 w-44 mb-2" /> 
                <Skeleton className="h-10 w-full rounded-md" />
              </div>

              <div className="flex items-end gap-4 mt-2">
                <Skeleton className="h-10 w-24 rounded-md" />
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    
    </>
  );
};

export default TeamLoading;
