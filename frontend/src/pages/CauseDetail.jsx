import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Heart } from "lucide-react";
import { base44 } from "@/api/base44Client";
import AppHeader from "@/components/AppHeader";
import { charityByValue } from "@/lib/charities";
import { donationTotals, splitByCause } from "@/lib/donations";
import { currencyOf, formatMoney } from "@/lib/currency";
import useIsSubscriber from "@/hooks/use-is-subscriber";

export default function CauseDetail() {
  const { causeValue } = useParams();
  const cause = charityByValue(causeValue);
  const [user, setUser] = useState(null);
  const subscriber = useIsSubscriber();

  useEffect(() => {
    base44.auth
      .me()
      .then((u) => setUser(u || null))
      .catch(() => setUser(null));
  }, []);

  if (!cause) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background px-6 text-center">
        <p className="font-heading text-xl font-semibold text-slate-700">
          We couldn't find that cause.
        </p>
        <Link
          to="/"
          className="text-sm font-medium text-pomegranate-600 hover:text-pomegranate-700"
        >
          Back to my dashboard
        </Link>
      </div>
    );
  }

  const Icon = cause.icon;
  const money = (value) => formatMoney(value, currencyOf(user));
  const totals = donationTotals(user, subscriber);
  const shareFor = (pot) =>
    splitByCause(user, pot).find((s) => s.value === cause.value)?.amount;
  const allTime = shareFor(totals.allTime);
  const thisMonth = shareFor(totals.thisMonth);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader maxWidth="max-w-3xl">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-pomegranate-600 hover:text-pomegranate-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to my dashboard
        </Link>
      </AppHeader>

      <main className="mx-auto max-w-3xl px-5 py-8 sm:px-8 sm:py-12">
        <div className="flex items-start gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-pomegranate-100 text-pomegranate-600">
            <Icon className="h-7 w-7" />
          </span>
          <div>
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-pomegranate-400">
              Your cause
            </span>
            <h1 className="mt-1 font-heading text-2xl font-semibold text-slate-800 sm:text-3xl">
              {cause.label}
            </h1>
            <p className="mt-2 text-sm text-slate-500">{cause.summary}</p>
            <div className="mt-3 space-y-1.5">
              {cause.partners.map((partner) => (
                <a
                  key={partner.website}
                  href={partner.website}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-sm font-medium text-pomegranate-600 hover:text-pomegranate-700"
                >
                  Visit {partner.name}
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {allTime != null && (
          <div className="mt-8 rounded-3xl border border-pomegranate-100 bg-pomegranate-50 p-6 sm:p-8">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 fill-pomegranate-400 text-pomegranate-400" />
              <span className="text-xs font-medium uppercase tracking-wider text-pomegranate-500">
                Your donation to this cause
              </span>
            </div>
            <p className="mt-2 font-heading text-4xl font-semibold text-pomegranate-700">
              {money(allTime)}
            </p>
            <p className="mt-1 text-sm text-pomegranate-600">
              {money(thisMonth)} of that this month
            </p>
          </div>
        )}

        <div className="mt-8 rounded-3xl border border-slate-100 bg-white p-6 sm:p-8">
          <h2 className="font-heading text-lg font-semibold text-slate-800">
            Why it matters
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            {cause.about}
          </p>
        </div>

        <div className="mt-6 rounded-3xl border border-slate-100 bg-white p-6 sm:p-8">
          <h2 className="font-heading text-lg font-semibold text-slate-800">
            What your donations fund
          </h2>
          <ul className="mt-3 space-y-3">
            {cause.impact.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-pomegranate-400" />
                <span className="text-sm leading-relaxed text-slate-600">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-8 text-center text-xs text-slate-400">
          20% of the revenue your Pomi activity generates goes into your donation
          pot, split equally between the causes you chose.
        </p>
      </main>
    </div>
  );
}