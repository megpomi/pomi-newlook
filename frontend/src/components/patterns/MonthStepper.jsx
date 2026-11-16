import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatMonth } from "@/lib/patterns";

// Month navigation for the patterns card: back through the months that hold
// data, never forward past the present month.
export default function MonthStepper({ month, onChange, canGoForward }) {
  const button =
    "flex h-7 w-7 items-center justify-center rounded-full text-pomegranate-600 transition-colors hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent";

  return (
    <div className="flex items-center gap-1 rounded-full border border-pomegranate-100 bg-pomegranate-50/70 p-1">
      <button
        type="button"
        onClick={() => onChange(-1)}
        aria-label="Previous month"
        className={button}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <span className="min-w-[7.5rem] text-center text-xs font-medium text-pomegranate-700">
        {formatMonth(month)}
      </span>
      <button
        type="button"
        onClick={() => onChange(1)}
        disabled={!canGoForward}
        aria-label="Next month"
        className={button}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}