"use client";

import { useMemo, useState } from "react";
import { Boxes, ChevronDown, ChevronUp } from "lucide-react";
import { useBaseStore } from "@/store/useBaseStore";
import { calculateBOM } from "@/utils/raidMath";

export default function FloatingBOMWindow() {
  const buildItems = useBaseStore((state) => state.buildItems);
  const currentMap = useBaseStore((state) => state.currentMap);
  const [collapsed, setCollapsed] = useState(false);

  const bom = useMemo(
    () => calculateBOM(buildItems, currentMap),
    [buildItems, currentMap]
  );

  const entries = useMemo(
    () => Object.entries(bom.materials).sort((a, b) => b[1] - a[1]),
    [bom.materials]
  );

  return (
    <div className="w-64 rounded-lg bg-zinc-900/90 text-sm text-white shadow-xl ring-1 ring-zinc-700 backdrop-blur">
      <button
        type="button"
        onClick={() => setCollapsed((c) => !c)}
        className="flex w-full items-center justify-between rounded-t-lg px-3 py-2 hover:bg-zinc-800/60"
      >
        <span className="flex items-center gap-2 font-medium">
          <Boxes className="h-4 w-4 text-emerald-400" />
          Bill of Materials
        </span>
        {collapsed ? (
          <ChevronDown className="h-4 w-4 text-zinc-400" />
        ) : (
          <ChevronUp className="h-4 w-4 text-zinc-400" />
        )}
      </button>

      {!collapsed && (
        <div className="border-t border-zinc-700/60 px-3 py-2">
          {entries.length === 0 ? (
            <p className="py-2 text-xs text-zinc-500">No pieces placed yet.</p>
          ) : (
            <ul className="space-y-1">
              {entries.map(([material, qty]) => (
                <li
                  key={material}
                  className="flex items-center justify-between text-xs"
                >
                  <span className="text-zinc-300">{material}</span>
                  <span className="font-medium text-white">{qty}</span>
                </li>
              ))}
            </ul>
          )}
          {bom.unmappedCount > 0 && (
            <p className="mt-2 border-t border-zinc-700/60 pt-2 text-[11px] text-amber-400">
              ⚠ {bom.unmappedCount} piece(s) have no recipe in {currentMap}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
