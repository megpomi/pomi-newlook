import React from "react";
import { Image } from "@/components/ui/image";
import pomiLogo from "@/assets/pomi-logo.png";
import { SERIF, softCard, stepSubtitle } from "@/components/onboarding/styles";

export default function AuthLayout({ title, subtitle, footer, children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 py-14 sm:py-20">
      <div className="w-full max-w-[26rem]">
        <div className="mb-10 flex flex-col items-center text-center">
          <div className="mb-6 flex justify-center">
            <Image
              src={pomiLogo}
              alt="Pomi"
              className="h-12 w-12"
              fittingType="fit"
            />
          </div>
          <h1 style={SERIF} className="text-[2.5rem] font-medium leading-[1.1] tracking-[-0.01em] text-pomegranate-900 sm:text-5xl">
            {title}
          </h1>
          <span aria-hidden="true" className="mt-5 h-px w-10 bg-pomegranate-300" />
          {subtitle && <p className={stepSubtitle}>{subtitle}</p>}
        </div>
        <div className={`p-6 sm:p-8 ${softCard}`}>
          {children}
        </div>
        {footer && (
          <p className="mt-8 text-center text-sm text-slate-500">{footer}</p>
        )}
      </div>
    </div>
  );
}