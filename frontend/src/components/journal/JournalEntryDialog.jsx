import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import LotusIcon from "@/components/icons/LotusIcon";
import JournalNotePlayer from "@/components/journal/JournalNotePlayer";
import { promptForDate } from "@/lib/journalPrompts";

// yyyy-MM-dd from local parts, so the day never shifts by a timezone offset.
const dayKey = (d) => {
  if (!d) return "";
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
};

const prettyDate = (d) =>
  d
    ? d.toLocaleDateString(undefined, {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

// Shows a day's saved journal entry: the prompt it answered, the written
// reflection and, when one was recorded, the voice note.
export default function JournalEntryDialog({
  open,
  onOpenChange,
  date,
  response,
  voiceNote,
}) {
  const { theme, prompt } = promptForDate(dayKey(date));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto rounded-3xl border-slate-100 bg-white p-6">
        <DialogHeader>
          <DialogTitle className="font-heading text-lg font-semibold text-slate-800">
            Your journal entry
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500">
            {prettyDate(date)}
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-2xl border border-pomegranate-100 bg-pomegranate-50/70 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-pomegranate-500">
              <LotusIcon className="h-3.5 w-3.5" />
            </span>
            <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-pomegranate-500">
              {theme.label}
            </span>
          </div>
          <p className="mt-2 font-heading text-base leading-snug text-slate-800">
            {prompt}
          </p>
        </div>

        {response ? (
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-600">
            {response}
          </p>
        ) : (
          <p className="text-sm italic text-slate-400">
            No written reflection for this day.
          </p>
        )}

        {voiceNote && (
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-400">
              Voice note
            </p>
            <JournalNotePlayer fileUri={voiceNote} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}