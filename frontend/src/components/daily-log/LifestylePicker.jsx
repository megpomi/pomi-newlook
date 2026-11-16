import React, { useEffect, useState } from "react";
import { Check, Loader2, Pencil, Plus, X } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { TogglePill } from "@/components/daily-log/DailyLogFields";

// The user's own lifestyle sliders: saved for good, with a small pencil in the
// corner of each to rename it. `value` holds the names that are switched on.
export default function LifestylePicker({ value, onChange }) {
  const [custom, setCustom] = useState([]);
  const [editing, setEditing] = useState(null); // "new" or a CustomLifestyle id
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    base44.entities.CustomLifestyle.list({ sort: "created_date", limit: 50 })
      .then((page) => active && setCustom(page.items))
      .catch(() => active && setError("Couldn't load your own trackers."));
    return () => {
      active = false;
    };
  }, []);

  const toggle = (name, checked) =>
    onChange(
      checked
        ? [...value.filter((item) => item !== name), name]
        : value.filter((item) => item !== name)
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
        const existing = custom.find(
          (item) => item.name.toLowerCase() === name.toLowerCase()
        );
        if (existing) {
          if (!value.includes(existing.name)) toggle(existing.name, true);
        } else {
          const record = await base44.entities.CustomLifestyle.create({ name });
          setCustom((current) => [...current, record]);
          onChange([...value, name]);
        }
      } else {
        const previous = custom.find((item) => item.id === editing);
        await base44.entities.CustomLifestyle.update(editing, { name });
        setCustom((current) =>
          current.map((item) => (item.id === editing ? { ...item, name } : item))
        );
        if (previous && value.includes(previous.name)) {
          onChange([...value.filter((item) => item !== previous.name), name]);
        }
      }
      cancelEdit();
    } catch (e) {
      setError(e?.message || "Couldn't save that tracker.");
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

  return (
    <>
      {custom.map((item) =>
        editing === item.id ? (
          <span
            key={item.id}
            className="inline-flex items-center gap-1 rounded-full border border-pomegranate-400 bg-pomegranate-50 px-3 py-1.5"
          >
            <input
              autoFocus
              value={draft}
              maxLength={40}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Tracker"
              className="w-24 bg-transparent text-xs text-pomegranate-800 outline-none placeholder:text-pomegranate-300"
            />
            <button
              type="button"
              onClick={commit}
              disabled={!draft.trim() || busy}
              aria-label="Save tracker"
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
        ) : (
          <span key={item.id} className="relative inline-flex">
            <TogglePill
              label={item.name}
              checked={value.includes(item.name)}
              onChange={(checked) => toggle(item.name, checked)}
            />
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
        <span className="inline-flex items-center gap-1 rounded-full border border-pomegranate-400 bg-pomegranate-50 px-3 py-1.5">
          <input
            autoFocus
            value={draft}
            maxLength={40}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="New tracker"
            className="w-24 bg-transparent text-xs text-pomegranate-800 outline-none placeholder:text-pomegranate-300"
          />
          <button
            type="button"
            onClick={commit}
            disabled={!draft.trim() || busy}
            aria-label="Save tracker"
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
      ) : (
        <button
          type="button"
          onClick={() => startEdit("new")}
          className="inline-flex items-center gap-1 rounded-full border border-dashed border-pomegranate-300 px-3 py-1.5 text-xs text-pomegranate-600 transition hover:border-pomegranate-400 hover:bg-pomegranate-50"
        >
          <Plus className="h-3 w-3" />
          Add Custom Lifestyle Tracker
        </button>
      )}

      {error && (
        <span className="basis-full text-xs text-destructive">{error}</span>
      )}
    </>
  );
}