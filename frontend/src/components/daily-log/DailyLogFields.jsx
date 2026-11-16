import React from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import MoodFace from "@/components/icons/MoodFace";
import { FLOW_OPTIONS, MOOD_OPTIONS } from "@/lib/dailyLog";

// A small on/off slider with its label — the shared look of every lifestyle toggle.
export function TogglePill({ label, checked, onChange, disabled }) {
  const id = `toggle-${label.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 transition ${
        checked
          ? "border-pomegranate-400 bg-pomegranate-50"
          : "border-slate-200 hover:border-pomegranate-200"
      }`}
    >
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onChange}
        disabled={disabled}
        className="h-4 w-7 [&>span]:h-3 [&>span]:w-3 [&>span]:data-[state=checked]:translate-x-3 data-[state=checked]:bg-pomegranate-600"
      />
      <Label
        htmlFor={id}
        className={`cursor-pointer text-xs ${
          checked ? "text-pomegranate-700" : "text-slate-600"
        }`}
      >
        {label}
      </Label>
    </div>
  );
}

export function FlowPicker({ value, onChange, disabled }) {
  return (
    <div className={`space-y-2 transition ${disabled ? "opacity-50" : ""}`}>
      <Label className={disabled ? "text-slate-400" : undefined}>Flow</Label>
      <div className="flex gap-2">
        {FLOW_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            disabled={disabled}
            onClick={() => onChange(option.value)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-2 py-2.5 text-sm transition ${
              disabled
                ? "cursor-not-allowed border-slate-200 text-slate-400"
                : value === option.value
                ? "border-pomegranate-400 bg-pomegranate-50 text-pomegranate-700"
                : "border-slate-200 text-slate-600 hover:border-pomegranate-200"
            }`}
          >
            <span className={`h-2.5 w-2.5 rounded-full ${option.dot}`} />
            {option.label}
          </button>
        ))}
      </div>
      {disabled && (
        <p className="text-xs text-slate-400">
          Flow is only logged on period days.
        </p>
      )}
    </div>
  );
}

export function MoodPicker({ value, onChange }) {
  return (
    <div className="space-y-2">
      <Label>Mood</Label>
      <div className="flex gap-2">
        {MOOD_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-label={option.label}
            onClick={() => onChange(value === option.value ? "" : option.value)}
            className={`flex-1 rounded-xl border px-2 py-2 transition ${
              value === option.value
                ? "border-pomegranate-400 bg-pomegranate-50"
                : "border-slate-200 hover:border-pomegranate-200"
            }`}
          >
            <MoodFace
              mood={option.value}
              className={`mx-auto h-6 w-6 ${
                value === option.value
                  ? "text-pomegranate-600"
                  : "text-slate-500"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

// Symptom bubbles (including custom ones) live in their own component.