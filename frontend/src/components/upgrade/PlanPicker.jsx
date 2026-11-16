import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

const PLANS = {
  monthly: { price: "£3.99", cadence: "billed monthly", saving: null },
  yearly: { price: "£34.99", cadence: "billed yearly", saving: "Save 27%" },
};

export default function PlanPicker({ onSubscribe, disabled, loading }) {
  const [cadence, setCadence] = useState("yearly");
  const plan = PLANS[cadence];

  return (
    <div className="rounded-3xl border border-pomegranate-200 bg-white p-6">
      <div className="flex rounded-full bg-pomegranate-50 p-1">
        {Object.keys(PLANS).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setCadence(key)}
            className={`flex-1 rounded-full py-2 text-sm font-medium capitalize transition ${
              cadence === key
                ? "bg-white text-pomegranate-700 shadow-sm"
                : "text-pomegranate-500 hover:text-pomegranate-700"
            }`}
          >
            {key}
          </button>
        ))}
      </div>

      <div className="mt-5 flex items-end justify-between">
        <div>
          <p className="font-heading text-3xl font-semibold text-slate-800">
            {plan.price}
          </p>
          <p className="mt-1 text-sm text-slate-500">{plan.cadence}</p>
        </div>
        {plan.saving && (
          <span className="rounded-full bg-pomegranate-600 px-3 py-1 text-xs font-medium text-white">
            {plan.saving}
          </span>
        )}
      </div>

      <Button
        onClick={() => onSubscribe(cadence)}
        disabled={disabled || loading}
        className="mt-5 w-full rounded-full bg-pomegranate-600 py-6 text-base hover:bg-pomegranate-700"
      >
        <Sparkles className="mr-2 h-4 w-4" />
        {loading ? "Starting…" : "Start ad-free"}
      </Button>

      <p className="mt-3 text-center text-xs text-slate-400">
        Cancel anytime. Your cycle data stays yours.
      </p>
    </div>
  );
}