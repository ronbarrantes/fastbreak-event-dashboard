import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function DataTableSkeleton({
  columns = 5,
  rows = 5,
}: {
  columns?: number;
  rows?: number;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-700">
      <Table>
        <TableHeader>
          <TableRow className="border-slate-700">
            {Array.from({ length: columns }).map((_, i) => (
              <TableHead key={i} className="px-6 py-4">
                <Skeleton className="h-4 w-24" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <TableRow
              key={rowIndex}
              className="border-slate-700 hover:bg-slate-800/30"
            >
              {Array.from({ length: columns }).map((_, cellIndex) => (
                <TableCell key={cellIndex} className="px-6 py-4">
                  <Skeleton className="h-4 w-full" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
