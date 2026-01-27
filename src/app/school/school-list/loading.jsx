import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const SchoolViewLoading = () => {
  return (
    <div className="max-w-screen space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <Card className="lg:col-span-8 p-6 space-y-6 shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="w-32 h-6" />
            </div>
            <div className="text-center space-y-1">
              <Skeleton className="w-20 h-6 mx-auto" />
              <Skeleton className="w-28 h-4 mx-auto" />
            </div>
          </div>

          <div className="space-y-2 mt-4">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div key={idx} className="flex justify-between py-2">
                <Skeleton className="w-32 h-5" />
                <Skeleton className="w-24 h-5" />
              </div>
            ))}
          </div>
        </Card>

        <div className="lg:col-span-4 space-y-6">
          <Card className="p-6 shadow">
            <Skeleton className="w-40 h-5 mb-4" />
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="flex justify-between space-y-2">
                  <Skeleton className="w-24 h-5" /> 
                  <Skeleton className="w-20 h-5" /> 
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 shadow">
            <Skeleton className="w-40 h-5 mb-4" />
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="flex justify-between space-y-2">
                  <Skeleton className="w-24 h-5" /> 
                  <Skeleton className="w-20 h-5" /> 
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <Card className="p-6 mt-4 shadow-sm">
        <Skeleton className="w-40 h-5 mb-4" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div
              key={idx}
              className="grid grid-cols-3 gap-x-4 border-b border-muted py-2"
            >
              <Skeleton className="w-32 h-5" />
              <Skeleton className="w-32 h-5" />
              <Skeleton className="w-32 h-5" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default SchoolViewLoading;
