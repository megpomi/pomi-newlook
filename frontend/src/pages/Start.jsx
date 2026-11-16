import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import Home from "@/pages/Home";
import OnboardingQuestionnaire from "@/components/OnboardingQuestionnaire";
import {
  clearOnboardingDraft,
  readOnboardingDraft,
} from "@/lib/onboardingDraft";

// Entry point: new visitors answer the setup questions and sign in with Google
// or Apple, people who already have an account land straight on their dashboard.
export default function Start() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState(null);

  useEffect(() => {
    let active = true;
    const pending = readOnboardingDraft();
    base44.auth
      .me()
      .then((u) => {
        if (!active) return;
        setUser(u || null);
        if (u?.tracking_focus?.length) {
          clearOnboardingDraft();
        } else if (u && pending) {
          setDraft(pending);
        }
      })
      .catch(() => {
        if (active) setUser(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-pomegranate-100 border-t-pomegranate-600" />
      </div>
    );
  }

  if (user?.tracking_focus?.length) {
    return <Home />;
  }

  return (
    <OnboardingQuestionnaire
      draft={draft}
      onComplete={(focus) => {
        clearOnboardingDraft();
        setUser((prev) => ({ ...prev, tracking_focus: focus }));
      }}
    />
  );
}