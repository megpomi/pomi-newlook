import React from "react";
import { Sparkles } from "lucide-react";
import { CHARITY_OPTIONS } from "@/lib/charities";
import ChoiceCard from "@/components/onboarding/ChoiceCard";

export default function CausePreferences({ selected, onChange }) {
  const allSelected = selected.length === CHARITY_OPTIONS.length;

  const toggle = (value) =>
    onChange(
      selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value]
    );

  return (
    <section className="rounded-3xl border border-pomegranate-100 bg-white/70 shadow-[0_1px_2px_rgba(89,62,70,0.04),0_12px_32px_-20px_rgba(89,62,70,0.18)] p-6 sm:p-8">
      <h2 className="font-serif text-2xl font-medium leading-tight text-pomegranate-900">
        Where my donations go
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        A fifth of the revenue your activity generates is split equally between
        the causes you choose here.
      </p>

      <div className="mt-4 space-y-3">
        {CHARITY_OPTIONS.map((opt) => (
          <ChoiceCard
            key={opt.value}
            icon={opt.icon}
            label={opt.label}
            desc={opt.summary}
            active={selected.includes(opt.value)}
            onClick={() => toggle(opt.value)}
          />
        ))}
        <ChoiceCard
          icon={Sparkles}
          label="All of the above"
          active={allSelected}
          onClick={() =>
            onChange(allSelected ? [] : CHARITY_OPTIONS.map((o) => o.value))
          }
        />
      </div>
    </section>
  );
}