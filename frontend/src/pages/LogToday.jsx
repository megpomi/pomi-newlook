import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ArrowLeft, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import AppHeader from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  FlowPicker,
  MoodPicker,
  TogglePill,
} from "@/components/daily-log/DailyLogFields";
import SymptomPicker from "@/components/daily-log/SymptomPicker";
import LifestylePicker from "@/components/daily-log/LifestylePicker";
import DischargePicker from "@/components/daily-log/DischargePicker";
import JournalEntryBox from "@/components/journal/JournalEntryBox";
import {
  addPeriodDays,
  deletePeriodDays,
  toDayKey,
} from "@/lib/periodLogs";

const EMPTY = {
  flow_intensity: "none",
  mood: "",
  symptoms: [],
  discharge: false,
  discharge_types: [],
  had_sex: false,
  alcohol: false,
  light_exercise: false,
  intense_exercise: false,
  caffeine: false,
  custom_lifestyle: [],
  journal_response: "",
  journal_voice_note: "",
  notes: "",
};

// Daily check-in. One entry per day: saving again updates it. Opened with a
// ?date= param it edits that day instead of today.
export default function LogToday() {
  const today = format(new Date(), "yyyy-MM-dd");
  const requestedDate = new URLSearchParams(window.location.search).get("date");
  const date = requestedDate || today;
  const isToday = date === today;
  const [form, setForm] = useState(EMPTY);
  const [entryId, setEntryId] = useState(null);
  const [periodLogs, setPeriodLogs] = useState([]);
  const [periodBusy, setPeriodBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tracking, setTracking] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    base44.auth
      .me()
      .then((me) =>
        base44.entities.DailyLog.filter(
          { date, created_by_id: me?.id },
          { limit: 1 }
        )
      )
      .then((page) => {
        if (!active) return;
        const entry = page.items[0];
        setEntryId(entry?.id || null);
        setForm({
          flow_intensity: entry?.flow_intensity || "none",
          mood: entry?.mood || "",
          symptoms: entry?.symptoms || [],
          discharge: entry?.discharge || false,
          discharge_types: entry?.discharge_types || [],
          had_sex: entry?.had_sex || false,
          alcohol: entry?.alcohol || false,
          light_exercise: entry?.light_exercise || false,
          intense_exercise: entry?.intense_exercise || false,
          caffeine: entry?.caffeine || false,
          custom_lifestyle: entry?.custom_lifestyle || [],
          journal_response: entry?.journal_response || "",
          journal_voice_note: entry?.journal_voice_note || "",
          notes: entry?.notes || "",
        });
      })
      .catch(() => active && setError("Couldn't load this day's entry."))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [date]);

  // Period days live in their own history, so the toggle needs the runs that
  // already exist to extend or split them correctly.
  useEffect(() => {
    let active = true;
    base44.auth
      .me()
      .then((me) =>
        base44.entities.CycleLog.filter(
          { created_by_id: me?.id },
          { limit: 100 }
        )
      )
      .then((page) => active && setPeriodLogs(page.items))
      .catch(() => active && setError("Couldn't load your period history."));
    return () => {
      active = false;
    };
  }, []);

  // Which boxes to show comes from the tracking areas chosen in the profile.
  useEffect(() => {
    let active = true;
    base44.auth
      .me()
      .then((user) => active && setTracking(user?.tracking_focus || []))
      .catch(() => active && setTracking([]));
    return () => {
      active = false;
    };
  }, []);

  const set = (patch) => setForm((current) => ({ ...current, ...patch }));

  const isPeriodDay = periodLogs.some((log) => {
    const start = toDayKey(log.start_date);
    const end = toDayKey(log.end_date || log.start_date);
    return date >= start && date <= end;
  });

  const togglePeriod = async (next) => {
    if (periodBusy) return;
    setPeriodBusy(true);
    setError("");
    try {
      const updated = next
        ? await addPeriodDays(periodLogs, [date])
        : await deletePeriodDays(periodLogs, [date]);
      setPeriodLogs(updated.filter(Boolean));
      if (!next) set({ flow_intensity: "none" });
    } catch (e) {
      setError(e?.message || "Couldn't update this period day. Please try again.");
    } finally {
      setPeriodBusy(false);
    }
  };

  const save = async () => {
    setSaving(true);
    setError("");
    try {
      const payload = {
        date,
        flow_intensity: form.flow_intensity,
        symptoms: form.symptoms,
        discharge: form.discharge,
        discharge_types: form.discharge_types,
        had_sex: form.had_sex,
        alcohol: form.alcohol,
        light_exercise: form.light_exercise,
        intense_exercise: form.intense_exercise,
        caffeine: form.caffeine,
        custom_lifestyle: form.custom_lifestyle,
        journal_response: form.journal_response,
        journal_voice_note: form.journal_voice_note,
        notes: form.notes,
      };
      if (form.mood) payload.mood = form.mood;
      if (entryId) {
        await base44.entities.DailyLog.update(entryId, payload);
      } else {
        await base44.entities.DailyLog.create(payload);
      }
      toast({
        title: isToday ? "Today's entry saved" : "Entry saved",
        description: isToday
          ? "Thanks for checking in."
          : "Thanks for filling in that day.",
      });
      navigate("/");
    } catch (e) {
      setError(e?.message || "Couldn't save your entry. Please try again.");
      setSaving(false);
    }
  };

  const tracksWellbeing = (tracking || []).includes("general_wellbeing");
  const showCycle =
    (tracking || []).includes("menstrual_cycles") || !tracksWellbeing;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader maxWidth="max-w-2xl">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-pomegranate-600 hover:text-pomegranate-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to my dashboard
        </Link>
      </AppHeader>

      <main className="mx-auto max-w-2xl px-5 py-8 sm:px-8 sm:py-12">
        <h1 className="font-heading text-3xl font-semibold text-slate-800 sm:text-4xl">
          {isToday ? "How are you today?" : "Edit this day"}
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          It's the {format(new Date(`${date}T00:00:00`), "EEEE d MMMM")}
        </p>

        {loading || !tracking ? (
          <div className="mt-8 flex justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-pomegranate-400" />
          </div>
        ) : (
          <div className="mt-6 space-y-6">
            <section className="rounded-3xl border border-slate-100 bg-white p-5 sm:p-6">
              <p className="text-sm text-slate-500">
                Log your mood and lifestyle choices for today
              </p>
              <div className="mt-5 space-y-6">
                <MoodPicker
                  value={form.mood}
                  onChange={(value) => set({ mood: value })}
                />
                <div className="space-y-2">
                  <Label>Lifestyle</Label>
                  <div className="flex flex-wrap gap-2">
                    <TogglePill
                      label="Sex"
                      checked={form.had_sex}
                      onChange={(value) => set({ had_sex: value })}
                    />
                    <TogglePill
                      label="Light exercise"
                      checked={form.light_exercise}
                      onChange={(value) => set({ light_exercise: value })}
                    />
                    <TogglePill
                      label="Intense exercise"
                      checked={form.intense_exercise}
                      onChange={(value) => set({ intense_exercise: value })}
                    />
                    <TogglePill
                      label="Alcohol"
                      checked={form.alcohol}
                      onChange={(value) => set({ alcohol: value })}
                    />
                    <TogglePill
                      label="Caffeine"
                      checked={form.caffeine}
                      onChange={(value) => set({ caffeine: value })}
                    />
                    <LifestylePicker
                      value={form.custom_lifestyle}
                      onChange={(value) => set({ custom_lifestyle: value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="daily-notes">Notes</Label>
                  <Textarea
                    id="daily-notes"
                    rows={3}
                    value={form.notes}
                    onChange={(e) => set({ notes: e.target.value })}
                    placeholder="Anything else you noticed today?"
                  />
                </div>
              </div>
            </section>

            {showCycle && (
              <section className="rounded-3xl border border-slate-100 bg-white p-5 sm:p-6">
                <h2 className="font-heading text-xl font-semibold text-slate-800">
                  Menstrual cycles
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Log today as a period day or simply track today's cycle
                  symptoms.
                </p>
                <div className="mt-5 space-y-6">
                  <TogglePill
                    label="Period"
                    checked={isPeriodDay}
                    onChange={togglePeriod}
                    disabled={periodBusy}
                  />
                  <FlowPicker
                    value={form.flow_intensity}
                    onChange={(value) => set({ flow_intensity: value })}
                    disabled={!isPeriodDay}
                  />
                  <SymptomPicker
                    value={form.symptoms}
                    onChange={(value) => set({ symptoms: value })}
                  />
                  <TogglePill
                    label="Discharge"
                    checked={form.discharge}
                    onChange={(value) =>
                      set({
                        discharge: value,
                        discharge_types: value ? form.discharge_types : [],
                      })
                    }
                  />
                  <DischargePicker
                    value={form.discharge_types}
                    onChange={(value) => set({ discharge_types: value })}
                    disabled={!form.discharge}
                  />
                </div>
              </section>
            )}

            {tracksWellbeing && (
              <section className="rounded-3xl border border-slate-100 bg-white p-5 sm:p-6">
                <h2 className="font-heading text-xl font-semibold text-slate-800">
                  General wellbeing
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Take a quiet moment to reflect on today, maybe using today's
                  journal prompt if you need.
                </p>
                <div className="mt-5">
                  <JournalEntryBox
                    dateKey={date}
                    response={form.journal_response}
                    voiceNote={form.journal_voice_note}
                    onResponseChange={(value) =>
                      set({ journal_response: value })
                    }
                    onVoiceNoteChange={(value) =>
                      set({ journal_voice_note: value })
                    }
                  />
                </div>
              </section>
            )}

            {error && <p className="text-sm text-destructive">{error}</p>}

            <Button
              onClick={save}
              disabled={saving}
              className="w-full rounded-full bg-pomegranate-600 py-6 text-base hover:bg-pomegranate-700"
            >
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save entry
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}