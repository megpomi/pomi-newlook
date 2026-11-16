import { getCurrentPhase } from "@/lib/cycle";

// Cycle reminders — pure functions. Each reminder is derived from the logs the
// user already has, so nothing has to be stored or scheduled.

const DAY = 86400000;

export const dayKey = (date = new Date()) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(
    date.getDate()
  ).padStart(2, "0")}`;

const startOfDay = (value) => {
  if (typeof value === "string") {
    const [y, m, d] = value.split("-").map(Number);
    if (y && m && d) return new Date(y, m - 1, d);
  }
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
};

const daysBetween = (from, to) => Math.round((to - from) / DAY);

export function buildReminders(logs = [], dailyLogs = []) {
  const today = startOfDay(new Date());
  const phase = getCurrentPhase(logs);

  if (!logs.length) {
    return [
      {
        id: "first_log",
        tone: "due",
        title: "Log your first period",
        body: "Pomi learns your cycle from what you log. One entry is enough to start predicting what's next.",
        cta: "Log period",
      },
    ];
  }

  const loggedToday = logs.some((log) => {
    const start = startOfDay(log.start_date);
    const end = log.end_date ? startOfDay(log.end_date) : start;
    return start <= today && today <= end;
  });

  // The daily check-in counts as a log too: logging symptoms is logging data.
  const checkedInToday = dailyLogs.some(
    (entry) => String(entry.date).slice(0, 10) === dayKey(today)
  );
  const loggedSomethingToday = loggedToday || checkedInToday;

  const reminders = [];

  if (phase.phase === "period" && !loggedToday) {
    reminders.push({
      id: "log_today",
      tone: "due",
      title: "How's your flow today?",
      body: `You're on day ${phase.dayOfCycle} of your period. Logging today keeps your pattern — and your impact — accurate.`,
      cta: "Log today",
    });
  }

  if (
    phase.daysUntilNext != null &&
    phase.daysUntilNext <= 2 &&
    phase.phase !== "period" &&
    !loggedToday
  ) {
    const late = phase.daysUntilNext <= -2 ? -phase.daysUntilNext : 0;
    reminders.push({
      id: "period_due",
      tone: "due",
      title: late
        ? `Your period is ${late} days later than predicted`
        : phase.daysUntilNext <= 0
        ? "Your period is due"
        : `Your period is due in ${phase.daysUntilNext} day${
            phase.daysUntilNext === 1 ? "" : "s"
          }`,
      body: "Log the first day as soon as it starts — that's what keeps your next prediction on track.",
      cta: "Log period",
    });
  }

  // Any log counts as activity: a period entry, or a daily check-in on mood or
  // symptoms. The counter resets to the most recent of the two.
  const lastLogged = [
    ...logs.map((log) => startOfDay(log.end_date || log.start_date)),
    ...dailyLogs.map((entry) => startOfDay(entry.date)),
  ].reduce((latest, date) => (!latest || date > latest ? date : latest), null);
  const daysSinceLog = lastLogged ? daysBetween(lastLogged, today) : 0;

  // Shown every day the user hasn't logged anything, counting from the most
  // recent period entry or daily check-in.
  if (daysSinceLog >= 1 && !loggedSomethingToday) {
    reminders.push({
      id: "check_in",
      tone: "info",
      title: `It's been ${daysSinceLog} day${
        daysSinceLog === 1 ? "" : "s"
      } since your last log`,
      body: "A quick check-in on mood or symptoms keeps your patterns — and your impact tracking — consistent.",
      cta: "Log today",
    });
  }

  if (loggedSomethingToday) {
    reminders.push({
      id: "logged_today",
      tone: "info",
      title: "Thanks for logging today",
      body: "Your entry is saved — it keeps your patterns and your impact up to date.",
    });
  }

  return reminders;
}