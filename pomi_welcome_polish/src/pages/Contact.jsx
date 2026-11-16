import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Check, Clock, Loader2, Mail } from "lucide-react";
import PublicHeader from "@/components/PublicHeader";
import PublicFooter from "@/components/PublicFooter";
import { SERIF, softCard, primaryButton, backButton } from "@/components/onboarding/styles";

const EMPTY = { name: "", email: "", message: "" };

export default function Contact() {
  const [form, setForm] = useState(EMPTY);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const update = (field) => (event) =>
    setForm((prev) => ({ ...prev, [field]: event.target.value }));

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSending(true);
    try {
      const response = await base44.functions.invoke("submitContactMessage", {
        name: form.name,
        email: form.email,
        message: form.message,
      });
      if (response.data?.error) {
        setError(response.data.error);
        return;
      }
      setSent(true);
      setForm(EMPTY);
    } catch (e) {
      setError(
        e?.response?.data?.error ||
          "We couldn't send your message. Please try again."
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <PublicHeader />

      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-14 sm:px-8 sm:py-20">
        <div className="mb-12">
          <span className="text-[11px] font-medium uppercase tracking-[0.22em] text-pomegranate-500">
            Contact us
          </span>
          <h1 style={SERIF} className="mt-4 text-[2.5rem] font-medium leading-[1.1] tracking-[-0.01em] text-pomegranate-900 sm:text-[3.25rem]">
            Talk to the Pomi team
          </h1>
          <p className="mt-5 max-w-xl text-[0.9375rem] leading-[1.75] text-slate-600">
            Questions about your account, donations, or how Pomi handles your
            data? Send us a message and we'll get back to you.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-5 sm:gap-8">
          <section className={`p-6 sm:col-span-3 sm:p-8 ${softCard}`}>
            {sent ? (
              <div className="flex flex-col items-start gap-3 py-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-pomegranate-50 text-pomegranate-700 ring-1 ring-pomegranate-100">
                  <Check className="h-4 w-4" strokeWidth={2} />
                </span>
                <h2 style={SERIF} className="text-2xl font-medium text-pomegranate-900">
                  Message sent
                </h2>
                <p className="text-sm leading-relaxed text-slate-600">
                  Thanks for getting in touch. We usually reply within two working
                  days.
                </p>
                <Button
                  variant="outline"
                  onClick={() => setSent(false)}
                  className={`mt-2 h-12 ${backButton}`}
                >
                  Send another message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <Label htmlFor="contact-name">Your name</Label>
                  <Input
                    id="contact-name"
                    value={form.name}
                    onChange={update("name")}
                    maxLength={80}
                    required
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="contact-email">Your email</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    value={form.email}
                    onChange={update("email")}
                    maxLength={160}
                    required
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="contact-message">How can we help?</Label>
                  <Textarea
                    id="contact-message"
                    value={form.message}
                    onChange={update("message")}
                    maxLength={2000}
                    rows={6}
                    required
                    className="mt-1.5"
                  />
                </div>

                {error && <p className="text-sm text-destructive">{error}</p>}

                <Button
                  type="submit"
                  disabled={sending}
                  className={`w-full ${primaryButton}`}
                >
                  {sending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Send message
                </Button>
              </form>
            )}
          </section>

          <aside className="space-y-5 sm:col-span-2">
            <div className={`p-6 ${softCard}`}>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-pomegranate-50 text-pomegranate-600 ring-1 ring-pomegranate-100">
                <Clock className="h-4 w-4" strokeWidth={1.75} />
              </span>
              <h2 style={SERIF} className="mt-4 text-xl font-medium text-pomegranate-900">
                Response times
              </h2>
              <p className="mt-2 text-sm leading-[1.7] text-slate-600">
                We aim to reply to every message within two working days.
              </p>
            </div>
            <div className={`p-6 ${softCard}`}>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-pomegranate-50 text-pomegranate-600 ring-1 ring-pomegranate-100">
                <Mail className="h-4 w-4" strokeWidth={1.75} />
              </span>
              <h2 style={SERIF} className="mt-4 text-xl font-medium text-pomegranate-900">
                Account and data requests
              </h2>
              <p className="mt-2 text-sm leading-[1.7] text-slate-600">
                You can delete your account and all of its data yourself from your
                profile at any time. For anything else to do with your data, choose
                "Your data" in your message.
              </p>
            </div>
          </aside>
        </div>

        <p className="mt-12 max-w-xl text-xs leading-relaxed text-slate-400">
          Pomi is not a medical device. If you have a health concern, please speak
          to a healthcare professional. In an emergency, contact your local
          emergency services.
        </p>
      </main>

      <PublicFooter />
    </div>
  );
}