import React from "react";
import { Label } from "@/components/ui/label";
import { DISCHARGE_OPTIONS, prettySymptom } from "@/lib/dailyLog";

// The kinds of discharge a user can note — only active once Discharge is on.
export default function DischargePicker({ value, onChange, disabled }) {
  const toggle = (type) =>
    onChange(
      value.includes(type)
        ? value.filter((item) => item !== type)
        : [...value, type]
    );

  return (
    <div className={`space-y-2 transition ${disabled ? "opacity-50" : ""}`}>
      <Label className={disabled ? "text-slate-400" : undefined}>Discharge</Label>
      <div className="flex flex-wrap gap-2">
        {DISCHARGE_OPTIONS.map((type) => {
          const active = value.includes(type);
          return (
            <button
              key={type}
              type="button"
              disabled={disabled}
              onClick={() => toggle(type)}
              className={`rounded-full border px-3 py-1.5 text-xs capitalize transition ${
                disabled
                  ? "cursor-not-allowed border-slate-200 text-slate-400"
                  : active
                  ? "border-pomegranate-400 bg-pomegranate-50 text-pomegranate-700"
                  : "border-slate-200 text-slate-600 hover:border-pomegranate-200"
              }`}
            >
              {prettySymptom(type)}
            </button>
          );
        })}
      </div>
    </div>
  );
}