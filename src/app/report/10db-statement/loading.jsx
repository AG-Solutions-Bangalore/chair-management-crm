import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const DbStatementLoading = () => {
  return (
    <Card className="mt-4 animate-pulse">
      <CardContent className="p-6">
        <form className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 items-end w-full">
            {/* From Date */}
            <div className="flex flex-col space-y-2 min-w-0">
              <Skeleton className="h-4 w-24 rounded" /> {/* Label */}
              <Skeleton className="h-10 w-full rounded" /> {/* Input */}
            </div>

            {/* To Date */}
            <div className="flex flex-col space-y-2 min-w-0">
              <Skeleton className="h-4 w-24 rounded" /> {/* Label */}
              <Skeleton className="h-10 w-full rounded" /> {/* Input */}
            </div>

            {/* View Buttons */}
            <div className="flex flex-wrap gap-2 md:col-span-4 min-w-0">
              <Skeleton className="h-10 w-14 rounded" /> {/* View Button */}
              <Skeleton className="h-10 w-32 rounded" /> {/* No Pan View */}
              <Skeleton className="h-10 w-24 rounded" /> {/* Group View */}

              <div className="flex gap-2 justify-start flex-wrap md:col-span-2">
                {/* Print */}
                <Skeleton className="h-10 w-10 rounded-md" />
                {/* Download PDF */}
                <Skeleton className="h-10 w-10 rounded-md" />
                {/* Download Report */}
                <Skeleton className="h-10 w-10 rounded-md" />
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default DbStatementLoading;
