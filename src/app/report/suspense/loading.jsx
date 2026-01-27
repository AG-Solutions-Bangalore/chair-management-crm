import { Skeleton } from "@/components/ui/skeleton";

const SuspenseLoading = () => {
  return (
    <div className="flex justify-end gap-2 z-50">
      {/* Print */}
      <Skeleton className="h-10 w-10 rounded-md" />

      {/* Download PDF */}
      <Skeleton className="h-10 w-10 rounded-md" />

      {/* Download Excel */}
      <Skeleton className="h-10 w-10 rounded-md" />
    </div>
  );
};

export default SuspenseLoading;
