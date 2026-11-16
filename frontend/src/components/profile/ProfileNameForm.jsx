import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

// The name Pomi greets the user with on the home page.
export default function ProfileNameForm({ user, onSaved }) {
  const saved = user.preferred_name || user.full_name || "";
  const [name, setName] = useState(saved);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const trimmed = name.trim();
  const canSave = trimmed.length > 0 && trimmed !== saved && !saving;

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await base44.auth.updateMe({ preferred_name: trimmed });
      onSaved(trimmed);
      setOpen(false);
      toast({
        title: "Name updated",
        description: `Pomi will greet you as ${trimmed}.`,
      });
    } catch (err) {
      toast({
        title: "Couldn't update your name",
        description: err?.message || "Please try again.",
        variant: "destructive",
      });
    }
    setSaving(false);
  };

  return (
    <section className="rounded-3xl border border-pomegranate-100 bg-white p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-heading text-lg font-semibold text-slate-800">
            Name
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {saved
              ? `Pomi greets you as ${saved}.`
              : "This is what Pomi calls you on your home page."}
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => setOpen((current) => !current)}
          className="rounded-full border-pomegranate-200 px-5 text-pomegranate-600 hover:bg-pomegranate-50"
        >
          {open ? "Cancel" : "Change name"}
        </Button>
      </div>

      {open && (
      <form
        onSubmit={handleSave}
        className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end"
      >
        <div className="flex-1 space-y-2">
          <Label htmlFor="preferred_name">Name</Label>
          <Input
            id="preferred_name"
            autoComplete="given-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-11"
          />
        </div>
        <Button
          type="submit"
          disabled={!canSave}
          className="rounded-full bg-pomegranate-600 px-5 hover:bg-pomegranate-700"
        >
          {saving ? "Saving…" : "Save name"}
        </Button>
      </form>
      )}
    </section>
  );
}