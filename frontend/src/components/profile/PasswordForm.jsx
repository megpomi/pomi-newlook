import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

const MIN_LENGTH = 8;

export default function PasswordForm({ user }) {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const tooShort = next.length > 0 && next.length < MIN_LENGTH;
  const mismatch = confirm.length > 0 && next !== confirm;
  const canSave =
    current.length > 0 && next.length >= MIN_LENGTH && next === confirm && !saving;

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await base44.auth.changePassword({
        userId: user.id,
        currentPassword: current,
        newPassword: next,
      });
      setCurrent("");
      setNext("");
      setConfirm("");
      setOpen(false);
      toast({
        title: "Password updated",
        description: "Use your new password next time you sign in.",
      });
    } catch (err) {
      toast({
        title: "Couldn't update your password",
        description: err?.message || "Check your current password and try again.",
        variant: "destructive",
      });
    }
    setSaving(false);
  };

  return (
    <section className="rounded-3xl border border-pomegranate-100 bg-white/70 shadow-[0_1px_2px_rgba(89,62,70,0.04),0_12px_32px_-20px_rgba(89,62,70,0.18)] p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-serif text-2xl font-medium leading-tight text-pomegranate-900">
            Password
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Change the password you sign in with.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => setOpen((current) => !current)}
          className="rounded-full border-pomegranate-200 px-5 text-pomegranate-600 hover:bg-pomegranate-50"
        >
          {open ? "Cancel" : "Change password"}
        </Button>
      </div>

      {open && (
      <form onSubmit={handleSave} className="mt-4 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="current_password">Current password</Label>
          <Input
            id="current_password"
            type="password"
            autoComplete="current-password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            className="h-11"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="new_password">New password</Label>
            <Input
              id="new_password"
              type="password"
              autoComplete="new-password"
              value={next}
              onChange={(e) => setNext(e.target.value)}
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm_password">Confirm new password</Label>
            <Input
              id="confirm_password"
              type="password"
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="h-11"
            />
          </div>
        </div>

        {tooShort && (
          <p className="text-sm text-destructive">
            Use at least {MIN_LENGTH} characters.
          </p>
        )}
        {mismatch && (
          <p className="text-sm text-destructive">
            Those passwords don't match.
          </p>
        )}

        <Button
          type="submit"
          disabled={!canSave}
          className="rounded-full bg-pomegranate-700 px-5 font-medium text-white shadow-[0_8px_20px_-12px_rgba(109,75,84,0.55)] transition-colors hover:bg-pomegranate-800"
        >
          {saving ? "Updating…" : "Update password"}
        </Button>
      </form>
      )}
    </section>
  );
}