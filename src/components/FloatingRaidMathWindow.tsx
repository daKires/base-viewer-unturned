"use client";

import { useMemo } from "react";
import { Bomb, X } from "lucide-react";
import { EXPLOSIVES_BY_MAP } from "@/data/unturned-data";
import { useBaseStore } from "@/store/useBaseStore";
import { calculateRaidCost, getStructureForItem } from "@/utils/raidMath";

export default function FloatingRaidMathWindow() {
  const buildItems = useBaseStore((state) => state.buildItems);
  const selectedIds = useBaseStore((state) => state.selectedIds);
  const currentMap = useBaseStore((state) => state.currentMap);
  const clearSelection = useBaseStore((state) => state.clearSelection);

  const selectedStructure = useMemo(() => {
    if (selectedIds.length === 0) return null;
    const item = buildItems.find((it) => it.id === selectedIds[0]);
    if (!item) return null;
    return getStructureForItem(item, currentMap);
  }, [buildItems, selectedIds, currentMap]);

  const costs = useMemo(() => {
    if (!selectedStructure) return null;
    return calculateRaidCost(
      selectedStructure.hp,
      EXPLOSIVES_BY_MAP[currentMap]
    );
  }, [selectedStructure, currentMap]);

  if (!selectedStructure || !costs) return null;

  return (
    <div className="w-64 rounded-lg bg-zinc-900/90 text-sm text-white shadow-xl ring-1 ring-zinc-700 backdrop-blur">
      <div className="flex items-center justify-between px-3 py-2">
        <span className="flex items-center gap-2 font-medium">
          <Bomb className="h-4 w-4 text-rose-400" />
          Raid Math
        </span>
        <button
          type="button"
          onClick={clearSelection}
          className="rounded p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white"
          title="Clear selection"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="border-t border-zinc-700/60 px-3 py-2">
        <p className="mb-1 text-xs font-medium text-zinc-200">
          {selectedStructure.name}
        </p>
        <p className="mb-2 text-[11px] text-zinc-500">
          {selectedStructure.hp} HP
        </p>

        <ul className="space-y-1">
          {Object.entries(costs).map(([name, qty]) => (
            <li
              key={name}
              className="flex items-center justify-between text-xs"
            >
              <span className="text-zinc-300">{name}</span>
              <span className="font-medium text-white">×{qty}</span>
            </li>
          ))}
        </ul>

        {selectedIds.length > 1 && (
          <p className="mt-2 border-t border-zinc-700/60 pt-2 text-[11px] text-zinc-500">
            Showing first of {selectedIds.length} selected
          </p>
        )}
      </div>
    </div>
  );
}
