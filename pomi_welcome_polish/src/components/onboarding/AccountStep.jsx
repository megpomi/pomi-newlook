import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Image } from "@/components/ui/image";
import pomiLogo from "@/assets/pomi-logo.png";
import { ArrowLeft, Apple, Facebook, Lock, Mail } from "lucide-react";
import GoogleIcon from "@/components/GoogleIcon";
import StepProgress from "@/components/onboarding/StepProgress";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  SERIF,
  stepPage,
  stepLogo,
  stepLabel,
  stepHeading,
  stepSubtitle,
  primaryButton,
  backButton,
  softCard,
} from "@/components/onboarding/styles";

export default function AccountStep({ onBack, onContinue }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const ready = name.trim().length > 0;

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await base44.auth.register({ email, password });
      setShowOtp(true);
    } catch (err) {
      setError(
        err?.message || "We couldn't create your account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await base44.auth.verifyOtp({ email, otpCode });
      if (result?.access_token) {
        base44.auth.setToken(result.access_token);
      }
      onContinue(name.trim());
    } catch (err) {
      setError(err?.message || "That code didn't work. Please try again.");
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    try {
      await base44.auth.resendOtp(email);
    } catch (err) {
      setError(err?.message || "We couldn't resend the code.");
    }
  };

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
            Step 3 of 3
          </span>
          <StepProgress step={3} total={3} />
          <h1 style={SERIF} className={`mt-5 ${stepHeading}`}>
            {showOtp ? "Verify your email" : "What should we call you?"}
          </h1>
          <p className={stepSubtitle}>
            {showOtp
              ? `We sent a 6-digit code to ${email}.`
              : "Make an account so your symptom and donation tracking stay with you."}
          </p>
        </div>

        <div className={`p-6 sm:p-7 ${softCard}`}>
          {showOtp ? (
            <div className="space-y-4">
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={otpCode}
                  onChange={setOtpCode}
                  autoFocus
                  autoComplete="one-time-code"
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <Button
                onClick={handleVerify}
                disabled={loading || otpCode.length < 6}
                className={`w-full ${primaryButton}`}
              >
                {loading ? "Verifying…" : "Verify and continue"}
              </Button>
              <p className="text-center text-xs text-slate-500">
                Didn't get the code?{" "}
                <button
                  type="button"
                  onClick={handleResend}
                  className="font-medium text-pomegranate-600 hover:underline"
                >
                  Resend
                </button>
              </p>
            </div>
          ) : (
            <>
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Your name</Label>
                  <Input
                    id="name"
                    autoComplete="given-name"
                    placeholder="e.g. Alex"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12"
                    autoFocus
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail
                      className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                      aria-hidden="true"
                    />
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12 pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock
                      className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                      aria-hidden="true"
                    />
                    <Input
                      id="password"
                      type="password"
                      autoComplete="new-password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 pl-10"
                      required
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={loading || !ready}
                  className={`w-full ${primaryButton}`}
                >
                  {loading ? "Creating your account…" : "Create account"}
                </Button>
              </form>

              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-pomegranate-100" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-[#fefdfb] px-3 tracking-[0.18em] text-slate-400">or</span>
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  variant="outline"
                  disabled={!ready}
                  onClick={() => onContinue(name.trim(), "google")}
                  className="h-12 w-full rounded-full border-pomegranate-200 bg-white text-sm font-medium text-slate-700 shadow-none hover:bg-pomegranate-50"
                >
                  <GoogleIcon className="mr-2 h-5 w-5" />
                  Continue with Google
                </Button>
                <Button
                  variant="outline"
                  disabled={!ready}
                  onClick={() => onContinue(name.trim(), "apple")}
                  className="h-12 w-full rounded-full border-pomegranate-200 bg-white text-sm font-medium text-slate-700 shadow-none hover:bg-pomegranate-50"
                >
                  <Apple className="mr-2 h-5 w-5" />
                  Continue with Apple
                </Button>
                <Button
                  variant="outline"
                  disabled={!ready}
                  onClick={() => onContinue(name.trim(), "facebook")}
                  className="h-12 w-full rounded-full border-pomegranate-200 bg-white text-sm font-medium text-slate-700 shadow-none hover:bg-pomegranate-50"
                >
                  <Facebook className="mr-2 h-5 w-5" />
                  Continue with Facebook
                </Button>
              </div>
            </>
          )}
        </div>

        {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

        {!showOtp && (
          <Button
            variant="outline"
            onClick={onBack}
            disabled={loading}
            className={`mt-6 w-full ${backButton}`}
          >
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back
          </Button>
        )}
      </div>
    </div>
  );
}