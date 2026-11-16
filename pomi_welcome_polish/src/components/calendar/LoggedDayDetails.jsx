import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Droplet, Mic, PencilLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { prettySymptom } from "@/lib/dailyLog";
import MoodFace from "@/components/icons/MoodFace";
import JournalEntryDialog from "@/components/journal/JournalEntryDialog";

const FLOW_LABEL = { light: "Light", medium: "Medium", heavy: "Heavy" };


const prettyDate = (d) =>
  d
    ? d.toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

// yyyy-MM-dd from local parts, so the day never shifts by a timezone offset.
const dayKey = (d) => {
  if (!d) return "";
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
};

export default function LoggedDayDetails({
  date,
  log,
  dailyLog,
  journal,
  cycleDay,
  isPeriodDay,
  onTogglePeriod,
  periodSaving,
  periodError,
}) {
  const [journalOpen, setJournalOpen] = useState(false);
  const journalResponse = journal?.journal_response?.trim() || "";
  const journalVoice = journal?.journal_voice_note || "";
  const hasJournal = Boolean(journalResponse || journalVoice);
  // A period entry and the daily check-in are separate records for the same
  // day, so the card shows whatever either of them has to say.
  const flow =
    log?.flow_intensity ||
    (dailyLog?.flow_intensity && dailyLog.flow_intensity !== "none"
      ? dailyLog.flow_intensity
      : null);
  const mood = dailyLog?.mood || log?.mood;
  const symptoms = [
    ...new Set([...(dailyLog?.symptoms || []), ...(log?.symptoms || [])]),
  ];
  const notes = dailyLog?.notes || log?.notes;

  return (
    <div className="rounded-3xl border border-pomegranate-100 bg-white/70 shadow-[0_1px_2px_rgba(89,62,70,0.04),0_12px_32px_-20px_rgba(89,62,70,0.18)] p-6 sm:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h3 className="font-serif text-2xl font-medium leading-tight text-pomegranate-900">
          {prettyDate(date)}
        </h3>
        {cycleDay ? (
          <span className="text-xs font-medium uppercase tracking-[0.12em] text-pomegranate-700">
            Day {cycleDay} of your cycle
          </span>
        ) : null}
      </div>

      {!log && !dailyLog ? (
        <p className="mt-3 flex items-center gap-2 text-sm text-slate-500">
          <Droplet className="h-4 w-4 text-pomegranate-200" />
          Nothing logged for this day.
        </p>
      ) : (
        <div className="mt-4 space-y-3 text-sm text-slate-600">
          {flow && (
            <p>
              <span className="text-slate-400">Flow: </span>
              {FLOW_LABEL[flow] || "—"} flow
            </p>
          )}
          {mood && (
            <p>
              <span className="text-slate-400">Mood: </span>
              <MoodFace
                mood={mood}
                className="inline h-4 w-4 align-[-3px] text-pomegranate-500"
              />{" "}
              {mood}
            </p>
          )}
          {symptoms.length > 0 && (
            <div>
              <span className="text-slate-400">Symptoms: </span>
              <div className="mt-2 flex flex-wrap gap-2">
                {symptoms.map((s) => (
                  <span
                    key={s}
                    className="rounded-full bg-pomegranate-50 px-3 py-1 text-xs capitalize text-pomegranate-700"
                  >
                    {prettySymptom(s)}
                  </span>
                ))}
              </div>
            </div>
          )}
          {dailyLog?.had_sex && (
            <p>
              <span className="text-slate-400">Intimacy: </span>
              Yes
            </p>
          )}
          {notes && (
            <p className="rounded-2xl bg-slate-50 p-4 text-slate-500">
              {notes}
            </p>
          )}
          {hasJournal && (
            <button
              type="button"
              onClick={() => setJournalOpen(true)}
              className="flex w-full items-center justify-between gap-3 rounded-2xl border border-purple-200 bg-purple-50/60 px-4 py-3 text-left text-sm text-purple-900 transition-colors hover:bg-purple-50"
            >
              <span className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 shrink-0" />
                Journal entry saved
                {journalVoice && (
                  <Mic className="h-3.5 w-3.5 text-purple-600" />
                )}
              </span>
              <span className="shrink-0 text-[11px] font-medium uppercase tracking-[0.14em] text-purple-700">
                Read
              </span>
            </button>
          )}
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <Button
          asChild
          variant="outline"
          size="sm"
          className="rounded-full border-pomegranate-200 text-pomegranate-600 hover:bg-pomegranate-50"
        >
          <Link to={`/log-today?date=${dayKey(date)}`}>
            <PencilLine className="mr-1.5 h-4 w-4" />
            Add or edit symptoms
          </Link>
        </Button>
        <Button
          onClick={onTogglePeriod}
          disabled={periodSaving}
          variant="outline"
          size="sm"
          className={cn(
            "rounded-full",
            isPeriodDay
              ? "border-slate-200 text-slate-600 hover:bg-slate-50"
              : "border-pomegranate-200 text-pomegranate-600 hover:bg-pomegranate-50"
          )}
        >
          <Droplet className="mr-1.5 h-4 w-4" />
          {periodSaving
            ? "Saving…"
            : isPeriodDay
            ? "Remove as period day"
            : "Add as period day"}
        </Button>
      </div>

      {periodError && (
        <p className="mt-2 text-sm text-destructive">{periodError}</p>
      )}

      <JournalEntryDialog
        open={journalOpen}
        onOpenChange={setJournalOpen}
        date={date}
        response={journalResponse}
        voiceNote={journalVoice}
      />
    </div>
  );
}