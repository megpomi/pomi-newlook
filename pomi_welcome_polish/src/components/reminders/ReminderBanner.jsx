import React from "react";
import { Bell, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const TONES = {
  due: {
    wrap: "border-pomegranate-200 bg-pomegranate-50",
    iconWrap: "bg-pomegranate-100",
    icon: "text-pomegranate-600",
  },
  info: {
    wrap: "border-pomegranate-100 bg-white/70",
    iconWrap: "bg-pomegranate-50 ring-1 ring-pomegranate-100",
    icon: "text-pomegranate-600",
  },
};

export default function ReminderBanner({
  reminder,
  onDismiss,
  onLogPeriod,
}) {
  if (!reminder) return null;
  const tone = TONES[reminder.tone] || TONES.info;

  return (
    <div
      className={cn(
        "mb-6 flex items-start gap-4 rounded-2xl border p-4 sm:p-5",
        tone.wrap
      )}
    >
      <span
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
          tone.iconWrap
        )}
      >
        <Bell className={cn("h-5 w-5", tone.icon)} />
      </span>

      <div className="flex-1">
        <p className="text-sm font-medium text-slate-800 sm:text-base">
          {reminder.title}
        </p>
        <p className="mt-0.5 text-sm text-slate-500">{reminder.body}</p>
        {reminder.cta && (
          <Button
            size="sm"
            onClick={() => onLogPeriod(reminder)}
            className="mt-3 h-9 rounded-full bg-pomegranate-700 px-4 text-xs font-medium text-white hover:bg-pomegranate-800"
          >
            {reminder.cta}
          </Button>
        )}
      </div>

      <button
        onClick={() => onDismiss(reminder.id)}
        aria-label="Dismiss reminder"
        className="text-slate-300 transition-colors hover:text-slate-500"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}