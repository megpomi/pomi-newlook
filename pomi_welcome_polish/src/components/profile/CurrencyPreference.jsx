import React from "react";
import { CURRENCIES } from "@/lib/currency";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CurrencyPreference({ value, onChange }) {
  return (
    <section className="rounded-3xl border border-pomegranate-100 bg-white/70 shadow-[0_1px_2px_rgba(89,62,70,0.04),0_12px_32px_-20px_rgba(89,62,70,0.18)] p-6 sm:p-8">
      <h2 className="font-serif text-2xl font-medium leading-tight text-pomegranate-900">
        Currency
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        The currency your donation totals and cause shares are shown in.
      </p>

      <div className="mt-4 max-w-xs">
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className="rounded-xl border-slate-200">
            <SelectValue placeholder="Choose a currency" />
          </SelectTrigger>
          <SelectContent>
            {CURRENCIES.map((c) => (
              <SelectItem key={c.code} value={c.code}>
                {c.symbol} · {c.label} ({c.code})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </section>
  );
}