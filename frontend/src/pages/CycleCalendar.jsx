import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { base44 } from "@/api/base44Client";
import AppHeader from "@/components/AppHeader";
import { useToast } from "@/components/ui/use-toast";
import PeriodHistoryCalendar from "@/components/calendar/PeriodHistoryCalendar";

export default function CycleCalendar() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadLogs = useCallback(
    () =>
      base44.auth
        .me()
        .then((me) =>
          base44.entities.CycleLog.filter(
            { created_by_id: me?.id },
            { sort: "-start_date", limit: 200 }
          )
        )
        .then((res) => setLogs(res.items))
        .finally(() => setLoading(false)),
    []
  );

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader maxWidth="max-w-3xl">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-pomegranate-600 hover:text-pomegranate-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to my dashboard
        </Link>
      </AppHeader>

      <main className="mx-auto max-w-3xl px-5 py-8 sm:px-8 sm:py-12">
        <h1 className="font-heading text-3xl font-semibold text-slate-800 sm:text-4xl">
          Log historical menstrual days
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Tap days you were menstruating to add them, or tap a logged day to
          remove it.
        </p>

        <div className="mt-6">
          {loading ? (
            <div className="h-64 animate-pulse rounded-3xl bg-white" />
          ) : (
            <PeriodHistoryCalendar
              logs={logs}
              onSaved={() => {
                loadLogs();
                toast({
                  title: "Calendar updated",
                  description:
                    "Your period days are saved. Head back to your cycle when you're ready.",
                });
              }}
            />
          )}
        </div>

        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-sm font-medium text-pomegranate-600 hover:text-pomegranate-700"
          >
            Back to my dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}