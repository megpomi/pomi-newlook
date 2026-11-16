import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import LotusIcon from "@/components/icons/LotusIcon";
import { promptForDate } from "@/lib/journalPrompts";

// Shown on the home page for people tracking general wellbeing: one reflective
// prompt a day, rotating through mood, gratitude and visualisation.
export default function JournalPrompt({ dateKey }) {
  const { theme, prompt } = promptForDate(dateKey);

  return (
    <section className="relative overflow-hidden rounded-3xl border border-pomegranate-100 bg-pomegranate-50/70 p-6 sm:p-7">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-pomegranate-500">
          <LotusIcon className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-pomegranate-500">
              Today's journal prompt
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[11px] font-medium text-pomegranate-600">
              <Sparkles className="h-3 w-3" />
              {theme.label}
            </span>
          </div>
          <p className="mt-3 font-serif text-2xl italic leading-snug text-pomegranate-900 sm:text-[1.75rem]">
            {prompt}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
            <Link
              to="/log-today"
              className="inline-flex items-center gap-1 text-sm font-medium text-pomegranate-600 hover:text-pomegranate-700"
            >
              Write it in today's log
              <ArrowRight className="h-4 w-4" />
            </Link>
            <span className="text-xs text-slate-500">
              A new prompt every day.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}