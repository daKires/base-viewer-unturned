import type { Explosive, MapContext, Structure } from "@/types";

// ============================================================================
// VANILLA
// ============================================================================

const VANILLA_PINE_RECIPE = { materials: [{ material: "Pine Logs", quantity: 3 }] };
const VANILLA_METAL_RECIPE = {
  materials: [{ material: "Metal Sheets", quantity: 3 }],
};
const VANILLA_BRICK_RECIPE = { materials: [{ material: "Bricks", quantity: 3 }] };

export const VANILLA_STRUCTURES: Structure[] = [
  // Walls (3 variants)
  {
    id: "vanilla-pine-wall",
    name: "Pine Wall",
    hp: 400,
    map: "Vanilla",
    category: "wall",
    recipe: VANILLA_PINE_RECIPE,
  },
  {
    id: "vanilla-brick-wall",
    name: "Brick Wall",
    hp: 800,
    map: "Vanilla",
    category: "wall",
    recipe: VANILLA_BRICK_RECIPE,
  },
  {
    id: "vanilla-metal-wall",
    name: "Metal Wall",
    hp: 1200,
    map: "Vanilla",
    category: "wall",
    recipe: VANILLA_METAL_RECIPE,
  },

  // Floors
  {
    id: "vanilla-pine-floor",
    name: "Pine Floor",
    hp: 400,
    map: "Vanilla",
    category: "floor",
    recipe: VANILLA_PINE_RECIPE,
  },
  {
    id: "vanilla-metal-floor",
    name: "Metal Floor",
    hp: 1200,
    map: "Vanilla",
    category: "floor",
    recipe: VANILLA_METAL_RECIPE,
  },

  // Triangle Floors
  {
    id: "vanilla-pine-triangle-floor",
    name: "Pine Triangle Floor",
    hp: 400,
    map: "Vanilla",
    category: "triangle_floor",
    recipe: VANILLA_PINE_RECIPE,
  },
  {
    id: "vanilla-metal-triangle-floor",
    name: "Metal Triangle Floor",
    hp: 1200,
    map: "Vanilla",
    category: "triangle_floor",
    recipe: VANILLA_METAL_RECIPE,
  },

  // Windows
  {
    id: "vanilla-pine-window",
    name: "Pine Window",
    hp: 400,
    map: "Vanilla",
    category: "window",
    recipe: VANILLA_PINE_RECIPE,
  },
  {
    id: "vanilla-metal-window",
    name: "Metal Window",
    hp: 1200,
    map: "Vanilla",
    category: "window",
    recipe: VANILLA_METAL_RECIPE,
  },

  // Doorways
  {
    id: "vanilla-pine-doorway",
    name: "Pine Doorway",
    hp: 400,
    map: "Vanilla",
    category: "doorway",
    recipe: VANILLA_PINE_RECIPE,
  },
  {
    id: "vanilla-metal-doorway",
    name: "Metal Doorway",
    hp: 1200,
    map: "Vanilla",
    category: "doorway",
    recipe: VANILLA_METAL_RECIPE,
  },

  // Garage Frames
  {
    id: "vanilla-pine-garage-frame",
    name: "Pine Garage Frame",
    hp: 400,
    map: "Vanilla",
    category: "garage_frame",
    recipe: VANILLA_PINE_RECIPE,
  },
  {
    id: "vanilla-metal-garage-frame",
    name: "Metal Garage Frame",
    hp: 1200,
    map: "Vanilla",
    category: "garage_frame",
    recipe: VANILLA_METAL_RECIPE,
  },

  // Door attachments
  {
    id: "vanilla-metal-door",
    name: "Metal Door",
    hp: 1000,
    map: "Vanilla",
    category: "standard_door",
    recipe: {
      materials: [
        { material: "Metal Sheets", quantity: 2 },
        { material: "Metal Scrap", quantity: 2 },
      ],
    },
  },
];

export const VANILLA_EXPLOSIVES: Explosive[] = [
  {
    id: "vanilla-c4",
    name: "Demolition Charge (C4)",
    damage: 1000,
    map: "Vanilla",
  },
  { id: "vanilla-rocket", name: "Rocket", damage: 750, map: "Vanilla" },
  {
    id: "vanilla-dragonfang",
    name: "Dragonfang Box (HMG)",
    damage: 50,
    map: "Vanilla",
  },
];

// ============================================================================
// ARID
// ============================================================================

const ARID_WOODEN_RECIPE = {
  materials: [
    { material: "Wooden Planks", quantity: 4 },
    { material: "Nails", quantity: 2 },
  ],
};
const ARID_SCRAP_METAL_RECIPE = {
  materials: [
    { material: "Scrap Metal", quantity: 6 },
    { material: "Bolts", quantity: 3 },
    { material: "Welding Torch (Uses)", quantity: 1 },
  ],
};

