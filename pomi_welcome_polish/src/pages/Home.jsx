import React, { useState, useEffect, useCallback } from "react";
import PomiLoader from "@/components/PomiLoader";
import { format } from "date-fns";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { CalendarPlus, Plus, Sparkles, UserRound } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import AppHeader from "@/components/AppHeader";
import CycleStatus from "@/components/CycleStatus";
import CycleStats from "@/components/dashboard/CycleStats";
import CalendarPanel from "@/components/calendar/CalendarPanel";
import CharityImpact from "@/components/CharityImpact";
import CyclePatterns from "@/components/patterns/CyclePatterns";
import DonationTracker from "@/components/DonationTracker";
import { recordAdVisit } from "@/lib/donations";
import ReminderBanner from "@/components/reminders/ReminderBanner";
import JournalPrompt from "@/components/journal/JournalPrompt";
import ReminderBell from "@/components/reminders/ReminderBell";
import { useReminders } from "@/hooks/use-reminders";
import useIsSubscriber from "@/hooks/use-is-subscriber";

// Reminders that are about logging a period still open the calendar.
const PERIOD_REMINDERS = ["first_log", "period_due"];

export default function Home() {
  const [logs, setLogs] = useState([]);
  const [dailyLogs, setDailyLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkingProfile, setCheckingProfile] = useState(true);
  const [user, setUser] = useState(null);
  const { toast } = useToast();
  const { reminders, dismiss } = useReminders(logs, dailyLogs);
  const navigate = useNavigate();
  const goToLogPeriod = () => navigate("/calendar?log=1");
  const hasHistory = logs.length > 0;

  // Until there's any history, logging starts the historical entry flow. Once
  // history exists it opens the daily check-in for today, and the historical
  // entry page is reached from the calendar instead.
  const openLogger = () =>
    navigate(hasHistory ? "/log-today" : "/calendar?log=1");

  const openFromReminder = (reminder) =>
    PERIOD_REMINDERS.includes(reminder?.id) ? goToLogPeriod() : openLogger();

  const loadLogs = useCallback(async () => {
    setLoading(true);
    try {
      // Only the signed-in person's own logs: admins can read every user's
      // records, and another account's entry would skew the stats.
      const me = await base44.auth.me();
      const owner = { created_by_id: me?.id };
      const [cycles, dailies] = await Promise.all([
        base44.entities.CycleLog.filter(owner, {
          sort: "-start_date",
          limit: 100,
        }),
        base44.entities.DailyLog.filter(owner, {
          sort: "-date",
          limit: 200,
        }),
      ]);
      setLogs(cycles.items);
      setDailyLogs(dailies.items);
    } catch (e) {
      toast({
        title: "Couldn't load your cycles",
        description: e?.message || "Please try again shortly.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  const subscriber = useIsSubscriber();

  useEffect(() => {
    // Wait for the server's ad-free answer, so a subscriber's visit is never logged as an ad view.
    if (subscriber === null) return;
    base44.auth
      .me()
      .then((u) => (u ? recordAdVisit(u, subscriber) : u))
      .then((u) => setUser(u || null))
      .catch(() => setUser(null))
      .finally(() => setCheckingProfile(false));
  }, [subscriber]);

  // The name given during onboarding greets them here; accounts made another way
  // fall back to the first word of their account name.
  const firstName = (user?.preferred_name || user?.full_name || "")
    .trim()
    .split(/\s+/)[0];

  // People tracking general wellbeing get a daily journalling prompt instead of
  // cycle-only framing at the top of their dashboard.
  const tracking = user?.tracking_focus || [];
  const tracksWellbeing = tracking.includes("general_wellbeing");
  const tracksCycles = tracking.includes("menstrual_cycles");

  if (checkingProfile) {
    return (
      <PomiLoader />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <AppHeader>
        <ReminderBell
          reminders={reminders}
          onDismiss={dismiss}
          onLogPeriod={openFromReminder}
        />
        <Button
          asChild
          variant="ghost"
          size="icon"
          className="rounded-full text-pomegranate-700 hover:bg-pomegranate-50 hover:text-pomegranate-800"
        >
          <Link to="/profile" aria-label="Your profile">
            <UserRound className="h-5 w-5" />
          </Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className="rounded-full border-pomegranate-200 bg-transparent text-pomegranate-700 hover:bg-pomegranate-50 hover:text-pomegranate-800 px-4"
        >
          <Link to="/upgrade" aria-label="Go ad-free">
            <Sparkles className="mr-1.5 h-4 w-4" />
            <span className="hidden sm:inline">Go ad-free</span>
          </Link>
        </Button>
        <Button
          onClick={openLogger}
          className="rounded-full bg-pomegranate-700 px-4 font-medium text-white shadow-[0_8px_20px_-12px_rgba(109,75,84,0.55)] transition-colors hover:bg-pomegranate-800"
        >
          <Plus className="mr-1.5 h-4 w-4" />
          {hasHistory ? "Log today" : "Log period"}
        </Button>
      </AppHeader>

      <main className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-16">
        {/* Greeting */}
        <div className="mb-10">
          <h1 className="font-serif text-[2.5rem] font-medium leading-[1.1] tracking-[-0.01em] text-pomegranate-900 sm:text-[3.25rem]">
            Hello{firstName ? `, ${firstName}` : logs.length ? "" : ", welcome"}
          </h1>
          <p className="mt-3 text-[0.9375rem] leading-relaxed text-slate-600">
            {tracksWellbeing && !tracksCycles
              ? "Here's your space to check in with yourself today."
              : logs.length
              ? "Here's where you are in your cycle today."
              : "Let's start tracking your cycle — and giving back."}
          </p>
        </div>

        {/* Reminder */}
        {reminders.length > 0 && (
          <ReminderBanner
            reminder={reminders[0]}
            onDismiss={dismiss}
            onLogPeriod={openFromReminder}
          />
        )}

        {/* Daily journalling prompt for general wellbeing tracking */}
        {tracksWellbeing && (
          <div className="mb-6">
            <JournalPrompt dateKey={format(new Date(), "yyyy-MM-dd")} />
          </div>
        )}

        {/* Status */}
        <CycleStatus logs={logs} />

        {/* Stats */}
        <div className="mt-6">
          <CycleStats logs={logs} />
        </div>

        {/* Grid */}
        <div className="mt-6 grid gap-6 lg:grid-cols-5">
          <div className="space-y-6 lg:col-span-3">
            <CalendarPanel
              logs={logs}
              dailyLogs={dailyLogs}
              loading={loading}
              showJournal={tracksWellbeing}
              title="Your calendar"
              onChanged={loadLogs}
              action={
                tracksCycles && (
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="rounded-full border-pomegranate-200 bg-transparent text-pomegranate-700 hover:bg-pomegranate-50 hover:text-pomegranate-800"
                  >
                    <Link to="/calendar?log=1">
                      <CalendarPlus className="mr-1.5 h-4 w-4" />
                      Log historical menstrual days
                    </Link>
                  </Button>
                )
              }
            />

            <CyclePatterns logs={logs} dailyLogs={dailyLogs} />
          </div>
          <div className="lg:col-span-2">
            <CharityImpact />
          </div>
        </div>

        {/* Donations */}
        <div className="mt-6">
          <DonationTracker user={user} />
        </div>

        <p className="mt-14 text-center text-xs leading-relaxed text-slate-400">
          Pomi is not a medical device. For health concerns, please consult a
          healthcare professional.
        </p>
      </main>
    </div>
  );
}