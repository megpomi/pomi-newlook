import React from "react";

// A pomegranate dot marks every day that has a period logged, a symptom dot
// every day the daily check-in recorded a symptom on, and a dark purple one
// every day with a journal entry — a day can carry several.
export default function CalendarDay({ date, activeModifiers }) {
  const dots = [];
  if (activeModifiers.logged) dots.push("bg-pomegranate-600");
  if (activeModifiers.symptom) dots.push("bg-symptom");
  if (activeModifiers.journal) dots.push("bg-purple-800");

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <span>{date.getDate()}</span>
      {dots.length > 0 && (
        <span className="absolute bottom-1 left-1/2 flex -translate-x-1/2 items-center gap-0.5">
          {dots.map((color) => (
            <span
              key={color}
              className={`h-1.5 w-1.5 rounded-full ${
                activeModifiers.selected ? "bg-primary-foreground" : color
              }`}
            />
          ))}
        </span>
      )}
    </div>
  );
}