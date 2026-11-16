// Cycle prediction helpers — pure functions shared across components.

export function computeCycleStats(logs) {
  const sorted = [...logs].sort(
    (a, b) => new Date(a.start_date) - new Date(b.start_date)
  );

  const cycleLengths = [];
  for (let i = 1; i < sorted.length; i++) {
    const diff =
      (new Date(sorted[i].start_date) - new Date(sorted[i - 1].start_date)) /
      86400000;
    if (diff > 10 && diff < 60) cycleLengths.push(diff);
  }
  const avgCycle = cycleLengths.length
    ? Math.round(cycleLengths.reduce((a, b) => a + b, 0) / cycleLengths.length)
    : 28;

  const periodLengths = sorted
    .filter((l) => l.end_date)
    .map(
      (l) => (new Date(l.end_date) - new Date(l.start_date)) / 86400000 + 1
    );
  const avgPeriod = periodLengths.length
    ? Math.round(periodLengths.reduce((a, b) => a + b, 0) / periodLengths.length)
    : 5;

  return { sorted, cycleLengths, periodLengths, avgCycle, avgPeriod };
}

// Summary of the logged history: the most recent completed cycle length, the
// most recent period length, and the range cycle lengths have fallen in.
export function getCycleStats(logs) {
  const { sorted, cycleLengths, periodLengths } = computeCycleStats(logs);

  const round = (value) => (value == null ? null : Math.round(value));

  return {
    lastCycleLength: round(cycleLengths[cycleLengths.length - 1]),
    lastPeriodLength: round(periodLengths[periodLengths.length - 1]),
    minCycle: cycleLengths.length ? round(Math.min(...cycleLengths)) : null,
    maxCycle: cycleLengths.length ? round(Math.max(...cycleLengths)) : null,
    cycleCount: cycleLengths.length,
    hasHistory: sorted.length > 1,
  };
}

export function getCurrentPhase(logs) {
  const { sorted, avgCycle, avgPeriod } = computeCycleStats(logs);
  if (!sorted.length)
    return { phase: "unknown", avgCycle, avgPeriod, dayOfCycle: null };

  const last = sorted[sorted.length - 1];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const lastStart = new Date(last.start_date);
  lastStart.setHours(0, 0, 0, 0);

  const dayOfCycle = Math.floor((today - lastStart) / 86400000) + 1;
  if (dayOfCycle < 0)
    return { phase: "unknown", avgCycle, avgPeriod, dayOfCycle: null };

  const onPeriod = dayOfCycle <= avgPeriod;
  const nextStart = new Date(lastStart);
  nextStart.setDate(nextStart.getDate() + avgCycle);
  const daysUntilNext = Math.round((nextStart - today) / 86400000);

  // Ovulation sits mid-cycle, roughly 12–16 days before the next period is due,
  // and the days after it — closer to that next start — are the luteal phase.
  let phase = "follicular";
  if (onPeriod) phase = "period";
  else if (daysUntilNext < 12) phase = "luteal";
  else if (daysUntilNext <= 16) phase = "ovulation";

  return {
    phase,
    onPeriod,
    dayOfCycle,
    daysUntilNext,
    nextStart,
    lastStart,
    avgCycle,
    avgPeriod,
  };
}

// Groups selected bleeding days (yyyy-MM-dd strings) into period runs.
// Consecutive days — and days separated by a single unmarked day — belong to
// the same run.
export function groupBleedingDays(dates) {
  const runs = [];
  [...dates].sort().forEach((date) => {
    const last = runs[runs.length - 1];
    if (last && (new Date(date) - new Date(last.end_date)) / 86400000 <= 2) {
      last.end_date = date;
      return;
    }
    runs.push({ start_date: date, end_date: date });
  });
  return runs;
}

// Cycle day for a date: days since the most recent period start on or before it.
export function getCycleDay(logs, date) {
  const day = toLocalDay(date);
  const starts = (logs || [])
    .map((l) => toLocalDay(l.start_date))
    .filter((d) => d <= day)
    .sort((a, b) => b - a);
  if (!starts.length) return null;
  return Math.round((day - starts[0]) / 86400000) + 1;
}

// Date-only strings ("yyyy-MM-dd") parsed as local midnight, so day counts
// never shift by a timezone offset.
function toLocalDay(value) {
  if (typeof value === "string") {
    const [y, m, d] = value.split("-").map(Number);
    if (y && m && d) return new Date(y, m - 1, d);
  }
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
}

export function phaseLabel(phase) {
  return {
    period: "Menstrual",
    follicular: "Follicular",
    ovulation: "Ovulation",
    luteal: "Luteal",
    unknown: "—",
  }[phase] || "—";
}