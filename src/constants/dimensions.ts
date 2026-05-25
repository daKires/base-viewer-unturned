import type { ItemType, Vec3 } from "@/types";

export const GRID_SIZE = 4;
export const WALL_HEIGHT = 4;
export const WALL_THICKNESS = 0.1;

export const FLOOR_SIZE: Vec3 = [GRID_SIZE, 0.1, GRID_SIZE];
export const WALL_SIZE: Vec3 = [GRID_SIZE, WALL_HEIGHT, WALL_THICKNESS];

export const DOORWAY_JAMB_SIZE: Vec3 = [1, WALL_HEIGHT, WALL_THICKNESS];
export const DOORWAY_LINTEL_SIZE: Vec3 = [2, 1, WALL_THICKNESS];

export const WINDOW_VERTICAL_SIZE: Vec3 = [0.5, WALL_HEIGHT, WALL_THICKNESS];
export const WINDOW_HORIZONTAL_SIZE: Vec3 = [3, 1, WALL_THICKNESS];

export const GARAGE_FRAME_JAMB_WIDTH = 0.3;
export const GARAGE_FRAME_LINTEL_HEIGHT = 0.5;

export const GARAGE_JAMB_SIZE: Vec3 = [
  GARAGE_FRAME_JAMB_WIDTH,
  WALL_HEIGHT,
  WALL_THICKNESS,
];
export const GARAGE_LINTEL_SIZE: Vec3 = [
  GRID_SIZE,
  GARAGE_FRAME_LINTEL_HEIGHT,
  WALL_THICKNESS,
];

export const GARAGE_OPENING_WIDTH = GRID_SIZE - 2 * GARAGE_FRAME_JAMB_WIDTH;
export const GARAGE_OPENING_HEIGHT = WALL_HEIGHT - GARAGE_FRAME_LINTEL_HEIGHT;

export const DOORWAY_OPENING_WIDTH = 2;
export const DOORWAY_OPENING_HEIGHT = 3;

export const DOOR_THICKNESS = 0.05;

export const TRIANGLE_SIDE = GRID_SIZE;
export const TRIANGLE_RADIUS = TRIANGLE_SIDE / Math.sqrt(3);
export const TRIANGLE_APOTHEM = TRIANGLE_SIDE / (2 * Math.sqrt(3));
export const TRIANGLE_THICKNESS = 0.1;

export const EDGE_SNAP_RADIUS = 1.5;

export interface GeometryPart {
  size: Vec3;
  position: Vec3;
}

export const ITEM_PARTS: Record<ItemType, ReadonlyArray<GeometryPart>> = {
  floor: [{ size: FLOOR_SIZE, position: [0, 0, 0] }],
  wall: [{ size: WALL_SIZE, position: [0, WALL_HEIGHT / 2, 0] }],
  doorway: [
    { size: DOORWAY_JAMB_SIZE, position: [-1.5, WALL_HEIGHT / 2, 0] },
    { size: DOORWAY_JAMB_SIZE, position: [1.5, WALL_HEIGHT / 2, 0] },
    { size: DOORWAY_LINTEL_SIZE, position: [0, 3.5, 0] },
  ],
  window: [
    { size: WINDOW_VERTICAL_SIZE, position: [-1.75, WALL_HEIGHT / 2, 0] },
    { size: WINDOW_VERTICAL_SIZE, position: [1.75, WALL_HEIGHT / 2, 0] },
    { size: WINDOW_HORIZONTAL_SIZE, position: [0, 3.5, 0] },
    { size: WINDOW_HORIZONTAL_SIZE, position: [0, 0.5, 0] },
  ],
  garage_frame: [
    {
      size: GARAGE_JAMB_SIZE,
      position: [
        -(GRID_SIZE / 2 - GARAGE_FRAME_JAMB_WIDTH / 2),
        WALL_HEIGHT / 2,
        0,
      ],
    },
    {
      size: GARAGE_JAMB_SIZE,
      position: [
        GRID_SIZE / 2 - GARAGE_FRAME_JAMB_WIDTH / 2,
        WALL_HEIGHT / 2,
        0,
      ],
    },
    {
      size: GARAGE_LINTEL_SIZE,
      position: [0, WALL_HEIGHT - GARAGE_FRAME_LINTEL_HEIGHT / 2, 0],
    },
  ],
  triangle_floor: [],
};

export const DEFAULT_COLOR_BY_TYPE: Record<ItemType, string> = {
  floor: "#8a8a8a",
  wall: "#5a5a5a",
  doorway: "#6a6a6a",
  window: "#6a6a6a",
  triangle_floor: "#8a8a8a",
  garage_frame: "#6a6a6a",
};

export const DEFAULT_DOOR_COLOR = "#7c4a1f";
