import React from "react";
import { Image } from "@/components/ui/image";
import pomiLogo from "@/assets/pomi-logo.png";
import AdBanner from "@/components/ads/AdBanner";
import useIsSubscriber from "@/hooks/use-is-subscriber";

// Shared page header: the Pomi logo, the free-plan ad banner filling the space
// up to the page's actions, and the page's own actions on the right.
export default function AppHeader({ children, maxWidth = "max-w-5xl" }) {
  const subscriber = useIsSubscriber();

  return (
    <header className="sticky top-0 z-30 border-b border-pomegranate-100/70 bg-background/85 backdrop-blur-md">
      <div
        className={`mx-auto flex ${maxWidth} items-center justify-between gap-4 px-5 py-4 sm:px-8`}
      >
        <div className="flex min-w-0 flex-1 items-center gap-4">
          <Image
            src={pomiLogo}
            alt="Pomi"
            className="h-14 w-14 shrink-0"
            fittingType="fit"
          />
          {!subscriber && <AdBanner className="flex-1" />}
        </div>
        <div className="flex shrink-0 items-center gap-2">{children}</div>
      </div>
    </header>
  );
}