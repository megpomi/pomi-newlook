import React from "react";
import { Link } from "react-router-dom";
import { Heart, Sparkles, ArrowUpRight, ArrowRight } from "lucide-react";
import { featuredCauses } from "@/lib/charities";
import ContributionDays from "@/components/ContributionDays";

export default function CharityImpact() {
  const featured = featuredCauses();
  return (
    <div className="overflow-hidden rounded-3xl bg-pomegranate-800 p-8 text-white sm:p-10">
      <Link to="/mission" className="group mb-6 inline-flex items-center gap-2">
        <Heart className="h-4 w-4 fill-white/80" />
        <span className="text-xs font-medium uppercase tracking-[0.18em] text-white/80 group-hover:text-white">
          Our mission
        </span>
        <ArrowRight className="h-3.5 w-3.5 text-white/60 transition-transform group-hover:translate-x-0.5" />
      </Link>

      <h3 className="font-serif text-3xl font-medium leading-tight sm:text-[2.5rem]">
        Every day you track helps fund important causes.
      </h3>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-white/85">
        Pomi is free with ads, or ad-free with a subscription. A share of the
        revenue earned is donated to your selected nonprofits, supporting women
        and LGBTQ+ in a range of health areas.
      </p>

      <div className="mt-7 rounded-2xl bg-white/10 p-5 ring-1 ring-white/15">
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs uppercase tracking-wider text-white/70">
            Your contribution
          </p>
          <Sparkles className="h-5 w-5 shrink-0 text-white/70" />
        </div>
        <ContributionDays />
        <p className="mt-3 text-left text-xs text-white/70">
          Consistent tracking powers the community that makes these donations
          possible.
        </p>
      </div>

      <div className="mt-6">
        <p className="mb-3 text-xs uppercase tracking-wider text-white/70">
          Today's featured causes we support
        </p>
        <div className="space-y-2">
          {featured.map((c) => (
            <Link
              key={c.value}
              to={`/causes/${c.value}`}
              className="flex items-center justify-between rounded-xl bg-white/10 px-4 py-2.5 transition-colors hover:bg-white/20"
            >
              <div>
                <p className="text-sm font-medium">
                  {c.partners.map((p) => p.name).join(" & ")}
                </p>
                <p className="text-xs text-white/70">{c.label}</p>
              </div>
              <ArrowUpRight className="h-4 w-4 shrink-0 text-white/60" />
            </Link>
          ))}
        </div>
        <Link
          to="/mission"
          className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/25"
        >
          Our mission &amp; how we donate
          <ArrowRight className="h-4 w-4" />
        </Link>
        <p className="mt-3 text-[11px] text-white/60">
          New partners featured daily — donation distributions are made by Pomi
          periodically.
        </p>
      </div>
    </div>
  );
}