import React from "react";
import { EyeOff, HeartHandshake, BarChart3, ShieldCheck } from "lucide-react";

const BENEFITS = [
  {
    icon: EyeOff,
    title: "No ads, ever",
    desc: "Your cycle pages stay calm and uninterrupted.",
  },
  {
    icon: HeartHandshake,
    title: "Increase your donation",
    desc: "Instead of ad revenue, your subscription funds the causes you chose.",
  },
  {
    icon: BarChart3,
    title: "Track your impact",
    desc: "See exactly how much your tracking has sent to each cause.",
  },
  {
    icon: ShieldCheck,
    title: "Cancel anytime",
    desc: "No lock-in. Your cycle data always stays yours.",
  },
];

export default function AdFreeBenefits() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {BENEFITS.map((b) => (
        <div
          key={b.title}
          className="rounded-2xl border border-pomegranate-100 bg-white p-4"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-pomegranate-50 text-pomegranate-500">
            <b.icon className="h-4 w-4" />
          </span>
          <h3 className="mt-3 text-sm font-semibold text-slate-800">
            {b.title}
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-slate-500">
            {b.desc}
          </p>
        </div>
      ))}
    </div>
  );
}