import React, { useEffect, useState } from "react";
import PomiLoader from "@/components/PomiLoader";
import { Link } from "react-router-dom";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import AppHeader from "@/components/AppHeader";
import ExitQuestionnaire from "@/components/account/ExitQuestionnaire";

const DELETED = [
  "Your cycle and period history",
  "Your daily logs, symptoms and moods",
  "Your preferences, chosen causes and personal details",
  "Your access to Pomi",
];

export default function DeleteAccount() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reason, setReason] = useState("");
  const [comments, setComments] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    base44.auth
      .me()
      .then((u) => setUser(u || null))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async () => {
    setError("");
    setDeleting(true);
    try {
      await base44.entities.ExitFeedback.create({
        reason,
        comments: comments.trim(),
      });
      await base44.entities.CycleLog.deleteMany({ created_by_id: user.id });
      await base44.entities.DailyLog.deleteMany({ created_by_id: user.id });
      await base44.auth.updateMe({
        preferred_name: "",
        tracking_focus: [],
        charity_interests: [],
      });
      setDone(true);
    } catch (e) {
      setError(
        e?.message || "We couldn't delete your account. Please try again."
      );
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <PomiLoader />
    );
  }

  if (done) {
    return (
      <div className="min-h-screen bg-background">
        <main className="mx-auto flex max-w-xl flex-col items-center px-5 py-20 text-center sm:px-8">
          <h1 className="font-heading text-3xl font-semibold text-slate-800">
            Your data has been deleted
          </h1>
          <p className="mt-3 text-sm text-slate-500">
            Everything you tracked with Pomi is gone, and you've been signed out.
            Thank you for the time you spent here — and for the donations your
            tracking made possible.
          </p>
          <Button
            onClick={() => window.location.replace("/?clear_access_token=true")}
            className="mt-8 rounded-full bg-pomegranate-600 px-8 py-6 text-base hover:bg-pomegranate-700"
          >
            Back to Pomi
          </Button>
        </main>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background px-6 text-center">
        <p className="font-heading text-xl font-semibold text-slate-700">
          We couldn't load your account.
        </p>
        <Link
          to="/"
          className="text-sm font-medium text-pomegranate-600 hover:text-pomegranate-700"
        >
          Back to my dashboard
        </Link>
      </div>
    );
  }

  const canDelete = Boolean(reason) && confirmed && !deleting;

  return (
    <div className="min-h-screen bg-background">
      <AppHeader maxWidth="max-w-3xl">
        <Link
          to="/profile"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-pomegranate-600 hover:text-pomegranate-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to my profile
        </Link>
      </AppHeader>

      <main className="mx-auto max-w-3xl px-5 py-8 sm:px-8 sm:py-12">
        <h1 className="font-heading text-3xl font-semibold text-slate-800 sm:text-4xl">
          Delete your account
        </h1>

        <section className="mt-6 rounded-2xl border border-destructive/30 bg-destructive/5 p-5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
            <div>
              <h2 className="font-heading text-lg font-semibold text-slate-800">
                This permanently deletes all your account data
              </h2>
              <ul className="mt-3 space-y-1.5 text-sm text-slate-600">
                {DELETED.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-destructive">•</span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-sm text-slate-500">
                This can't be undone and your tracking history can't be
                recovered.
              </p>
            </div>
          </div>
        </section>

        <div className="mt-6">
          <ExitQuestionnaire
            reason={reason}
            comments={comments}
            onReasonChange={setReason}
            onCommentsChange={setComments}
          />
        </div>

        <div className="mt-6 flex items-start gap-3">
          <Checkbox
            id="confirm-delete"
            checked={confirmed}
            onCheckedChange={(value) => setConfirmed(Boolean(value))}
            className="mt-0.5"
          />
          <Label
            htmlFor="confirm-delete"
            className="text-sm font-normal leading-relaxed text-slate-600"
          >
            I understand that deleting my account permanently removes all my
            Pomi data and can't be undone.
          </Label>
        </div>

        {error && (
          <p className="mt-4 text-sm text-destructive">{error}</p>
        )}

        <Button
          onClick={handleDelete}
          disabled={!canDelete}
          variant="destructive"
          className="mt-6 w-full rounded-full py-6 text-base"
        >
          {deleting ? "Deleting your account…" : "Delete my account"}
        </Button>

        <Link
          to="/profile"
          className="mx-auto mt-4 block text-center text-sm font-medium text-slate-500 hover:text-pomegranate-600"
        >
          Cancel and go back
        </Link>
      </main>
    </div>
  );
}