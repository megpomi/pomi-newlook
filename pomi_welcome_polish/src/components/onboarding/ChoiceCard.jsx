import React from "react";
import { Check } from "lucide-react";

export default function ChoiceCard({ icon: Icon, label, desc, active, onClick, comingSoon }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-4 rounded-2xl border px-5 py-4 text-left transition-[background-color,border-color,box-shadow] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pomegranate-300 ${
        active
          ? "border-pomegranate-400 bg-pomegranate-50 shadow-[0_8px_24px_-18px_rgba(89,62,70,0.35)]"
          : "border-pomegranate-100 bg-white/70 hover:border-pomegranate-200 hover:bg-white"
      }`}
    >
      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ring-1 transition-colors ${
          active
            ? "bg-pomegranate-700 text-white ring-pomegranate-700"
            : "bg-pomegranate-50 text-pomegranate-600 ring-pomegranate-100"
        }`}
      >
        <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
      </span>
      <span className="flex-1">
        <span className="flex flex-wrap items-center gap-2">
          <span className="text-[0.9375rem] font-medium text-slate-800">{label}</span>
          {comingSoon && (
            <span className="rounded-full border border-pomegranate-200 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-pomegranate-600">
              Coming soon
            </span>
          )}
        </span>
        {desc && (
          <span className="mt-1 block text-sm leading-relaxed text-slate-500">{desc}</span>
        )}
      </span>
      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
          active
            ? "border-pomegranate-700 bg-pomegranate-700 text-white"
            : "border-pomegranate-200"
        }`}
      >
        {active && <Check className="h-3 w-3" strokeWidth={2.5} />}
      </span>
    </button>
  );
}