"use client";

import { useMemo } from "react";
import { Bomb, Wrench } from "lucide-react";
import { EXPLOSIVES_BY_MAP } from "@/data/unturned-data";
import { useBaseStore } from "@/store/useBaseStore";
import { isRaidSimulatorEnabled } from "@/utils/featureFlags";

export default function RaidSimulatorPanel() {
  if (!isRaidSimulatorEnabled()) return null;
  return <RaidSimulatorPanelInner />;
}

function RaidSimulatorPanelInner() {
  const isRaidSimulatorMode = useBaseStore((s) => s.isRaidSimulatorMode);
  const toggleRaidSimulatorMode = useBaseStore(
    (s) => s.toggleRaidSimulatorMode
  );
  const selectedExplosiveId = useBaseStore((s) => s.selectedExplosiveId);
  const setSelectedExplosiveId = useBaseStore((s) => s.setSelectedExplosiveId);
  const currentMap = useBaseStore((s) => s.currentMap);
  const buildItems = useBaseStore((s) => s.buildItems);
  const repairAll = useBaseStore((s) => s.repairAll);

  const explosives = EXPLOSIVES_BY_MAP[currentMap];
  const hasDamage = useMemo(
    () => buildItems.some((it) => it.currentHp !== undefined),
    [buildItems]
  );

  return (
    <div className="w-64 rounded-lg bg-zinc-900/90 text-sm text-white shadow-xl ring-1 ring-zinc-700 backdrop-blur">
      <button
        type="button"
        onClick={toggleRaidSimulatorMode}
        className={
          "flex w-full items-center justify-between rounded-t-lg px-3 py-2 " +
          (isRaidSimulatorMode
            ? "bg-rose-600/30 hover:bg-rose-600/40"
            : "hover:bg-zinc-800/60")
        }
      >
        <span className="flex items-center gap-2 font-medium">
          <Bomb
            className={
              isRaidSimulatorMode
                ? "h-4 w-4 text-rose-300"
                : "h-4 w-4 text-rose-400"
            }
          />
          Raid Simulator
        </span>
        <span
          className={
            isRaidSimulatorMode
              ? "rounded bg-rose-500/40 px-1.5 py-0.5 text-[10px] font-semibold text-rose-100"
              : "text-xs text-zinc-500"
          }
        >
          {isRaidSimulatorMode ? "ON" : "OFF"}
        </span>
      </button>

      {isRaidSimulatorMode && (
        <div className="border-t border-zinc-700/60 px-3 py-2">
          <p className="mb-2 text-[11px] text-zinc-500">
            Pick an explosive and click on the canvas to detonate.
          </p>
          <ul className="space-y-1">
            {explosives.map((e) => {
              const active = selectedExplosiveId === e.id;
              return (
                <li key={e.id}>
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedExplosiveId(active ? null : e.id)
                    }
                    className={
                      "flex w-full items-center justify-between rounded px-2 py-1.5 text-xs transition-colors " +
                      (active
                        ? "bg-cyan-600/90 ring-1 ring-cyan-300"
                        : "bg-zinc-800 hover:bg-zinc-700")
                    }
                  >
                    <span className="text-left">{e.name}</span>
                    <span className="ml-2 text-[11px] text-zinc-200">
                      {e.damage} dmg · {e.splashRadius}m
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>

          {hasDamage && (
            <button
              type="button"
              onClick={repairAll}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded bg-emerald-600/90 px-2 py-1.5 text-xs text-white hover:bg-emerald-600"
            >
              <Wrench className="h-3.5 w-3.5" />
              Repair All
            </button>
          )}
        </div>
      )}
    </div>
  );
}
