import React from "react";

export default function StepProgress({ step, total }) {
  return (
    <div
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={step}
      aria-label={`Step ${step} of ${total}`}
      data-testid="onboarding-progress"
      className="mt-3 h-[3px] w-28 overflow-hidden rounded-full bg-pomegranate-100"
    >
      <div
        className="h-full rounded-full bg-pomegranate-500 transition-[width] duration-500 ease-out"
        style={{ width: `${(step / total) * 100}%` }}
      />
    </div>
  );
}
