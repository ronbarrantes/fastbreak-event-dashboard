import { Container } from "@/components/container";
import { EventCardsSkeleton } from "@/components/skeletons/event-card-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <Container className="py-20">
      <header className="mb-8 flex items-center justify-between">
        <Skeleton className="h-10 w-32" />
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-40" />
        </div>
      </header>
      <EventCardsSkeleton count={6} />
    </Container>
  );
}
