import React from "react";
import { resetPreview } from "@/api/base44Client";

export default function Home() {
  return (
    <div data-testid="preview-onboarding-complete" className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center text-slate-600">
      <p>Onboarding finished. In the real app, the dashboard opens here (not part of this preview).</p>
      <button
        data-testid="preview-start-over-button"
        onClick={() => { resetPreview(); window.location.href = "/"; }}
        className="rounded-full border border-pomegranate-300 px-5 py-2 text-pomegranate-700"
      >
        Start over
      </button>
    </div>
  );
}
