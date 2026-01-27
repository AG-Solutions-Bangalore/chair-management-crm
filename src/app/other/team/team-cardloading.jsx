import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
const TeamCardLoading = () => {
  return (
    <>
      <div className="space-y-4 mt-4">
        <div className="grid w-full grid-cols-4 gap-2 mb-2 sticky top-16 shadow-sm">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-8 rounded-md" />
          ))}
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {[...Array(8)].map((_, i) => (
            <Card
              key={i}
              className="p-4 flex items-center gap-4 border border-gray-200 rounded-xl"
            >
              <Skeleton className="w-16 h-16 rounded-md" />
              <div className="flex flex-col gap-2 flex-1">
                <Skeleton className="h-4 w-3/4 rounded" />
                <Skeleton className="h-3 w-1/2 rounded" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
};

export default TeamCardLoading;
