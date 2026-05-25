"use client";

import { Map } from "lucide-react";
import { MAP_OPTIONS } from "@/data/unturned-data";
import { useBaseStore } from "@/store/useBaseStore";

export default function MapSelector() {
  const currentMap = useBaseStore((state) => state.currentMap);
  const setCurrentMap = useBaseStore((state) => state.setCurrentMap);

  return (
    <div className="flex items-center gap-2 rounded-lg bg-zinc-900/90 px-3 py-2 text-sm text-white shadow-xl ring-1 ring-zinc-700 backdrop-blur">
      <Map className="h-4 w-4 text-zinc-400" />
      <span className="text-xs text-zinc-400">Map:</span>
      <div className="flex gap-1">
        {MAP_OPTIONS.map((map) => (
          <button
            key={map}
            type="button"
            onClick={() => setCurrentMap(map)}
            className={
              currentMap === map
                ? "rounded bg-emerald-600/90 px-2.5 py-1 text-xs font-medium text-white ring-1 ring-emerald-300"
                : "rounded bg-zinc-800 px-2.5 py-1 text-xs text-zinc-300 hover:bg-zinc-700"
            }
          >
            {map}
          </button>
        ))}
      </div>
    </div>
  );
}
