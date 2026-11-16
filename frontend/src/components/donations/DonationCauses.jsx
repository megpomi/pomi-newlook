import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { splitByCause } from "@/lib/donations";
import { currencyOf, formatMoney } from "@/lib/currency";

export default function DonationCauses({ user, pot }) {
  const money = (value) => formatMoney(value, currencyOf(user));
  const shares = splitByCause(user, pot);

  if (!shares.length) {
    return (
      <p className="mt-6 text-sm text-slate-400">
        You haven't chosen any causes yet — your pot is split equally between
        the causes you pick.
      </p>
    );
  }

  return (
    <div className="mt-6">
      <div className="mb-1 flex items-baseline justify-between">
        <h3 className="text-xs font-medium uppercase tracking-wider text-slate-400">
          Your causes
        </h3>
        <span className="text-xs text-slate-400">all time · split equally</span>
      </div>
      <ul className="divide-y divide-slate-100">
        {shares.map((share) => (
          <li key={share.value}>
            <Link
              to={`/causes/${share.value}`}
              className="group flex items-center justify-between gap-4 py-2.5"
            >
              <span className="flex items-center gap-1.5 text-sm text-slate-600 group-hover:text-pomegranate-700">
                {share.label}
                <ChevronRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-pomegranate-500" />
              </span>
              <span className="font-heading text-sm font-semibold text-pomegranate-600">
                {money(share.amount)}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}