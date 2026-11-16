import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { ArrowLeft } from "lucide-react";
import AppHeader from "@/components/AppHeader";
import { useToast } from "@/components/ui/use-toast";
import AdFreeBenefits from "@/components/upgrade/AdFreeBenefits";
import DonationImpact from "@/components/upgrade/DonationImpact";
import PlanPicker from "@/components/upgrade/PlanPicker";

export default function Upgrade() {
  const [charityInterests, setCharityInterests] = useState([]);
  const [starting, setStarting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    base44.auth
      .me()
      .then((u) => setCharityInterests(u?.charity_interests || []))
      .catch(() => setCharityInterests([]));
  }, []);

  const handleSubscribe = async (cadence) => {
    setStarting(true);
    try {
      const res = await base44.functions.invoke("create-checkout", {
        productId: `adfree_${cadence}`,
      });
      const redirectUrl = res?.data?.redirectUrl;
      if (!redirectUrl) throw new Error("Checkout didn't start");
      window.location.href = redirectUrl;
    } catch (e) {
      toast({
        title: "Couldn't start checkout",
        description: e?.message || "Please try again in a moment.",
        variant: "destructive",
      });
      setStarting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-pomegranate-600 hover:text-pomegranate-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to my dashboard
        </Link>
      </AppHeader>

      <main className="mx-auto max-w-5xl px-5 py-8 sm:px-8 sm:py-12">
        <div className="max-w-2xl">
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-pomegranate-400">
            Pomi ad-free
          </span>
          <h1 className="mt-2 font-heading text-3xl font-semibold text-slate-800 sm:text-4xl">
            Track without ads, give more
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-500 sm:text-base">
            Pomi is free because of ads - every ad you see raises donations for
            the causes you choose. Go ad-free to earn even more donations each
            cycle and track your impact.
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <AdFreeBenefits />
            <div className="mt-6">
              <DonationImpact charityInterests={charityInterests} />
            </div>
          </div>
          <div className="lg:col-span-2">
            <PlanPicker onSubscribe={handleSubscribe} loading={starting} />
          </div>
        </div>
      </main>
    </div>
  );
}