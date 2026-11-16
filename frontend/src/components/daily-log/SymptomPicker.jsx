import React, { useEffect, useState } from "react";
import { Check, Loader2, Pencil, Plus, X } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Label } from "@/components/ui/label";
import { SYMPTOM_OPTIONS } from "@/lib/dailyLog";

const BUBBLE =
  "rounded-full border px-3 py-1.5 text-xs capitalize transition";

// The day's symptoms: the standard bubbles, the user's own symptoms saved for
// good, and a bubble at the end that turns into an input for a new one.
export default function SymptomPicker({ value, onChange }) {
  const [custom, setCustom] = useState([]);
  const [editing, setEditing] = useState(null); // "new" or a CustomSymptom id
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    base44.entities.CustomSymptom.list({ sort: "created_date", limit: 100 })
      .then((page) => active && setCustom(page.items))
      .catch(() => active && setError("Couldn't load your own symptoms."));
    return () => {
      active = false;
    };
  }, []);

  const toggle = (symptom) =>
    onChange(
      value.includes(symptom)
        ? value.filter((item) => item !== symptom)
        : [...value, symptom]
    );

  const startEdit = (target, name = "") => {
    setError("");
    setEditing(target);
    setDraft(name);
  };

  const cancelEdit = () => {
    setEditing(null);
    setDraft("");
  };

  const commit = async () => {
    const name = draft.trim();
    if (!name || busy) return;
    setBusy(true);
    setError("");
    try {
      if (editing === "new") {
        const existing =
          custom.find(
            (item) => item.name.toLowerCase() === name.toLowerCase()
          ) || SYMPTOM_OPTIONS.includes(name.toLowerCase());
        if (existing) {
          if (!value.includes(name)) toggle(name);
        } else {
          const record = await base44.entities.CustomSymptom.create({ name });
          setCustom((current) => [...current, record]);
          onChange([...value, name]);
        }
      } else {
        const previous = custom.find((item) => item.id === editing);
        await base44.entities.CustomSymptom.update(editing, { name });
        setCustom((current) =>
          current.map((item) => (item.id === editing ? { ...item, name } : item))
        );
        if (previous && value.includes(previous.name)) {
          onChange(
            [...value.filter((item) => item !== previous.name), name]
          );
        }
      }
      cancelEdit();
    } catch (e) {
      setError(e?.message || "Couldn't save that symptom.");
    } finally {
      setBusy(false);
    }
  };

  const onKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      commit();
    }
    if (event.key === "Escape") cancelEdit();
  };

  const editor = (placeholder) => (
    <span className="inline-flex items-center gap-1 rounded-full border border-pomegranate-400 bg-pomegranate-50 px-2.5 py-1">
      <input
        autoFocus
        value={draft}
        maxLength={60}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className="w-28 bg-transparent text-xs text-pomegranate-800 outline-none placeholder:text-pomegranate-300"
      />
      <button
        type="button"
        onClick={commit}
        disabled={!draft.trim() || busy}
        aria-label="Save symptom"
        className="text-pomegranate-600 disabled:opacity-40"
      >
        {busy ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <Check className="h-3 w-3" />
        )}
      </button>
      <button
        type="button"
        onClick={cancelEdit}
        aria-label="Cancel"
        className="text-pomegranate-400 hover:text-pomegranate-600"
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  );

  return (
    <div className="space-y-2">
      <Label>Symptoms</Label>
      <div className="flex flex-wrap items-center gap-2">
        {SYMPTOM_OPTIONS.map((symptom) => (
          <button
            key={symptom}
            type="button"
            onClick={() => toggle(symptom)}
            className={`${BUBBLE} ${
              value.includes(symptom)
                ? "border-pomegranate-400 bg-pomegranate-50 text-pomegranate-700"
                : "border-slate-200 text-slate-600 hover:border-pomegranate-200"
            }`}
          >
            {symptom.replace(/_/g, " ")}
          </button>
        ))}

        {custom.map((item) =>
          editing === item.id ? (
            <React.Fragment key={item.id}>{editor("Symptom")}</React.Fragment>
          ) : (
            <span key={item.id} className="relative inline-flex">
              <button
                type="button"
                onClick={() => toggle(item.name)}
                className={`${BUBBLE} ${
                  value.includes(item.name)
                    ? "border-pomegranate-400 bg-pomegranate-50 text-pomegranate-700"
                    : "border-slate-200 text-slate-600 hover:border-pomegranate-200"
                }`}
              >
                {item.name}
              </button>
              <button
                type="button"
                onClick={() => startEdit(item.id, item.name)}
                aria-label={`Edit ${item.name}`}
                className="absolute -right-1.5 -top-1.5 rounded-full border border-pomegranate-200 bg-white p-[3px] text-pomegranate-500 shadow-sm transition hover:text-pomegranate-700"
              >
                <Pencil className="h-2.5 w-2.5" />
              </button>
            </span>
          )
        )}

        {editing === "new" ? (
          editor("New symptom")
        ) : (
          <button
            type="button"
            onClick={() => startEdit("new")}
            className="inline-flex items-center gap-1 rounded-full border border-dashed border-pomegranate-300 px-3 py-1.5 text-xs text-pomegranate-600 transition hover:border-pomegranate-400 hover:bg-pomegranate-50"
          >
            <Plus className="h-3 w-3" />
            Add Custom Symptom
          </button>
        )}
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}