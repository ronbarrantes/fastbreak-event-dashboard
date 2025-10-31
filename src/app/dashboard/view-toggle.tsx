"use client";

import { Button } from "@/components/ui/button";
import { useViewStore } from "@/state/view-store";

export function ViewToggle() {
  const { viewType, setViewType } = useViewStore();

  return (
    <div className="flex gap-2">
      <Button
        variant={viewType === "table" ? "default" : "outline"}
        size="sm"
        onClick={() => setViewType("table")}
        className={
          viewType === "table"
            ? "bg-cyan-500 text-white hover:bg-cyan-600"
            : "border-slate-700 text-white hover:bg-slate-800"
        }
        aria-label="Table view"
      >
        Table
      </Button>
      <Button
        variant={viewType === "grid" ? "default" : "outline"}
        size="sm"
        onClick={() => setViewType("grid")}
        className={
          viewType === "grid"
            ? "bg-cyan-500 text-white hover:bg-cyan-600"
            : "border-slate-700 text-white hover:bg-slate-800"
        }
        aria-label="Grid view"
      >
        Grid
      </Button>
    </div>
  );
}

