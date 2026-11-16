import React from "react";
import { Mail } from "lucide-react";

// The address the account signs in with — shown for reference, never editable.
export default function EmailBox({ email }) {
  return (
    <section className="rounded-3xl border border-pomegranate-100 bg-white p-5 sm:p-6">
      <h2 className="font-heading text-lg font-semibold text-slate-800">
        Email
      </h2>
      <p className="mt-1 text-sm text-slate-500">
        The address you sign in with. It can't be changed here.
      </p>
      <div className="mt-4 flex items-center gap-2 rounded-xl border border-pomegranate-100 bg-pomegranate-50/60 px-4 py-3 text-sm text-slate-600">
        <Mail className="h-4 w-4 shrink-0 text-pomegranate-400" />
        <span className="truncate">{email}</span>
      </div>
    </section>
  );
}