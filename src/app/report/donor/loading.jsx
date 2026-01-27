import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function DonorLoading() {
  return (
    <Card className="bg-white shadow-md border text-[var(--label-color)] rounded-md">
      <CardContent className="p-6">
        <form className="space-y-6" autoComplete="off">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:flex lg:flex-row lg:items-end lg:gap-6 gap-6">
            {/* Donor Name */}
            <div className="flex-1 min-w-[220px] space-y-2">
              <Skeleton className="h-4 w-24" /> {/* Label */}
              <Skeleton className="h-10 w-full rounded-md" /> {/* Select */}
            </div>

            {/* From Date */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" /> {/* Label */}
              <Skeleton className="h-10 w-40 rounded-md" /> {/* Input */}
            </div>

            {/* To Date */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" /> {/* Label */}
              <Skeleton className="h-10 w-40 rounded-md" /> {/* Input */}
            </div>

            {/* View Buttons */}
            <div className="flex gap-4">
              <Skeleton className="h-10 w-28 rounded-md" />
              <Skeleton className="h-10 w-28 rounded-md" />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Skeleton className="h-10 w-10 rounded-md" />
              <Skeleton className="h-10 w-10 rounded-md" />
              <Skeleton className="h-10 w-10 rounded-md" />
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
