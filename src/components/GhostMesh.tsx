"use client";

import { forwardRef } from "react";
import type { Group } from "three";
import type { ItemType } from "@/types";
import { GhostGeometry } from "./itemGeometries";

interface GhostMeshProps {
  type: ItemType;
}

const GhostMesh = forwardRef<Group, GhostMeshProps>(function GhostMesh(
  { type },
  ref
) {
  return <GhostGeometry ref={ref} type={type} />;
});

export default GhostMesh;
