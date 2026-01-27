import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const PromoterLoading = () => {
  return (
    <Card className="bg-white shadow-md border text-[var(--label-color)] rounded-md">
      <CardContent className="p-6">
        <form className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            
            {/* Notice Title */}
            <div className="flex flex-col space-y-2">
              <Skeleton className="h-4 w-24" /> {/* Label */}
              <Skeleton className="h-10 w-full rounded-md" /> {/* Select */}
            </div>

            {/* From Date */}
            <div className="flex flex-col space-y-2">
              <Skeleton className="h-4 w-20" /> {/* Label */}
              <Skeleton className="h-10 w-full rounded-md" /> {/* Input */}
            </div>

            {/* To Date */}
            <div className="flex flex-col space-y-2">
              <Skeleton className="h-4 w-20" /> {/* Label */}
              <Skeleton className="h-10 w-full rounded-md" /> {/* Input */}
            </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-6">
              <Skeleton className="h-10 w-14 rounded-md" /> {/* View */}
              <Skeleton className="h-10 w-10 rounded-md" /> {/* Print */}
              <Skeleton className="h-10 w-10 rounded-md" /> {/* PDF */}
              <Skeleton className="h-10 w-10 rounded-md" /> {/* Excel */}
            </div>

          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PromoterLoading;
