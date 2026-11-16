import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";

// Plays a private voice note back: the stored file uri is exchanged for a
// short-lived signed url each time the note is opened.
export default function JournalNotePlayer({ fileUri }) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setUrl("");
    setError("");
    base44.integrations.Core.CreateFileSignedUrl({ file_uri: fileUri })
      .then(({ signed_url }) => active && setUrl(signed_url))
      .catch(() => active && setError("Couldn't load this voice note."));
    return () => {
      active = false;
    };
  }, [fileUri]);

  if (error) return <p className="text-sm text-destructive">{error}</p>;

  if (!url) {
    return (
      <span className="flex items-center gap-2 text-sm text-slate-500">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading voice note…
      </span>
    );
  }

  return <audio controls src={url} className="h-10 w-full" />;
}