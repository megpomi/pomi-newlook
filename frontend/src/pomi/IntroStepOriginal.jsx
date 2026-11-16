import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Droplet, Heart, Navigation } from "lucide-react";

import pomiLogo from "@/assets/pomi-logo.png";
import PublicHeader from "@/pomi/PublicHeader";
import PublicFooter from "@/pomi/PublicFooter";

export default function IntroStepOriginal({ onStart }) {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setRevealed(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PublicHeader />

      <main className="flex flex-1 items-center justify-center px-5 py-10">
        <div className="w-full max-w-xl">
          <motion.div layout className="flex flex-col items-center text-center">
            <motion.div
              layout
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              <img
                src={pomiLogo}
                alt="Pomi"
                className={revealed ? "h-24 w-24" : "h-40 w-40"}
                style={{ objectFit: "contain" }}
              />
            </motion.div>

            {revealed && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
              >
                <h1 className="mt-4 font-heading text-3xl font-semibold text-slate-800">
                  Welcome to Pomi
                </h1>
                <p className="mt-3 max-w-md text-sm leading-relaxed text-slate-500">
                  As in the pomegranate - Symbolic of health, abundance and natural
                  cycles.
                </p>
              </motion.div>
            )}
          </motion.div>

          {revealed && (
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="mt-6 space-y-3">
                <div className="flex items-start gap-3 rounded-2xl border border-pomegranate-100 bg-white p-5">
                  <Heart className="mt-0.5 h-5 w-5 shrink-0 fill-pomegranate-400 text-pomegranate-400" />
                  <p className="text-sm leading-relaxed text-slate-600">
                    Our purpose is built on the simple idea that every cycle is
                    powerful and can be used for good.
                  </p>
                </div>
                <div className="flex items-start gap-3 rounded-2xl border border-pomegranate-100 bg-white p-5">
                  <Droplet className="mt-0.5 h-5 w-5 shrink-0 fill-pomegranate-400 text-pomegranate-400" />
                  <p className="text-sm leading-relaxed text-slate-600">
                    Your data powers personalised health insights.
                  </p>
                </div>
                <div className="flex items-start gap-3 rounded-2xl border border-pomegranate-100 bg-white p-5">
                  <Navigation className="mt-0.5 h-5 w-5 shrink-0 fill-pomegranate-400 text-pomegranate-400" />
                  <p className="text-sm leading-relaxed text-slate-600">
                    Your account generates trackable donations made to charitable
                    causes important to you.
                  </p>
                </div>
              </div>

              <Button
                onClick={onStart}
                className="mt-6 w-full rounded-full bg-pomegranate-600 py-6 text-base hover:bg-pomegranate-700"
              >
                Start with Pomi
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}