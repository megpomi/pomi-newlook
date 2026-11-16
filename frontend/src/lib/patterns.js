// Patterns are read one month at a time: the present month by default, with the
// stepper moving back through earlier ones. Everything here is derived from the
// logs the user already has, so nothing extra is stored.

import { prettySymptom } from "@/lib/dailyLog";

export const MOOD_SCORE = {
  devastated: 1,
  anxious: 1,
  low: 2,
  okay: 3,
  good: 4,
  great: 5,
};
export const MOOD_WORD = {
  1: "Anxious",
  2: "Low",
  3: "Okay",
  4: "Good",
  5: "Great",
};

export const startOfMonth = (date) =>
  new Date(date.getFullYear(), date.getMonth(), 1);

const monthKey = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

export const shiftMonth = (date, delta) =>
  new Date(date.getFullYear(), date.getMonth() + delta, 1);

export const formatMonth = (date) =>
  date.toLocaleDateString(undefined, { month: "long", year: "numeric" });

// The axis shows the day of the month only, so it reads the same whichever
// month is open; the full date stays in the hover tooltip.
const dayLabel = (key) => String(Number(key.slice(8, 10)));

const dayTitle = (key) =>
  new Date(`${key}T00:00:00`).toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

// One point per day the user logged something in that month — a period day or a
// daily check-in — oldest to newest.
export function monthSeries(logs, dailyLogs, month) {
  const key = monthKey(month);
  const byDay = new Map();

  const add = (date, mood, symptoms) => {
    const day = String(date || "").slice(0, 10);
    if (!day.startsWith(key)) return;
    const current = byDay.get(day) || { mood: null, symptoms: 0 };
    byDay.set(day, {
      mood: MOOD_SCORE[mood] ?? current.mood,
      symptoms: Math.max(current.symptoms, symptoms),
    });
  };

  logs.forEach((log) =>
    add(log.start_date, log.mood, log.symptoms?.length || 0)
  );
  dailyLogs.forEach((entry) =>
    add(entry.date, entry.mood, entry.symptoms?.length || 0)
  );

  return [...byDay.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([day, entry]) => ({
      label: dayLabel(day),
      title: dayTitle(day),
      ...entry,
    }));
}

// How often each symptom was logged that month, busiest first, as the tiles the
// user reads instead of a chart.
export function symptomBreakdown(logs, dailyLogs, month) {
  const key = monthKey(month);
  const counts = new Map();

  const collect = (date, symptoms) => {
    if (!String(date || "").startsWith(key)) return;
    (symptoms || []).forEach((symptom) =>
      counts.set(symptom, (counts.get(symptom) || 0) + 1)
    );
  };

  logs.forEach((log) => collect(log.start_date, log.symptoms));
  dailyLogs.forEach((entry) => collect(entry.date, entry.symptoms));

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([symptom, count]) => ({
      key: symptom,
      label: prettySymptom(symptom),
      count,
    }));
}

// The days of that month carrying a symptom dot in the calendar — a daily
// check-in that recorded at least one symptom.
export function symptomDayCount(dailyLogs, month) {
  const key = monthKey(month);
  return dailyLogs.filter(
    (entry) =>
      String(entry.date || "").startsWith(key) && entry.symptoms?.length > 0
  ).length;
}

// The headline numbers for the month: symptoms logged and the mood reported
// most often.
export function summarise(series) {
  const moods = series.map((day) => day.mood).filter(Boolean);
  const counts = moods.reduce(
    (acc, mood) => ({ ...acc, [mood]: (acc[mood] || 0) + 1 }),
    {}
  );
  const topMood = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];

  return {
    symptoms: series.reduce((total, day) => total + day.symptoms, 0),
    mood: topMood ? MOOD_WORD[topMood] : null,
  };
}