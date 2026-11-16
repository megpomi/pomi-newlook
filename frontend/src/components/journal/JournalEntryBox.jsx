import React from "react";
import { Sparkles } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import LotusIcon from "@/components/icons/LotusIcon";
import VoiceNoteRecorder from "@/components/journal/VoiceNoteRecorder";
import { promptForDate } from "@/lib/journalPrompts";

// The general wellbeing part of a day's entry: the day's reflective prompt, a
// written reflection and an optional voice note.
export default function JournalEntryBox({
  dateKey,
  response,
  voiceNote,
  onResponseChange,
  onVoiceNoteChange,
}) {
  const { theme, prompt } = promptForDate(dateKey);

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-pomegranate-100 bg-pomegranate-50/70 p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-pomegranate-500">
            <LotusIcon className="h-4 w-4" />
          </span>
          <span className="text-[11px] font-medium uppercase tracking-[0.18em] text-pomegranate-500">
            Today's journal prompt
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[11px] font-medium text-pomegranate-600">
            <Sparkles className="h-3 w-3" />
            {theme.label}
          </span>
        </div>
        <p className="mt-3 font-heading text-lg leading-snug text-slate-800">
          {prompt}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="journal-response">Your reflection</Label>
        <Textarea
          id="journal-response"
          rows={5}
          value={response}
          onChange={(event) => onResponseChange(event.target.value)}
          placeholder="Take your time. Write as much or as little as feels right."
        />
      </div>

      <div className="space-y-2">
        <Label>Or record a voice note</Label>
        <VoiceNoteRecorder fileUri={voiceNote} onChange={onVoiceNoteChange} />
      </div>
    </div>
  );
}