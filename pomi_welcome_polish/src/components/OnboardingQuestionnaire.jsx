import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, Sparkles } from "lucide-react";
import { Image } from "@/components/ui/image";
import pomiLogo from "@/assets/pomi-logo.png";
import { CHARITY_OPTIONS } from "@/lib/charities";
import { TRACKING_OPTIONS } from "@/lib/tracking";
import {
  clearOnboardingDraft,
  writeOnboardingDraft,
} from "@/lib/onboardingDraft";
import ChoiceCard from "@/components/onboarding/ChoiceCard";
import IntroStep from "@/components/onboarding/IntroStep";
import AccountStep from "@/components/onboarding/AccountStep";
import SymptomHistoryStep from "@/components/onboarding/SymptomHistoryStep";
import StepProgress from "@/components/onboarding/StepProgress";
import {
  SERIF,
  stepPage,
  stepLogo,
  stepLabel,
  stepHeading,
  stepSubtitle,
  primaryButton,
  backButton,
  arrowNudge,
} from "@/components/onboarding/styles";

export default function OnboardingQuestionnaire({ draft, onComplete }) {
  const [step, setStep] = useState(0);
  const [trackingFocus, setTrackingFocus] = useState(
    draft?.tracking_focus || []
  );
  const [charityInterests, setCharityInterests] = useState(
    draft?.charity_interests || []
  );
  const [restoring, setRestoring] = useState(Boolean(draft));

  // Back from Google/Apple sign-in: the account exists now, so save the answers
  // chosen before the redirect and pick the flow up where it left off.
  useEffect(() => {
    if (!draft) return;
    base44.auth
      .updateMe({
        tracking_focus: draft.tracking_focus,
        charity_interests: draft.charity_interests,
        preferred_name: draft.preferred_name,
      })
      .then(() => {
        clearOnboardingDraft();
        setRestoring(false);
        if (draft.tracking_focus.includes("menstrual_cycles")) {
          setStep(4);
        } else {
          onComplete(draft.tracking_focus);
        }
      })
      .catch(() => {
        clearOnboardingDraft();
        setRestoring(false);
        setStep(1);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = (setter) => (value) =>
    setter((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );

  const allCharitiesSelected =
    charityInterests.length === CHARITY_OPTIONS.length;

  const toggleAllCharities = () =>
    setCharityInterests(
      allCharitiesSelected ? [] : CHARITY_OPTIONS.map((o) => o.value)
    );

  // Answers are parked before leaving this page, so the account that gets
  // created (Google/Apple/Facebook or email) can pick them up straight after.
  const handleAccountReady = (name, provider) => {
    writeOnboardingDraft({
      preferred_name: name,
      tracking_focus: trackingFocus,
      charity_interests: charityInterests,
    });
    if (provider) {
      base44.auth.loginWithProvider(provider, "/");
    } else {
      window.location.href = "/";
    }
  };

  const isFirst = step === 1;
  const options = isFirst ? TRACKING_OPTIONS : CHARITY_OPTIONS;
  const selected = isFirst ? trackingFocus : charityInterests;
  const toggleCurrent = toggle(isFirst ? setTrackingFocus : setCharityInterests);

  if (restoring) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-pomegranate-100 border-t-pomegranate-600" />
      </div>
    );
  }

  if (step === 0) {
    return <IntroStep onStart={() => setStep(1)} />;
  }

  if (step === 3) {
    return (
      <AccountStep onBack={() => setStep(2)} onContinue={handleAccountReady} />
    );
  }

  if (step === 4) {
    return (
      <SymptomHistoryStep
        trackingFocus={trackingFocus}
        onComplete={onComplete}
        onBack={() => setStep(2)}
      />
    );
  }

  return (
    <div className={stepPage}>
      <div className="w-full max-w-xl">
        <div className="mb-10 flex flex-col items-center text-center">
          <Image
            src={pomiLogo}
            alt="Pomi"
            className={stepLogo}
            fittingType="fit"
          />
          <span className={stepLabel}>
            Step {step} of 3
          </span>
          <StepProgress step={step} total={3} />
          <h1 style={SERIF} className={`mt-5 ${stepHeading}`}>
            {isFirst
              ? "What would you like to track?"
              : "Which causes matter to you?"}
          </h1>
          <p className={stepSubtitle}>
            {isFirst
              ? "Choose what matters to you — this shapes your personalised insights and symptoms predictions and can be updated at any point."
              : "A share of what Pomi earns is donated to these areas - Pick the ones you'd like to support directly, these can be updated at any point."}
          </p>
        </div>

        <div className="space-y-3">
          {options.map((opt) => (
            <ChoiceCard
              key={opt.value}
              icon={opt.icon}
              label={opt.label}
              desc={opt.desc}
              active={selected.includes(opt.value)}
              comingSoon={opt.comingSoon}
              onClick={() => toggleCurrent(opt.value)}
            />
          ))}
          {!isFirst && (
            <ChoiceCard
              icon={Sparkles}
              label="All of the above"
              active={allCharitiesSelected}
              onClick={toggleAllCharities}
            />
          )}
        </div>

        <div className="mt-10 flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setStep(isFirst ? 0 : step - 1)}
            className={backButton}
          >
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back
          </Button>
          <Button
            onClick={() => setStep(step + 1)}
            disabled={!selected.length}
            className={`flex-1 ${primaryButton}`}
          >
            Continue
            <ArrowRight className={arrowNudge} />
          </Button>
        </div>
      </div>
    </div>
  );
}