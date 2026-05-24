"use client";

import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";
import { exportBaseToFile } from "@/utils/storageUtils";
import type { BuildItem } from "@/types";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: BuildItem[];
}

export default function ExportModal({ isOpen, onClose, items }: ExportModalProps) {
  const [filename, setFilename] = useState("unturned_base");

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleExport = () => {
    exportBaseToFile(items, filename);
    onClose();
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleExport();
  };

  return (
    <div
      className="fixed inset-0 z-30 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-lg bg-zinc-900 p-5 shadow-2xl ring-1 ring-zinc-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Exportar Base</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label
            htmlFor="export-filename"
            className="mb-1 block text-sm text-zinc-300"
          >
            Nome do arquivo
          </label>
          <div className="mb-4 flex items-center gap-2 rounded bg-zinc-800 px-3 py-2 ring-1 ring-zinc-700 focus-within:ring-emerald-500">
            <input
              id="export-filename"
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              autoFocus
              className="flex-1 bg-transparent text-sm text-white outline-none"
              placeholder="unturned_base"
            />
            <span className="text-xs text-zinc-500">.json</span>
          </div>

          <p className="mb-4 text-xs text-zinc-500">
            {items.length} {items.length === 1 ? "peça" : "peças"} serão exportadas.
          </p>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded bg-zinc-800 px-4 py-2 text-sm text-white hover:bg-zinc-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 rounded bg-emerald-600/90 px-4 py-2 text-sm text-white hover:bg-emerald-600"
            >
              <Download className="h-4 w-4" />
              Exportar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
