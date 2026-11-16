import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Droplet, Heart, Navigation } from "lucide-react";
import { Image } from "@/components/ui/image";
import pomiLogo from "@/assets/pomi-logo.png";
import PublicHeader from "@/components/PublicHeader";
import PublicFooter from "@/components/PublicFooter";
import { SERIF, primaryButton, arrowNudge, softCard } from "@/components/onboarding/styles";

const POINTS = [
  {
    Icon: Heart,
    text: "Our purpose is built on the simple idea that every cycle is powerful and can be used for good.",
  },
  {
    Icon: Droplet,
    text: "Your data powers personalised health insights.",
  },
  {
    Icon: Navigation,
    text: "Your account generates trackable donations made to charitable causes important to you.",
  },
];

export default function IntroStep({ onStart }) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setRevealed(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PublicHeader />

      <main className="flex flex-1 items-center justify-center px-6 py-14 sm:px-8 sm:py-24">
        <div className="w-full max-w-[30rem]" data-testid="onboarding-welcome">
          <motion.div layout className="flex flex-col items-center text-center">
            <motion.div
              layout
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              <Image
                src={pomiLogo}
                alt="Pomi"
                className={revealed ? "h-16 w-16 sm:h-20 sm:w-20" : "h-36 w-36"}
                fittingType="fit"
              />
            </motion.div>

            {revealed && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="flex flex-col items-center"
              >
                <h1
                  style={SERIF}
                  className="mt-8 text-[2.75rem] font-medium leading-[1.05] tracking-[-0.01em] text-pomegranate-900 sm:text-[3.5rem]"
                >
                  Welcome to Pomi
                </h1>
                <span
                  aria-hidden="true"
                  className="mt-6 h-px w-12 bg-pomegranate-300"
                />
                <p
                  style={SERIF}
                  className="mt-6 max-w-sm text-xl italic leading-snug text-pomegranate-800/80 sm:text-[1.375rem]"
                >
                  As in the pomegranate — symbolic of health, abundance and
                  natural cycles.
                </p>
              </motion.div>
            )}
          </motion.div>

          {revealed && (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <ul className={`mt-12 divide-y divide-pomegranate-100 px-6 sm:px-7 ${softCard}`}>
                {POINTS.map(({ Icon, text }) => (
                  <li key={text} className="flex items-start gap-4 py-5">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-pomegranate-50 ring-1 ring-pomegranate-100">
                      <Icon
                        className="h-3.5 w-3.5 text-pomegranate-600"
                        strokeWidth={1.75}
                      />
                    </span>
                    <p className="text-[0.9375rem] leading-relaxed text-slate-600">
                      {text}
                    </p>
                  </li>
                ))}
              </ul>

              <Button
                onClick={onStart}
                data-testid="onboarding-start-button"
                className={`mt-10 w-full ${primaryButton}`}
              >
                Start with Pomi
                <ArrowRight className={arrowNudge} />
              </Button>
            </motion.div>
          )}
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
