import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Heart } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import { CHARITY_OPTIONS } from "@/lib/charities";
import { DONATION_SHARE } from "@/lib/donations";

const percent = `${Math.round(DONATION_SHARE * 100)}%`;

const STEPS = [
  {
    title: "Your activity generates revenue",
    body: `Pomi is free with ads, or ad-free with a subscription. Both earn the app revenue — every ad view and every subscription day counts.`,
  },
  {
    title: `${percent} of that revenue becomes your donation`,
    body: `We take ${percent} of the revenue your activity generates and put it into your personal donation pot. The rest keeps Pomi running.`,
  },
  {
    title: "Your pot is split between your causes",
    body: "Your pot is divided equally between the causes you chose in your profile. Distributions to our partner organisations are made periodically, and you can change your causes at any time.",
  },
];

export default function Mission() {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader maxWidth="max-w-4xl">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-pomegranate-600 hover:text-pomegranate-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to my dashboard
        </Link>
      </AppHeader>

      <main className="mx-auto max-w-4xl px-5 py-8 sm:px-8 sm:py-12">
        <div className="overflow-hidden rounded-3xl border border-pomegranate-100 bg-gradient-to-br from-pomegranate-500 to-pomegranate-800 p-8 text-white sm:p-10">
          <div className="mb-4 flex items-center gap-2">
            <Heart className="h-4 w-4 fill-white/80" />
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-white/80">
              Our mission
            </span>
          </div>
          <h1 className="font-heading text-3xl font-semibold leading-snug sm:text-4xl">
            Tracking your cycle should give something back.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/85">
            Health data is some of the most personal information there is, and it
            is usually collected for profit - Pomi's purpose is different. We've
            used similar apps and felt uncomfortable for years with the money
            going to sit in someone's bank account. Our founder wanted an
            inclusive women's health app, one that would generate donations to
            accelerate women's health research. Pomi's mission is to direct more
            funds to seven causes via the charities given below, chosen to help
            women as well as those similarly impacted.
          </p>
        </div>

        <section className="mt-8 rounded-3xl border border-slate-100 bg-white p-6 sm:p-8">
          <h2 className="font-heading text-lg font-semibold text-slate-800">
            How we donate
          </h2>
          <ol className="mt-5 space-y-6">
            {STEPS.map((step, index) => (
              <li key={step.title} className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pomegranate-100 font-heading text-sm font-semibold text-pomegranate-700">
                  {index + 1}
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-slate-800">
                    {step.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-8">
          <h2 className="font-heading text-lg font-semibold text-slate-800">
            The causes we support
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Each cause is delivered through more than one charitable
            organisation. Here is what they do and links to find out more
            information.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {CHARITY_OPTIONS.flatMap((cause) =>
              cause.partners.map((partner) => {
                const Icon = cause.icon;
                return (
                  <div
                    key={`${cause.value}-${partner.name}`}
                    className="flex flex-col rounded-3xl border border-slate-100 bg-white p-5"
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-pomegranate-100 text-pomegranate-600">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <h3 className="font-heading text-base font-semibold text-slate-800">
                          {partner.name}
                        </h3>
                        <p className="text-xs uppercase tracking-wider text-pomegranate-400">
                          {cause.label}
                        </p>
                      </div>
                    </div>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600">
                      {partner.blurb}
                    </p>
                    <a
                      href={partner.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-pomegranate-600 hover:text-pomegranate-700"
                    >
                      Visit website
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  </div>
                );
              })
            )}
          </div>
        </section>

        <p className="mt-8 text-center text-xs text-slate-400">
          Partner organisations and their websites are listed for information.
          Pomi is not affiliated with them beyond our donation distributions.
        </p>
      </main>
    </div>
  );
}