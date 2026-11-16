import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { base44 } from "@/api/base44Client";
import { Loader2 } from "lucide-react";
import { MOOD_OPTIONS } from "@/lib/dailyLog";
import MoodFace from "@/components/icons/MoodFace";

const FLOWS = [
  { value: "light", label: "Light", dot: "bg-pomegranate-200" },
  { value: "medium", label: "Medium", dot: "bg-pomegranate-400" },
  { value: "heavy", label: "Heavy", dot: "bg-pomegranate-600" },
];



const SYMPTOMS = [
  "cramps",
  "headache",
  "bloating",
  "fatigue",
  "breast_tenderness",
  "acne",
  "cravings",
  "appetite_loss",
  "backache",
  "mood_swings",
  "insomnia",
  "dreams",
  "increased_libido",
  "cervical_mucus",
  "spotting",
];

const pretty = (s) => s.replace(/_/g, " ");

export default function LogPeriodSheet({ open, onOpenChange, onSaved }) {
  const today = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState({
    start_date: today,
    end_date: "",
    flow_intensity: "medium",
    mood: "",
    symptoms: [],
    notes: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setForm({
        start_date: today,
        end_date: "",
        flow_intensity: "medium",
        mood: "",
        symptoms: [],
        notes: "",
      });
      setError("");
    }
  }, [open, today]);

  const toggleSymptom = (s) =>
    setForm((f) => ({
      ...f,
      symptoms: f.symptoms.includes(s)
        ? f.symptoms.filter((x) => x !== s)
        : [...f.symptoms, s],
    }));

  const submit = async () => {
    if (!form.start_date) {
      setError("Please choose a start date.");
      return;
    }
    if (form.end_date && form.end_date < form.start_date) {
      setError("End date can't be before the start date.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const payload = {
        start_date: form.start_date,
        flow_intensity: form.flow_intensity,
        symptoms: form.symptoms,
        notes: form.notes || undefined,
      };
      if (form.end_date) payload.end_date = form.end_date;
      if (form.mood) payload.mood = form.mood;
      await base44.entities.CycleLog.create(payload);
      onSaved?.();
    } catch (e) {
      setError(e?.message || "Could not save. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl">Log your period</DialogTitle>
          <DialogDescription>
            Add a few details — predictions improve with every entry.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start">Start date</Label>
              <Input
                id="start"
                type="date"
                value={form.start_date}
                onChange={(e) =>
                  setForm((f) => ({ ...f, start_date: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end">End date (optional)</Label>
              <Input
                id="end"
                type="date"
                value={form.end_date}
                onChange={(e) =>
                  setForm((f) => ({ ...f, end_date: e.target.value }))
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Flow</Label>
            <div className="flex gap-2">
              {FLOWS.map((f) => (
                <button
                  key={f.value}
                  type="button"
                  onClick={() =>
                    setForm((s) => ({ ...s, flow_intensity: f.value }))
                  }
                  className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm transition ${
                    form.flow_intensity === f.value
                      ? "border-pomegranate-400 bg-pomegranate-50 text-pomegranate-700"
                      : "border-slate-200 text-slate-600 hover:border-pomegranate-200"
                  }`}
                >
                  <span className={`h-2.5 w-2.5 rounded-full ${f.dot}`} />
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Mood (optional)</Label>
            <div className="flex gap-2">
              {MOOD_OPTIONS.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() =>
                    setForm((s) => ({
                      ...s,
                      mood: s.mood === m.value ? "" : m.value,
                    }))
                  }
                  aria-label={m.label}
                  className={`flex-1 rounded-xl border px-2 py-2 transition ${
                    form.mood === m.value
                      ? "border-pomegranate-400 bg-pomegranate-50"
                      : "border-slate-200 hover:border-pomegranate-200"
                  }`}
                >
                  <MoodFace
                    mood={m.value}
                    className={`mx-auto h-6 w-6 ${
                      form.mood === m.value
                        ? "text-pomegranate-600"
                        : "text-slate-500"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Symptoms (optional)</Label>
            <div className="flex flex-wrap gap-2">
              {SYMPTOMS.map((s) => {
                const active = form.symptoms.includes(s);
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleSymptom(s)}
                    className={`rounded-full border px-3 py-1.5 text-xs capitalize transition ${
                      active
                        ? "border-pomegranate-400 bg-pomegranate-50 text-pomegranate-700"
                        : "border-slate-200 text-slate-600 hover:border-pomegranate-200"
                    }`}
                  >
                    {pretty(s)}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              rows={3}
              value={form.notes}
              onChange={(e) =>
                setForm((f) => ({ ...f, notes: e.target.value }))
              }
              placeholder="How are you feeling?"
            />
          </div>

          {error && <p className="text-sm text-pomegranate-600">{error}</p>}
        </div>

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => onOpenChange?.(false)}
            disabled={saving}
          >
            Cancel
          </Button>
          <Button onClick={submit} disabled={saving} className="bg-pomegranate-500 hover:bg-pomegranate-600">
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save entry
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}