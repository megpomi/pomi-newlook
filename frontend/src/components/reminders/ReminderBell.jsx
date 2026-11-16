import React from "react";
import { Bell, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

export default function ReminderBell({ reminders, onDismiss, onLogPeriod }) {
  const count = reminders.length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Reminders"
          className="relative rounded-full text-pomegranate-600 hover:bg-pomegranate-50"
        >
          <Bell className="h-5 w-5" />
          {count > 0 && (
            <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-pomegranate-600 px-1 text-[10px] font-semibold text-white">
              {count}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        className="w-80 rounded-2xl border-pomegranate-100 p-4"
      >
        <div className="mb-3 flex items-center justify-between">
          <p className="font-heading text-sm font-semibold text-slate-800">
            Reminders
          </p>
          <span className="text-xs text-slate-400">
            {count ? `${count} to review` : "All caught up"}
          </span>
        </div>

        {count === 0 ? (
          <p className="text-sm text-slate-500">
            Nothing to do right now — your log is up to date.
          </p>
        ) : (
          <ul className="space-y-3">
            {reminders.map((reminder) => (
              <li
                key={reminder.id}
                className="rounded-xl border border-slate-100 p-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-slate-700">
                    {reminder.title}
                  </p>
                  <button
                    onClick={() => onDismiss(reminder.id)}
                    aria-label="Dismiss reminder"
                    className="text-slate-300 transition-colors hover:text-slate-500"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                  {reminder.body}
                </p>
                {reminder.cta && (
                  <Button
                    size="sm"
                    onClick={() => onLogPeriod(reminder)}
                    className="mt-2.5 h-7 rounded-full bg-pomegranate-600 px-3 text-xs hover:bg-pomegranate-700"
                  >
                    {reminder.cta}
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </PopoverContent>
    </Popover>
  );
}