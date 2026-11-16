import React, { useRef, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FolderOpen, Images, ImageIcon, Loader2 } from "lucide-react";

const MAX_BYTES = 10 * 1024 * 1024;

// Read the image as base64 so the function can upload it itself — the file it
// signs is then always the one just sent, never a caller-supplied URI.
const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      const comma = result.indexOf(",");
      resolve(comma >= 0 ? result.slice(comma + 1) : result);
    };
    reader.onerror = () => reject(reader.error || new Error("read failed"));
    reader.readAsDataURL(file);
  });

export default function ImportFromScreenshot({ onImported }) {
  const albumRef = useRef(null);
  const fileRef = useRef(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [readCount, setReadCount] = useState(0);

  const handleFiles = async (files) => {
    const list = Array.from(files || []);
    if (!list.length) return;
    setError("");
    setMessage("");

    if (list.some((file) => !file.type.startsWith("image/"))) {
      setError("Please choose image files.");
      return;
    }
    if (list.some((file) => file.size > MAX_BYTES)) {
      setError("Each image needs to be under 10 MB.");
      return;
    }

    setBusy(true);
    setProgress({ done: 0, total: list.length });

    let imported = 0;
    let read = 0;
    let failed = 0;

    for (let i = 0; i < list.length; i += 1) {
      setProgress({ done: i, total: list.length });
      try {
        const image_base64 = await toBase64(list[i]);
        const response = await base44.functions.invoke("importCycleScreenshot", {
          image_base64,
          mime_type: list[i].type,
        });
        const days = response?.data?.days || [];
        if (days.length) read += 1;
        imported += onImported(days);
      } catch (e) {
        failed += 1;
      }
    }

    setProgress({ done: list.length, total: list.length });
    setBusy(false);
    setReadCount((prev) => prev + read);

    const failedNote = failed ? ` ${failed} couldn't be read.` : "";

    if (failed === list.length) {
      setError("We couldn't read those screenshots. Please try again.");
    } else if (!imported) {
      setMessage(
        `No new period days found in ${
          list.length === 1 ? "that screenshot" : "those screenshots"
        }.${failedNote}`
      );
    } else {
      setMessage(
        `${imported} day${imported === 1 ? "" : "s"} added — check them below, then save.${failedNote}`
      );
    }
  };

  // The picker dialog takes a moment to unmount, and until it does the page is
  // still locked by it, so give it a tick before opening the file chooser.
  const openPicker = (open) => {
    setPickerOpen(false);
    window.setTimeout(open, 80);
  };

  const openAlbum = () => openPicker(() => albumRef.current?.click());

  const openFileBrowser = () =>
    openPicker(async () => {
      if (typeof window.showOpenFilePicker === "function") {
        try {
          const handles = await window.showOpenFilePicker({
            multiple: true,
            types: [
              {
                description: "Images",
                accept: {
                  "image/*": [".png", ".jpg", ".jpeg", ".webp", ".gif", ".heic"],
                },
              },
            ],
          });
          const files = await Promise.all(
            handles.map((handle) => handle.getFile())
          );
          handleFiles(files);
          return;
        } catch (e) {
          if (e?.name === "AbortError") return;
        }
      }
      fileRef.current?.click();
    });

  const onInputChange = (e) => {
    // Read the files before clearing the input — resetting it can empty the list.
    const list = Array.from(e.target.files || []);
    e.target.value = "";
    handleFiles(list);
  };

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-5 sm:p-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-pomegranate-100 text-pomegranate-600">
          <Images className="h-5 w-5" />
        </div>
        <div className="min-w-[12rem] flex-1">
          <h2 className="font-heading text-lg font-semibold text-slate-800">
            Import from screenshots
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Already tracking elsewhere? Upload as many screenshots of your other
            app's calendar as you like and we'll mark those days for you.
          </p>
          {readCount > 0 && (
            <p className="mt-2 text-xs uppercase tracking-wider text-pomegranate-400">
              {readCount} screenshot{readCount === 1 ? "" : "s"} read
            </p>
          )}
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => setPickerOpen(true)}
          disabled={busy}
          className="rounded-full border-pomegranate-200 px-5 text-pomegranate-600 hover:bg-pomegranate-50"
        >
          {busy ? (
            <>
              <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
              Reading {Math.min(progress.done + 1, progress.total)} of{" "}
              {progress.total}…
            </>
          ) : readCount > 0 ? (
            "Add more screenshots"
          ) : (
            "Choose screenshots"
          )}
        </Button>
      </div>

      {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
      {message && (
        <p className="mt-3 text-sm text-pomegranate-700">{message}</p>
      )}

      <input
        ref={albumRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={onInputChange}
      />
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={onInputChange}
      />

      <Dialog open={pickerOpen} onOpenChange={setPickerOpen} modal={false}>
        <DialogContent className="max-w-sm rounded-3xl">
          <DialogHeader>
            <DialogTitle className="font-heading text-lg">
              Add screenshots
            </DialogTitle>
            <DialogDescription>
              Where are your screenshots? You can add as many as you like.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-2">
            <button
              type="button"
              onClick={openAlbum}
              className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 text-left transition-colors hover:bg-pomegranate-50"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pomegranate-100 text-pomegranate-600">
                <ImageIcon className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-sm font-medium text-slate-800">
                  Photo album
                </span>
                <span className="block text-xs text-slate-500">
                  Your camera roll and saved photos
                </span>
              </span>
            </button>

            <button
              type="button"
              onClick={openFileBrowser}
              className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 text-left transition-colors hover:bg-pomegranate-50"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pomegranate-100 text-pomegranate-600">
                <FolderOpen className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-sm font-medium text-slate-800">
                  Choose a file
                </span>
                <span className="block text-xs text-slate-500">
                  Browse your files and folders
                </span>
              </span>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}