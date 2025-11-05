import { Suspense } from "react";

import { Container } from "@/components/container";
import { SearchForm } from "@/components/search-form";
import { Skeleton } from "@/components/ui/skeleton";

type SearchPageProps = {
  searchParams: Promise<{
    query?: string;
    sportType?: string;
  }>;
};

export default async function EventSearchPage({
  searchParams,
}: SearchPageProps) {
  const params = await searchParams;
  const query = params.query ?? "";
  const sportType = params.sportType ?? "";

  // TODO: Fetch search results based on query and sportType
  // const results = await searchEvents({ query, sportType });

  return (
    <Container className="py-20">
      <header className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white md:text-4xl">
          Search Events
        </h1>
      </header>

      <Suspense
        fallback={
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
        }
      >
        <SearchForm />
      </Suspense>

      {/* TODO: Display search results */}
      {(query || sportType) && (
        <div className="mt-8">
          <p className="text-slate-400">
            Search results for: {query && `"${query}"`}
            {query && sportType && " • "}
            {sportType && `Sport: ${sportType}`}
          </p>
        </div>
      )}
    </Container>
  );
}
