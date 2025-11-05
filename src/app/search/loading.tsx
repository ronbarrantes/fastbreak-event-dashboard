import { Container } from "@/components/container";
import { EventCardsSkeleton } from "@/components/skeletons/event-card-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function SearchLoading() {
  return (
    <Container className="py-20">
      <header className="mb-8 flex items-center justify-between">
        <Skeleton className="h-10 w-40" />
      </header>

      <div className="grid grid-cols-[1fr_auto_auto] items-end gap-3">
        <div className="space-y-1">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-9 w-full" />
        </div>
        <div className="space-y-1">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-9 w-32" />
        </div>
        <Skeleton className="h-9 w-20" />
      </div>

      <div className="mt-8">
        <Skeleton className="mb-6 h-5 w-48" />
        <EventCardsSkeleton count={6} />
      </div>
    </Container>
  );
}

