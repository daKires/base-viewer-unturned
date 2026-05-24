"use client";

import { Html } from "@react-three/drei";
import { WALL_HEIGHT } from "@/constants/dimensions";
import type { ItemType } from "@/types";

const COMMENT_ANCHOR_Y: Record<ItemType, number> = {
  floor: 0.4,
  wall: WALL_HEIGHT + 0.4,
  doorway: WALL_HEIGHT + 0.4,
  window: WALL_HEIGHT + 0.4,
  triangle_floor: 0.4,
  garage_frame: WALL_HEIGHT + 0.4,
};

interface CommentLabelProps {
  type: ItemType;
  text: string;
}

export default function CommentLabel({ type, text }: CommentLabelProps) {
  return (
    <Html
      position={[0, COMMENT_ANCHOR_Y[type], 0]}
      center
      zIndexRange={[40, 0]}
      style={{ pointerEvents: "none", userSelect: "none" }}
    >
      <div className="whitespace-nowrap rounded bg-zinc-900/85 px-2 py-0.5 text-[11px] font-medium text-white shadow-md ring-1 ring-zinc-700 backdrop-blur">
        {text}
      </div>
    </Html>
  );
}
