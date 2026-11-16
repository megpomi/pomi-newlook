import React from "react";
import { HeartHandshake } from "lucide-react";
import { charityLabel } from "@/lib/charities";

const TIERS = [
  {
    key: "free",
    label: "Free with ads",
    width: "20%",
    bar: "bg-pomegranate-200",
  },
  {
    key: "adfree",
    label: "Ad-free",
    width: "100%",
    bar: "bg-pomegranate-600",
  },
];

export default function DonationImpact({ charityInterests = [] }) {
  const causes = charityInterests.length
    ? charityInterests.map(charityLabel)
    : ["the causes you pick in your profile"];

  return (
    <div className="rounded-3xl border border-pomegranate-100 bg-white p-6">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-pomegranate-50 text-pomegranate-500">
          <HeartHandshake className="h-5 w-5" />
        </span>
        <h2 className="font-heading text-lg font-semibold text-slate-800">
          What your support sends to causes
        </h2>
      </div>

      <div className="mt-5 space-y-4">
        {TIERS.map((tier) => (
          <div key={tier.key}>
            <div className="text-sm font-medium text-slate-700">
              {tier.label}
            </div>
            <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-pomegranate-50">
              <div
                className={`h-full rounded-full ${tier.bar}`}
                style={{ width: tier.width }}
              />
            </div>
          </div>
        ))}
      </div>

      <p className="mt-5 text-sm leading-relaxed text-slate-500">
        Going ad-free increases the donations sent to the women's health causes
        you care about — and every penny is tracked for you.
      </p>

      <div className="mt-5 border-t border-pomegranate-100 pt-4">
        <p className="text-xs font-medium uppercase tracking-[0.14em] text-pomegranate-400">
          Your chosen causes
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {causes.map((cause) => (
            <span
              key={cause}
              className="rounded-full bg-pomegranate-50 px-3 py-1.5 text-xs font-medium text-pomegranate-700"
            >
              {cause}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}