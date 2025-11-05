import { Container } from "@/components/container";
import { EventCardsSkeleton } from "@/components/skeletons/event-card-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function AttendingLoading() {
  return (
    <Container className="py-20">
      <header className="mb-8 flex items-center justify-between">
        <Skeleton className="h-10 w-48" />
      </header>

      <div className="mt-8">
        <Skeleton className="mb-6 h-5 w-40" />
        <EventCardsSkeleton count={6} />
      </div>
    </Container>
  );
}

