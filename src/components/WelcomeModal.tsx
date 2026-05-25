"use client";

import { useEffect, useState } from "react";
import { Info } from "lucide-react";

const STORAGE_KEY = "base-viewer-welcome-acknowledged";

export default function WelcomeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [acknowledged, setAcknowledged] = useState(false);

  useEffect(() => {
    try {
      const seen = window.localStorage.getItem(STORAGE_KEY);
      if (!seen) setIsOpen(true);
    } catch {
      setIsOpen(true);
    }
  }, []);

  if (!isOpen) return null;

  const handleContinue = () => {
    if (!acknowledged) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore
    }
    setIsOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg bg-zinc-900 p-6 shadow-2xl ring-1 ring-zinc-700">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-full bg-emerald-600/20 p-2 text-emerald-400">
            <Info className="h-5 w-5" />
          </div>
          <h2 className="text-lg font-semibold text-white">Welcome</h2>
        </div>

        <div className="mb-5 space-y-3 text-sm leading-relaxed text-zinc-300">
          <p>
            This is a free project developed to help build bases in
            Unturned.
          </p>
          <p>
            We&apos;re in an early stage and I&apos;m still developing
            updates. Suggestions are welcome!
          </p>
        </div>

        <label className="mb-5 flex cursor-pointer select-none items-center gap-2 text-sm text-zinc-200">
          <input
            type="checkbox"
            checked={acknowledged}
            onChange={(e) => setAcknowledged(e.target.checked)}
            className="h-4 w-4 cursor-pointer accent-emerald-500"
          />
          I understand
        </label>

        <button
          type="button"
          onClick={handleContinue}
          disabled={!acknowledged}
          className="w-full rounded bg-emerald-600/90 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-emerald-600/90"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
