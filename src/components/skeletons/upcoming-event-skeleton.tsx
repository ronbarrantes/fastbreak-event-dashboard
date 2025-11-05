import { Skeleton } from "@/components/ui/skeleton";

export function UpcomingEventSkeleton() {
  return (
    <div className="rounded-lg border border-slate-700 bg-slate-800/30 p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
        <Skeleton className="h-5 w-12" />
      </div>
    </div>
  );
}

export function UpcomingEventsSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <UpcomingEventSkeleton key={i} />
      ))}
    </div>
  );
}

