import React, { useMemo, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import CalendarDay from "@/components/calendar/CalendarDay";
import LoggedDayDetails from "@/components/calendar/LoggedDayDetails";
import { getCycleDay } from "@/lib/cycle";
import { addPeriodDays, deletePeriodDays } from "@/lib/periodLogs";

// yyyy-MM-dd, built from local parts so days never shift by a timezone offset.
const dayKey = (value) => {
  const d = new Date(value);
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
};

// A stored yyyy-MM-dd day, rebuilt from local parts so it lands on the right
// square in every timezone.
const parseDayKey = (value) => {
  const [year, month, day] = String(value).split("-").map(Number);
  return new Date(year, month - 1, day);
};

// Every calendar day a log covers: start_date through end_date (a single day when open).
const expandLog = (log) => {
  const days = [];
  const end = new Date(log.end_date || log.start_date);
  for (let d = new Date(log.start_date); d <= end; d.setDate(d.getDate() + 1)) {
    days.push(new Date(d));
  }
  return days;
};

// The month calendar with a dot on every day that has data, plus the details of
// the day you tap. `title`/`action` fill an optional header row.
export default function CalendarPanel({
  logs,
  dailyLogs = [],
  loading,
  showJournal = false,
  title,
  action,
  onChanged,
}) {
  const [selected, setSelected] = useState(new Date());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loggedDays = useMemo(() => logs.flatMap(expandLog), [logs]);

  // Days the daily check-in recorded a symptom on, so a day that isn't part of
  // a period can still be spotted and opened.
  const symptomDays = useMemo(
    () =>
      dailyLogs
        .filter((entry) => entry.symptoms?.length > 0)
        .map((entry) => parseDayKey(entry.date)),
    [dailyLogs]
  );

  // Days with a journal entry, for people tracking general wellbeing.
  const journalDays = useMemo(
    () =>
      showJournal
        ? dailyLogs
            .filter(
              (entry) =>
                entry.journal_response?.trim() || entry.journal_voice_note
            )
            .map((entry) => parseDayKey(entry.date))
        : [],
    [dailyLogs, showJournal]
  );

  const selectedLog = useMemo(() => {
    if (!selected) return null;
    const key = dayKey(selected);
    return (
      logs.find((l) => {
        const start = dayKey(l.start_date);
        const end = dayKey(l.end_date || l.start_date);
        return key >= start && key <= end;
      }) || null
    );
  }, [logs, selected]);

  const selectedDailyLog = useMemo(
    () =>
      (selected && dailyLogs.find((entry) => entry.date === dayKey(selected))) ||
      null,
    [dailyLogs, selected]
  );

  const cycleDay = useMemo(
    () => (selected ? getCycleDay(logs, selected) : null),
    [logs, selected]
  );

  // Marks the selected day as a period day, or clears it when it already is one.
  const togglePeriodDay = async () => {
    if (!selected || saving) return;
    setSaving(true);
    setError("");
    try {
      const key = dayKey(selected);
      if (selectedLog) await deletePeriodDays(logs, [key]);
      else await addPeriodDays(logs, [key]);
      if (onChanged) await onChanged();
    } catch (e) {
      setError(e?.message || "Couldn't update this day. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="rounded-3xl border border-pomegranate-100 bg-white/70 shadow-[0_1px_2px_rgba(89,62,70,0.04),0_12px_32px_-20px_rgba(89,62,70,0.18)] p-1 sm:p-3">
        {(title || action) && (
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 pb-1 pt-3">
            {title && (
              <h3 className="font-serif text-2xl font-medium leading-tight text-pomegranate-900">
                {title}
              </h3>
            )}
            {action}
          </div>
        )}

        <Calendar
          mode="single"
          selected={selected}
          onSelect={(value) => value && setSelected(value)}
          modifiers={{
            logged: loggedDays,
            symptom: symptomDays,
            journal: journalDays,
          }}
          components={{ DayContent: CalendarDay }}
          disabled={{ after: new Date() }}
          classNames={{
            months: "flex flex-col items-center",
            month: "w-full space-y-3",
            head_row: "flex w-full",
            head_cell:
              "flex-1 font-normal text-[0.8rem] text-muted-foreground",
            row: "flex w-full mt-1",
            cell: "relative flex-1 p-0 text-center text-sm",
            day: "inline-flex h-11 w-full items-center justify-center rounded-full p-0 text-sm font-normal hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring aria-selected:opacity-100",
            day_logged:
              "bg-pomegranate-200/70 font-medium text-pomegranate-900 hover:bg-pomegranate-200",
            day_selected:
              "bg-pomegranate-600 text-primary-foreground hover:bg-pomegranate-600 focus:bg-pomegranate-600",
            day_today: "font-semibold",
          }}
          className="w-full p-3"
        />

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 pb-3 text-xs text-slate-500">
          <span className="flex items-center gap-2">
            <span className="relative inline-flex h-4 w-4 items-center justify-center rounded-full bg-pomegranate-200/70">
              <span className="h-1 w-1 rounded-full bg-pomegranate-600" />
            </span>
            Period day
          </span>
          <span className="flex items-center gap-2">
            <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-slate-200">
              <span className="h-1.5 w-1.5 rounded-full bg-symptom" />
            </span>
            Symptoms
          </span>
          {showJournal && (
            <span className="flex items-center gap-2">
              <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-slate-200">
                <span className="h-1.5 w-1.5 rounded-full bg-purple-800" />
              </span>
              Journal entry
            </span>
          )}
        </div>
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="h-32 animate-pulse rounded-3xl bg-white" />
        ) : (
          <LoggedDayDetails
            date={selected}
            log={selectedLog}
            dailyLog={selectedDailyLog}
            journal={showJournal ? selectedDailyLog : null}
            cycleDay={cycleDay}
            isPeriodDay={Boolean(selectedLog)}
            onTogglePeriod={togglePeriodDay}
            periodSaving={saving}
            periodError={error}
          />
        )}
      </div>
    </div>
  );
}