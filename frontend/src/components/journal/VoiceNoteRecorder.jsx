import React, { useEffect, useRef, useState } from "react";
import { Loader2, Mic, Square, Trash2 } from "lucide-react";
import { base44 } from "@/api/base44Client";

const clock = (seconds) =>
  `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

// Records a single voice note in the browser and stores it privately, keeping
// only the file uri in the entry. The saved note can be played back and removed.
export default function VoiceNoteRecorder({ fileUri, onChange }) {
  const [recording, setRecording] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState("");
  const [error, setError] = useState("");
  const recorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    let active = true;
    setError("");
    setAudioUrl("");
    if (!fileUri) return;
    base44.integrations.Core.CreateFileSignedUrl({ file_uri: fileUri })
      .then(({ signed_url }) => active && setAudioUrl(signed_url))
      .catch(() => active && setError("Couldn't load your saved voice note."));
    return () => {
      active = false;
    };
  }, [fileUri]);

  // Leaving the page mid-recording must release the microphone.
  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      streamRef.current?.getTracks().forEach((track) => track.stop());
      if (recorderRef.current?.state === "recording") recorderRef.current.stop();
    };
  }, []);

  const upload = async (blob) => {
    setUploading(true);
    try {
      const file = new File([blob], `voice-note-${Date.now()}.webm`, {
        type: blob.type || "audio/webm",
      });
      const { file_uri } = await base44.integrations.Core.UploadPrivateFile({
        file,
      });
      onChange(file_uri);
    } catch (e) {
      setError("Couldn't save your voice note. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const start = async () => {
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });
        if (blob.size) upload(blob);
      };
      recorder.start();
      recorderRef.current = recorder;
      setSeconds(0);
      setRecording(true);
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
    } catch (e) {
      setError(
        "We couldn't reach your microphone. Allow microphone access and try again."
      );
    }
  };

  const stop = () => {
    clearInterval(timerRef.current);
    setRecording(false);
    recorderRef.current?.stop();
  };

  return (
    <div className="space-y-2">
      {fileUri && !recording ? (
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-pomegranate-100 bg-pomegranate-50/60 p-3">
          {audioUrl ? (
            <audio controls src={audioUrl} className="h-10 w-full max-w-xs" />
          ) : (
            <span className="flex items-center gap-2 text-sm text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading your voice note…
            </span>
          )}
          <button
            type="button"
            onClick={() => onChange("")}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
            Remove
          </button>
        </div>
      ) : recording ? (
        <button
          type="button"
          onClick={stop}
          className="inline-flex items-center gap-2 rounded-full bg-pomegranate-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-pomegranate-700"
        >
          <Square className="h-4 w-4" />
          Stop recording · {clock(seconds)}
        </button>
      ) : (
        <button
          type="button"
          onClick={start}
          disabled={uploading}
          className="inline-flex items-center gap-2 rounded-full border border-pomegranate-200 bg-white px-5 py-2.5 text-sm font-medium text-pomegranate-700 hover:bg-pomegranate-50 disabled:opacity-60"
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Mic className="h-4 w-4" />
          )}
          {uploading ? "Saving your voice note…" : "Record a voice note"}
        </button>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}