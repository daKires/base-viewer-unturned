"use client";

import { useEffect, useMemo } from "react";
import { useBaseStore } from "@/store/useBaseStore";
import { getVariantsForCategory } from "@/utils/raidMath";
import type { ItemType, Tool } from "@/types";

const ATTACHMENT_TOOLS: ReadonlySet<Tool> = new Set([
  "standard_door",
  "double_door",
  "garage_door",
]);

function isBuildableCategory(tool: Tool | null): tool is ItemType {
  return tool !== null && !ATTACHMENT_TOOLS.has(tool);
}

export default function VariantSelector() {
  const selectedTool = useBaseStore((state) => state.selectedTool);
  const currentMap = useBaseStore((state) => state.currentMap);
  const selectedVariantId = useBaseStore((state) => state.selectedVariantId);
  const setSelectedVariantId = useBaseStore(
    (state) => state.setSelectedVariantId
  );

  const variants = useMemo(() => {
    if (!isBuildableCategory(selectedTool)) return [];
    return getVariantsForCategory(selectedTool, currentMap);
  }, [selectedTool, currentMap]);

  useEffect(() => {
    if (variants.length === 0) return;
    if (
      !selectedVariantId ||
      !variants.find((v) => v.id === selectedVariantId)
    ) {
      setSelectedVariantId(variants[0].id);
    }
  }, [variants, selectedVariantId, setSelectedVariantId]);

  if (variants.length === 0) return null;

  return (
    <div className="mt-1 flex flex-wrap gap-1 rounded-md bg-zinc-900/80 px-2 py-2 backdrop-blur">
      {variants.map((variant) => {
        const recipeText = variant.recipe.materials
          .map((m) => `${m.quantity}× ${m.material}`)
          .join(", ");
        const active = selectedVariantId === variant.id;
        return (
          <button
            key={variant.id}
            type="button"
            onClick={() => setSelectedVariantId(variant.id)}
            title={`${variant.hp} HP — ${recipeText}`}
            className={
              active
                ? "rounded bg-emerald-600/90 px-2 py-1 text-xs text-white ring-1 ring-emerald-300"
                : "rounded bg-zinc-800 px-2 py-1 text-xs text-zinc-200 hover:bg-zinc-700"
            }
          >
            {variant.name}
          </button>
        );
      })}
    </div>
  );
}
