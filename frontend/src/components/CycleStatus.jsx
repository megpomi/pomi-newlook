import React from "react";
import { Droplet, CalendarHeart, Sparkles } from "lucide-react";
import { getCurrentPhase, phaseLabel } from "@/lib/cycle";

const PHASE_COPY = {
  period: {
    title: "On your period",
    sub: "Be gentle with yourself today.",
    color: "text-pomegranate-500",
    ring: "#b7888f",
  },
  follicular: {
    title: "Follicular phase",
    sub: "Energy returning — a good week to start things.",
    color: "text-amber-500",
    ring: "#f59e0b",
  },
  ovulation: {
    title: "Ovulation",
    sub: "Peak energy and focus.",
    color: "text-emerald-500",
    ring: "#10b981",
  },
  luteal: {
    title: "Luteal phase",
    sub: "Wind down — rest and reflect.",
    color: "text-pomegranate-700",
    ring: "#875c66",
  },
  unknown: {
    title: "Welcome to Pomi",
    sub: "Log your first period above to start tracking.",
    color: "text-pomegranate-500",
    ring: "#b7888f",
  },
};

export default function CycleStatus({ logs }) {
  const status = getCurrentPhase(logs);
  const meta = PHASE_COPY[status.phase] || PHASE_COPY.unknown;

  const progress =
    status.dayOfCycle != null
      ? Math.min(100, Math.round((status.dayOfCycle / status.avgCycle) * 100))
      : 0;

  const radius = 78;
  const circ = 2 * Math.PI * radius;
  const dash = (progress / 100) * circ;

  const fmtDate = (d) =>
    d
      ? new Date(d).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        })
      : "—";

  return (
    <div className="relative overflow-hidden rounded-3xl border border-pomegranate-100 bg-white/70 shadow-[0_1px_2px_rgba(89,62,70,0.04),0_12px_32px_-20px_rgba(89,62,70,0.18)] p-8 sm:p-10">
      <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="order-2 sm:order-1">
          <div className="mb-2 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-pomegranate-400" />
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-pomegranate-400">
              {phaseLabel(status.phase)}
            </span>
          </div>
          <h2 className="font-serif text-[2.25rem] font-medium leading-[1.1] text-pomegranate-900 sm:text-5xl">
            {meta.title}
          </h2>
          <p className="mt-2 max-w-xs text-sm text-slate-500">{meta.sub}</p>

          {status.phase !== "unknown" && (
            <div className="mt-6 flex flex-wrap gap-6">
              <Stat
                icon={<Droplet className="h-4 w-4" />}
                label="Cycle day"
                value={status.dayOfCycle}
              />
              <Stat
                icon={<CalendarHeart className="h-4 w-4" />}
                label="Next period"
                value={
                  status.daysUntilNext <= 0
                    ? "Any day"
                    : `in ${status.daysUntilNext}d`
                }
                hint={fmtDate(status.nextStart)}
              />
            </div>
          )}


        </div>

        <div className="order-1 sm:order-2">
          <div className="relative h-44 w-44">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 180 180">
              <circle
                cx="90"
                cy="90"
                r={radius}
                fill="none"
                stroke="#e2c9cd"
                strokeWidth="10"
              />
              <circle
                cx="90"
                cy="90"
                r={radius}
                fill="none"
                stroke={meta.ring}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={`${dash} ${circ}`}
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {status.phase !== "unknown" ? (
                <>
                  <span className="font-serif text-5xl font-medium text-pomegranate-900">
                    {status.dayOfCycle}
                  </span>
                  <span className="text-xs uppercase tracking-widest text-slate-400">
                    day of cycle
                  </span>
                </>
              ) : (
                <Droplet className="h-10 w-10 text-pomegranate-300" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon, label, value, hint }) {
  return (
    <div>
      <div className="mb-1 flex items-center gap-1.5 text-slate-400">
        {icon}
        <span className="text-xs uppercase tracking-wider">{label}</span>
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="font-serif text-2xl font-medium text-pomegranate-900">
          {value}
        </span>
        {hint && <span className="text-xs text-slate-400">{hint}</span>}
      </div>
    </div>
  );
}