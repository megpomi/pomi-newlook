import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Confirms turning a tracking area off, spelling out what the app stops
// prompting for. Historic entries are never touched.
export default function RemoveTrackingDialog({ option, open, onOpenChange, onConfirm }) {
  const removal = option?.removal;
  const items = removal?.items || ["New entries for this tracking area"];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl border-slate-100 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl font-semibold text-slate-800">
            {removal?.title || `Stop tracking ${option?.label || "this"}?`}
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500">
            Here's what changes in Pomi. You'll no longer be able to add new
            entries for:
          </DialogDescription>
        </DialogHeader>

        <ul className="mt-1 space-y-2 text-sm text-slate-600">
          {items.map((item) => (
            <li key={item} className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-pomegranate-400" />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <p className="mt-3 rounded-2xl bg-pomegranate-50/70 px-4 py-3 text-sm text-pomegranate-800">
          Everything you've already logged stays exactly as it is and is never
          deleted. Press save afterwards to apply the change, and you can turn
          this back on whenever you like.
        </p>

        <DialogFooter className="mt-4 flex-col gap-2 sm:flex-col">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full rounded-full border-pomegranate-200 text-pomegranate-600 hover:bg-pomegranate-50"
          >
            Keep tracking
          </Button>
          <Button
            onClick={onConfirm}
            className="w-full rounded-full bg-pomegranate-600 hover:bg-pomegranate-700"
          >
            Turn it off
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}