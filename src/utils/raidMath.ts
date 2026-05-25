import { STRUCTURES_BY_MAP } from "@/data/unturned-data";
import type {
  AttachmentType,
  BuildItem,
  Explosive,
  ItemType,
  MapContext,
  Material,
  Structure,
} from "@/types";

export function getStructureById(
  id: string,
  map: MapContext
): Structure | null {
  return STRUCTURES_BY_MAP[map].find((s) => s.id === id) ?? null;
}

export function getStructureForItem(
  item: BuildItem,
  map: MapContext
): Structure | null {
  if (item.structureId) {
    const direct = getStructureById(item.structureId, map);
    if (direct) return direct;
  }
  return (
    STRUCTURES_BY_MAP[map].find((s) => s.category === item.type) ?? null
  );
}

export function getAttachmentStructure(
  attachmentType: AttachmentType | null | undefined,
  map: MapContext
): Structure | null {
  if (!attachmentType) return null;
  return (
    STRUCTURES_BY_MAP[map].find((s) => s.category === attachmentType) ?? null
  );
}

export function getVariantsForCategory(
  category: ItemType,
  map: MapContext
): Structure[] {
  return STRUCTURES_BY_MAP[map].filter((s) => s.category === category);
}

export function calculateRaidCost(
  structureHp: number,
  explosives: Explosive[]
): Record<string, number> {
  const out: Record<string, number> = {};
  for (const e of explosives) {
    if (e.damage <= 0) continue;
    out[e.name] = Math.ceil(structureHp / e.damage);
  }
  return out;
}

export interface BOMResult {
  materials: Record<Material, number>;
  unmappedCount: number;
}

export function calculateBOM(
  placedItems: BuildItem[],
  map: MapContext
): BOMResult {
  const materials: Record<Material, number> = {};
  let unmappedCount = 0;

  for (const item of placedItems) {
    const structure = getStructureForItem(item, map);
    if (!structure) {
      unmappedCount += 1;
      continue;
    }

    for (const entry of structure.recipe.materials) {
      materials[entry.material] =
        (materials[entry.material] ?? 0) + entry.quantity;
    }

    const attachment = getAttachmentStructure(item.attachmentType, map);
    if (attachment) {
      for (const entry of attachment.recipe.materials) {
        materials[entry.material] =
          (materials[entry.material] ?? 0) + entry.quantity;
      }
    }
  }

  return { materials, unmappedCount };
}
