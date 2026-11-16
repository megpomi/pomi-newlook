import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const REASONS = [
  { value: "taking_a_break", label: "I'm taking a break from tracking" },
  { value: "not_useful", label: "Pomi isn't useful for me" },
  { value: "too_expensive", label: "It's too expensive" },
  { value: "privacy", label: "I have privacy concerns" },
  { value: "switching", label: "I'm switching to another app" },
  { value: "other", label: "Something else" },
];

// The "why are you leaving?" step of the delete-account flow. Controlled, so
// the page owns the answers and submits them with the deletion.
export default function ExitQuestionnaire({
  reason,
  comments,
  onReasonChange,
  onCommentsChange,
}) {
  return (
    <section className="rounded-2xl border border-pomegranate-100 bg-white p-5">
      <h2 className="font-heading text-lg font-semibold text-slate-800">
        Before you go — why are you leaving?
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        Your answer helps us make Pomi better. It's the only thing we'll keep.
      </p>

      <div className="mt-4 space-y-2">
        {REASONS.map((option) => {
          const active = reason === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onReasonChange(option.value)}
              className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                active
                  ? "border-pomegranate-400 bg-pomegranate-50 text-slate-800"
                  : "border-pomegranate-100 text-slate-600 hover:bg-pomegranate-50/60"
              }`}
            >
              <span
                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                  active ? "border-pomegranate-500" : "border-slate-300"
                }`}
              >
                {active && (
                  <span className="h-2 w-2 rounded-full bg-pomegranate-500" />
                )}
              </span>
              {option.label}
            </button>
          );
        })}
      </div>

      <div className="mt-4 space-y-2">
        <Label htmlFor="exit-comments">
          Anything else you'd like to share? (optional)
        </Label>
        <Textarea
          id="exit-comments"
          value={comments}
          onChange={(e) => onCommentsChange(e.target.value)}
          maxLength={1000}
          rows={4}
          placeholder="Tell us what we could have done better…"
        />
      </div>
    </section>
  );
}