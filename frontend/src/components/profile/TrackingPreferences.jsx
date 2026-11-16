import React, { useState } from "react";
import { TRACKING_OPTIONS } from "@/lib/tracking";
import ChoiceCard from "@/components/onboarding/ChoiceCard";
import RemoveTrackingDialog from "@/components/profile/RemoveTrackingDialog";

export default function TrackingPreferences({ selected, onChange }) {
  const [pending, setPending] = useState(null);

  const toggle = (value) => {
    if (!selected.includes(value)) {
      onChange([...selected, value]);
      return;
    }
    // Turning an area off changes what the app asks for, so it's confirmed first.
    setPending(TRACKING_OPTIONS.find((opt) => opt.value === value) || null);
  };

  const confirmRemoval = () => {
    onChange(selected.filter((v) => v !== pending?.value));
    setPending(null);
  };

  return (
    <section className="rounded-3xl border border-slate-100 bg-white p-6 sm:p-8">
      <h2 className="font-heading text-lg font-semibold text-slate-800">
        What I'm tracking
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        Pick every area you want Pomi to follow — this shapes your insights and
        the symptoms you're prompted for.
      </p>

      <div className="mt-4 space-y-3">
        {TRACKING_OPTIONS.map((opt) => (
          <ChoiceCard
            key={opt.value}
            icon={opt.icon}
            label={opt.label}
            desc={opt.desc}
            active={selected.includes(opt.value)}
            comingSoon={opt.comingSoon}
            onClick={() => toggle(opt.value)}
          />
        ))}
      </div>

      <RemoveTrackingDialog
        option={pending}
        open={Boolean(pending)}
        onOpenChange={(open) => !open && setPending(null)}
        onConfirm={confirmRemoval}
      />
    </section>
  );
}