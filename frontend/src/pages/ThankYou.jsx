import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { Image } from "@/components/ui/image";
import pomiLogo from "@/assets/pomi-logo.png";

export default function ThankYou() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-5 py-10">
      <div className="w-full max-w-md text-center">
        <Image
          src={pomiLogo}
          alt="Pomi"
          className="mx-auto h-20 w-20"
          fittingType="fit"
        />
        <CheckCircle2 className="mx-auto mt-6 h-10 w-10 text-pomegranate-500" />
        <h1 className="mt-4 font-heading text-3xl font-semibold text-slate-800">
          Thank you
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-500">
          We're confirming your payment — this can take a moment. Your ad-free
          access switches on automatically, and from then on your subscription
          funds the causes you chose.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-full bg-pomegranate-600 px-6 py-3 text-sm font-medium text-white hover:bg-pomegranate-700"
        >
          Back to my dashboard
        </Link>
      </div>
    </div>
  );
}