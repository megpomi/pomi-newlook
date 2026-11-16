import React from "react";
import { Heart, Sparkles } from "lucide-react";
import {
  AD_REVENUE_PER_VISIT,
  donationTotals,
} from "@/lib/donations";
import DonationCauses from "@/components/donations/DonationCauses";
import { currencyOf, formatMoney } from "@/lib/currency";
import useIsSubscriber from "@/hooks/use-is-subscriber";

export default function DonationTracker({ user }) {
  const money = (value) => formatMoney(value, currencyOf(user));
  const subscriber = useIsSubscriber();
  const totals = donationTotals(user, subscriber);
  const subscribed = totals.mode === "subscription";

  const countLabel = (count) =>
    subscribed
      ? `${count} ${count === 1 ? "day" : "days"} subscribed`
      : `${count} ${count === 1 ? "ad view" : "ad views"}`;

  const fromLabel = (revenue, count) =>
    `from ${money(revenue)} revenue · ${countLabel(count)}`;

  return (
    <div className="rounded-3xl border border-pomegranate-100 bg-white/70 shadow-[0_1px_2px_rgba(89,62,70,0.04),0_12px_32px_-20px_rgba(89,62,70,0.18)] p-6 sm:p-8">
      <div className="mb-1 flex items-center gap-2">
        <Heart className="h-4 w-4 fill-pomegranate-400 text-pomegranate-400" />
        <h2 className="font-serif text-2xl font-medium leading-tight text-pomegranate-900">
          Your donations
        </h2>
      </div>
      <p className="mb-5 text-sm text-slate-500">
        Track the growth of your donation pot. Revenue is earned from your
        engagement and is split equally between your chosen causes.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-2xl bg-pomegranate-50 p-5">
          <p className="text-xs uppercase tracking-wider text-pomegranate-500">
            This month
          </p>
          <p className="mt-1 font-serif text-4xl font-medium text-pomegranate-800">
            {money(totals.thisMonth)}
          </p>
          <p className="mt-1 text-xs text-pomegranate-600">
            {fromLabel(totals.thisMonthRevenue, totals.thisMonthCount)}
          </p>
        </div>

        <div className="rounded-2xl bg-pomegranate-800 p-5 text-white">
          <p className="text-xs uppercase tracking-wider text-white/80">
            All time
          </p>
          <p className="mt-1 font-serif text-4xl font-medium">
            {money(totals.allTime)}
          </p>
          <p className="mt-1 text-xs text-white/80">
            {fromLabel(totals.allTimeRevenue, totals.allTimeCount)}
          </p>
        </div>
      </div>

      <DonationCauses user={user} pot={totals.allTime} />

      {!subscribed && (
        <p className="mt-5 flex items-center gap-1.5 text-xs text-slate-400">
          <Sparkles className="h-3.5 w-3.5 text-pomegranate-400" />
          {`${money(AD_REVENUE_PER_VISIT)} of ad revenue per visit — go ad-free to donate more`}
        </p>
      )}
    </div>
  );
}