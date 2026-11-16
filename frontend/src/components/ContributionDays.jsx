import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { countContributionDays } from "@/lib/donations";

// The two contribution counts: every day with any data ever, and the days with
// data so far this calendar month (it starts again on the 1st).
export default function ContributionDays() {
  const [counts, setCounts] = useState(null);

  useEffect(() => {
    let active = true;
    base44.auth
      .me()
      .then((me) => {
        const owner = { created_by_id: me?.id };
        return Promise.all([
          base44.entities.CycleLog.filter(owner, { limit: 500 }),
          base44.entities.DailyLog.filter(owner, { limit: 500 }),
        ]);
      })
      .then(([cycles, dailies]) => {
        if (active) {
          setCounts(countContributionDays(cycles.items, dailies.items));
        }
      })
      .catch(() => active && setCounts({ allTime: 0, thisMonth: 0 }));
    return () => {
      active = false;
    };
  }, []);

  const allTime = counts?.allTime ?? 0;
  const thisMonth = counts?.thisMonth ?? 0;

  return (
    <div className="mt-3 flex items-start justify-center gap-12 text-center">
      <div>
        <p className="font-heading text-4xl font-semibold">{allTime}</p>
        <p className="mt-1 text-xs text-white/80">days tracked all time</p>
      </div>
      <div>
        <p className="font-heading text-4xl font-semibold">{thisMonth}</p>
        <p className="mt-1 text-xs text-white/80">days tracked this month</p>
      </div>
    </div>
  );
}