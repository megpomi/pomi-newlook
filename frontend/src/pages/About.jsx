import React from "react";
import { Link } from "react-router-dom";
import { Heart, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";
import PublicHeader from "@/components/PublicHeader";
import PublicFooter from "@/components/PublicFooter";
import { CHARITY_OPTIONS } from "@/lib/charities";
import { DONATION_SHARE } from "@/lib/donations";
import { SERIF, softCard } from "@/components/onboarding/styles";

const percent = `${Math.round(DONATION_SHARE * 100)}%`;

const PILLARS = [
  {
    icon: Heart,
    title: "Tracking that gives back",
    body: `Pomi is free with ads, or ad-free with a subscription. Either way, ${percent} of the revenue your activity generates is set aside as a donation, split between the causes you choose.`,
  },
  {
    icon: ShieldCheck,
    title: "Your data stays yours",
    body: "Your cycle, mood and journal entries are private to your account. We don't sell your health data, and you can delete your account and everything in it at any time.",
  },
  {
    icon: Sparkles,
    title: "Built for real bodies",
    body: "Pomi tracks menstrual cycles, symptoms and day-to-day wellbeing, and it is designed to be inclusive: whether you are tracking a cycle, coming off contraception or simply keeping an eye on how you feel.",
  },
];

export default function About() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PublicHeader />

      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-14 sm:px-8 sm:py-20">
        <div className="overflow-hidden rounded-3xl bg-pomegranate-800 px-7 py-10 text-white sm:px-12 sm:py-14">
          <div className="mb-6 flex items-center gap-2">
            <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-white/70">
              About us
            </span>
          </div>
          <h1 style={SERIF} className="max-w-2xl text-[2.25rem] font-medium leading-[1.12] tracking-[-0.01em] sm:text-5xl">
            A women's health app that shares what it earns.
          </h1>
          <p className="mt-6 max-w-2xl text-[0.9375rem] leading-[1.75] text-white/85">
            Pomi is named after the pomegranate, a symbol of health, abundance
            and natural cycles. We built it because we used period trackers for
            years and felt uneasy that the money our most personal data generated
            went into someone else's pocket. Pomi works the other way: the revenue
            your tracking creates goes to women's health causes.
          </p>
        </div>

        <section className="mt-14 grid gap-5 sm:grid-cols-3">
          {PILLARS.map((pillar) => (
            <div
              key={pillar.title}
              className={`p-6 ${softCard}`}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-pomegranate-50 text-pomegranate-600 ring-1 ring-pomegranate-100">
                <pillar.icon className="h-4 w-4" strokeWidth={1.75} />
              </span>
              <h2 style={SERIF} className="mt-5 text-2xl font-medium leading-tight text-pomegranate-900">
                {pillar.title}
              </h2>
              <p className="mt-3 text-sm leading-[1.75] text-slate-600">
                {pillar.body}
              </p>
            </div>
          ))}
        </section>

        <section className={`mt-8 p-7 sm:p-10 ${softCard}`}>
          <h2 style={SERIF} className="text-[1.75rem] font-medium leading-tight text-pomegranate-900 sm:text-3xl">
            What Pomi tracks
          </h2>
          <p className="mt-4 max-w-2xl text-[0.9375rem] leading-[1.75] text-slate-600">
            You choose what you want to track when you sign up, and you can change
            it at any time from your profile. Menstrual cycle tracking covers
            period days, flow, predicted fertile windows and symptoms. General
            wellbeing tracking gives you a daily check-in, a journalling prompt and
            a place to note how you feel, with or without a cycle. Everything you
            log stays in one place, so you can look back over time and spot
            patterns.
          </p>
          <p className="mt-4 max-w-2xl text-[0.9375rem] leading-[1.75] text-slate-600">
            Pomi is not a medical device and does not provide medical advice.
            Predictions are estimates based on what you log, and they should never
            replace a conversation with a healthcare professional.
          </p>
        </section>

        <section className={`mt-8 p-7 sm:p-10 ${softCard}`}>
          <h2 style={SERIF} className="text-[1.75rem] font-medium leading-tight text-pomegranate-900 sm:text-3xl">
            The causes we support
          </h2>
          <p className="mt-4 max-w-2xl text-[0.9375rem] leading-[1.75] text-slate-600">
            Donations are spread across {CHARITY_OPTIONS.length} areas of women's
            health, each delivered through charities we have chosen for their work:
          </p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {CHARITY_OPTIONS.map((cause) => (
              <li
                key={cause.value}
                className="rounded-full border border-pomegranate-200 bg-pomegranate-50/60 px-3.5 py-1.5 text-xs font-medium text-pomegranate-800"
              >
                {cause.label}
              </li>
            ))}
          </ul>
          <Link
            to="/contact"
            className="group mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-pomegranate-700 underline-offset-4 hover:underline"
          >
            Questions about how it works? Contact us
            <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </section>

        <p className="mx-auto mt-12 max-w-md text-center text-xs leading-relaxed text-slate-400">
          Pomi is an independent app. Your data is used to provide the app and to
          calculate donations, and nothing else.
        </p>
      </main>

      <PublicFooter />
    </div>
  );
}