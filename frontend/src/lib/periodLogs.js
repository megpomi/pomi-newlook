// Keeps a user's period history in one shape: period days are stored as runs,
// so removing days splits a run and adding days extends the run next to them
// instead of creating a second entry for the same period.
import { base44 } from "@/api/base44Client";

const DAY = 86400000;

const parseDay = (value) => {
  if (typeof value === "string") {
    const [y, m, d] = value.split("-").map(Number);
    if (y && m && d) return new Date(y, m - 1, d);
  }
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
};

// yyyy-MM-dd, built from local parts so days never shift by a timezone offset.
export const toDayKey = (value) => {
  const date = parseDay(value);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
};

const daysBetween = (from, to) =>
  Math.round((parseDay(to) - parseDay(from)) / DAY);

// Every calendar day a period log covers.
export function logDayKeys(log) {
  const keys = [];
  const end = parseDay(log.end_date || log.start_date);
  for (let day = parseDay(log.start_date); day <= end; day.setDate(day.getDate() + 1)) {
    keys.push(toDayKey(day));
  }
  return keys;
}

// Groups days into runs of consecutive days only — every stored day is a day the
// user actually marked.
export function consecutiveRuns(keys) {
  const runs = [];
  [...keys].sort().forEach((key) => {
    const last = runs[runs.length - 1];
    if (last && daysBetween(last.end_date, key) === 1) last.end_date = key;
    else runs.push({ start_date: key, end_date: key });
  });
  return runs;
}

const detailsOf = (log) => {
  const details = {};
  ["flow_intensity", "mood", "symptoms", "notes"].forEach((field) => {
    if (log[field] !== undefined && log[field] !== null) details[field] = log[field];
  });
  return details;
};

// Removes days from this user's period logs. A run that loses days in the middle
// is split, keeping its flow, mood, symptoms and notes on every piece.
export async function deletePeriodDays(logs, removeKeys) {
  const remove = new Set(removeKeys);
  const result = [];

  for (const log of logs) {
    const keys = logDayKeys(log);
    if (!keys.some((key) => remove.has(key))) {
      result.push(log);
      continue;
    }

    const remaining = keys.filter((key) => !remove.has(key));
    if (!remaining.length) {
      await base44.entities.CycleLog.delete(log.id);
      continue;
    }

    const [first, ...rest] = consecutiveRuns(remaining);
    await base44.entities.CycleLog.update(log.id, {
      start_date: first.start_date,
      end_date: first.end_date,
    });
    result.push({ ...log, ...first });

    for (const run of rest) {
      const created = await base44.entities.CycleLog.create({
        ...detailsOf(log),
        ...run,
      });
      result.push(created);
    }
  }

  return result;
}

// Adds days to this user's history, extending a period that ends or starts right
// next to them rather than logging the same period twice.
export async function addPeriodDays(logs, addKeys) {
  const result = [...logs];

  for (const run of consecutiveRuns(addKeys)) {
    const index = result.findIndex((log) => isAdjacent(log, run));
    if (index === -1) {
      const created = await base44.entities.CycleLog.create({
        ...run,
        flow_intensity: "medium",
      });
      result.push(created);
      continue;
    }

    const log = result[index];
    const start =
      toDayKey(log.start_date) < run.start_date ? log.start_date : run.start_date;
    const logEnd = toDayKey(log.end_date || log.start_date);
    const end = logEnd > run.end_date ? log.end_date || log.start_date : run.end_date;

    await base44.entities.CycleLog.update(log.id, {
      start_date: start,
      end_date: end,
    });
    result[index] = { ...log, start_date: start, end_date: end };
  }

  return result;
}

// True when the new days touch or overlap an existing run.
function isAdjacent(log, run) {
  const logStart = toDayKey(log.start_date);
  const logEnd = toDayKey(log.end_date || log.start_date);
  const before = daysBetween(logEnd, run.start_date);
  const after = daysBetween(run.end_date, logStart);
  return (before >= 0 && before <= 1) || (after >= 0 && after <= 1);
}