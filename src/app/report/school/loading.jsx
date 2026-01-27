import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const SchoolLoading = () => {
  return (
    <Card className="mt-4">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-end">
            {/* From Date */}
            <div className="flex flex-col space-y-2">
              <Skeleton className="h-4 w-24" /> {/* Label */}
              <Skeleton className="h-10 w-full rounded-md" /> {/* Input */}
            </div>
            {/* Action Buttons */}
            <div className="flex gap-2 justify-start items-center lg:col-span-2">
              {/* View Button */}
              <Skeleton className="h-10 w-14 rounded-md" />

              {/* Print Icon */}
              <Skeleton className="h-10 w-10 rounded-md" />

              {/* Download PDF */}
              <Skeleton className="h-10 w-10 rounded-md" />

              {/* Download Excel */}
              <Skeleton className="h-10 w-10 rounded-md" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default SchoolLoading
