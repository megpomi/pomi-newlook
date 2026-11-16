import React, { useEffect, useRef } from "react";
import {
  ADSENSE_CLIENT,
  ADSENSE_SLOT,
  adsConfigured,
  loadAdSense,
} from "@/lib/ads";

// One Google AdSense unit. Shows a placeholder until the AdSense ids are set
// in src/lib/ads.js.
export default function AdBanner({ className = "" }) {
  const filled = useRef(false);

  useEffect(() => {
    if (!adsConfigured() || filled.current) return;
    filled.current = true;
    loadAdSense().then(() => {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        // Ad blockers and offline previews simply leave the space empty.
      }
    });
  }, []);

  if (!adsConfigured()) {
    return (
      <div
        className={`hidden h-[50px] w-full min-w-0 items-center justify-center rounded-lg border border-dashed border-pomegranate-200 bg-pomegranate-50/60 px-4 text-[11px] uppercase tracking-[0.18em] text-pomegranate-400 sm:flex ${className}`}
      >
        Google ad space
      </div>
    );
  }

  return (
    <ins
      className={`adsbygoogle block min-h-[50px] w-full min-w-0 ${className}`}
      style={{ display: "block" }}
      data-ad-client={ADSENSE_CLIENT}
      data-ad-slot={ADSENSE_SLOT}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}