export const ARID_STRUCTURES: Structure[] = [
  // Walls (4 variants)
  {
    id: "arid-wooden-wall",
    name: "Wooden Wall",
    hp: 600,
    map: "Arid",
    category: "wall",
    recipe: ARID_WOODEN_RECIPE,
  },
  {
    id: "arid-brick-wall",
    name: "Brick Wall",
    hp: 1000,
    map: "Arid",
    category: "wall",
    recipe: {
      materials: [
        { material: "Clay", quantity: 5 },
        { material: "Cement Mix", quantity: 1 },
      ],
    },
  },
  {
    id: "arid-scrap-metal-wall",
    name: "Scrap Metal Wall",
    hp: 1500,
    map: "Arid",
    category: "wall",
    recipe: ARID_SCRAP_METAL_RECIPE,
  },
  {
    id: "arid-adamantine-wall",
    name: "Adamantine Wall",
    hp: 2500,
    map: "Arid",
    category: "wall",
    recipe: {
      materials: [
        { material: "Adamantine Bars", quantity: 4 },
        { material: "High-Tech Components", quantity: 2 },
        { material: "Welding Torch (Uses)", quantity: 2 },
      ],
    },
  },

  // Floors
  {
    id: "arid-wooden-floor",
    name: "Wooden Floor",
    hp: 600,
    map: "Arid",
    category: "floor",
    recipe: ARID_WOODEN_RECIPE,
  },
  {
    id: "arid-scrap-metal-floor",
    name: "Scrap Metal Floor",
    hp: 1500,
    map: "Arid",
    category: "floor",
    recipe: ARID_SCRAP_METAL_RECIPE,
  },

  // Triangle Floors
  {
    id: "arid-wooden-triangle-floor",
    name: "Wooden Triangle Floor",
    hp: 600,
    map: "Arid",
    category: "triangle_floor",
    recipe: ARID_WOODEN_RECIPE,
  },
  {
    id: "arid-scrap-metal-triangle-floor",
    name: "Scrap Metal Triangle Floor",
    hp: 1500,
    map: "Arid",
    category: "triangle_floor",
    recipe: ARID_SCRAP_METAL_RECIPE,
  },

  // Windows
  {
    id: "arid-wooden-window",
    name: "Wooden Window",
    hp: 600,
    map: "Arid",
    category: "window",
    recipe: ARID_WOODEN_RECIPE,
  },
  {
    id: "arid-scrap-metal-window",
    name: "Scrap Metal Window",
    hp: 1500,
    map: "Arid",
    category: "window",
    recipe: ARID_SCRAP_METAL_RECIPE,
  },

  // Doorways
  {
    id: "arid-wooden-doorway",
    name: "Wooden Doorway",
    hp: 600,
    map: "Arid",
    category: "doorway",
    recipe: ARID_WOODEN_RECIPE,
  },
  {
    id: "arid-scrap-metal-doorway",
    name: "Scrap Metal Doorway",
    hp: 1500,
    map: "Arid",
    category: "doorway",
    recipe: ARID_SCRAP_METAL_RECIPE,
  },

  // Garage Frames
  {
    id: "arid-wooden-garage-frame",
    name: "Wooden Garage Frame",
    hp: 600,
    map: "Arid",
    category: "garage_frame",
    recipe: ARID_WOODEN_RECIPE,
  },
  {
    id: "arid-scrap-metal-garage-frame",
    name: "Scrap Metal Garage Frame",
    hp: 1500,
    map: "Arid",
    category: "garage_frame",
    recipe: ARID_SCRAP_METAL_RECIPE,
  },
];

export const ARID_EXPLOSIVES: Explosive[] = [
  { id: "arid-homemade", name: "Homemade Charge", damage: 400, map: "Arid" },
  {
    id: "arid-breaching",
    name: "Breaching Charge",
    damage: 1500,
    map: "Arid",
  },
  { id: "arid-rpg7", name: "RPG-7 Rocket / PG-7VM", damage: 1200, map: "Arid" },
  { id: "arid-cobalt", name: "Cobalt Charge", damage: 3000, map: "Arid" },
];

// ============================================================================
// EXPORTS
// ============================================================================

export const STRUCTURES_BY_MAP: Record<MapContext, Structure[]> = {
  Vanilla: VANILLA_STRUCTURES,
  Arid: ARID_STRUCTURES,
};

export const EXPLOSIVES_BY_MAP: Record<MapContext, Explosive[]> = {
  Vanilla: VANILLA_EXPLOSIVES,
  Arid: ARID_EXPLOSIVES,
};

export const MAP_OPTIONS: MapContext[] = ["Vanilla", "Arid"];
