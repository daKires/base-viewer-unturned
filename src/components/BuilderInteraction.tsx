"use client";

import { useEffect, useRef } from "react";
import type { ThreeEvent } from "@react-three/fiber";
import type { Group, Vector3 } from "three";
import {
  EDGE_SNAP_RADIUS,
  GRID_SIZE,
  TRIANGLE_APOTHEM,
  WALL_HEIGHT,
} from "@/constants/dimensions";
import { useBaseStore } from "@/store/useBaseStore";
import type { BuildItem, DoorTool, ItemType, Tool, Vec3 } from "@/types";
import GhostMesh from "./GhostMesh";

interface SnapTransform {
  position: Vec3;
  rotation: Vec3;
}

interface EdgeAnchor {
  midX: number;
  midZ: number;
  outX: number;
  outZ: number;
}

const SQRT3_2 = Math.sqrt(3) / 2;
const GRID_HALF = GRID_SIZE / 2;

const FLOOR_LOCAL_NORMALS: ReadonlyArray<readonly [number, number]> = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

const TRIANGLE_LOCAL_NORMALS: ReadonlyArray<readonly [number, number]> = [
  [0, -1],
  [SQRT3_2, 0.5],
  [-SQRT3_2, 0.5],
];

const DOOR_TOOLS: ReadonlyArray<DoorTool> = [
  "standard_door",
  "double_door",
  "garage_door",
];

function isDoorTool(tool: Tool | null): tool is DoorTool {
  return tool !== null && (DOOR_TOOLS as ReadonlyArray<string>).includes(tool);
}

function getEdgesOfItem(item: BuildItem): EdgeAnchor[] {
  const isFloor = item.type === "floor";
  const isTriangle = item.type === "triangle_floor";
  if (!isFloor && !isTriangle) return [];

  const normals = isFloor ? FLOOR_LOCAL_NORMALS : TRIANGLE_LOCAL_NORMALS;
  const distance = isFloor ? GRID_SIZE / 2 : TRIANGLE_APOTHEM;
  const yaw = item.rotation[1];
  const c = Math.cos(yaw);
  const s = Math.sin(yaw);

  return normals.map(([lx, lz]) => {
    const wx = lx * c + lz * s;
    const wz = -lx * s + lz * c;
    return {
      midX: item.position[0] + wx * distance,
      midZ: item.position[2] + wz * distance,
      outX: wx,
      outZ: wz,
    };
  });
}

function findEdgeSnap(
  point: Vector3,
  items: BuildItem[],
  floorY: number
): EdgeAnchor | null {
  let best: EdgeAnchor | null = null;
  let bestDist = EDGE_SNAP_RADIUS;
  for (const item of items) {
    if (item.position[1] !== floorY) continue;
    if (item.type !== "floor" && item.type !== "triangle_floor") continue;
    for (const edge of getEdgesOfItem(item)) {
      const dx = point.x - edge.midX;
      const dz = point.z - edge.midZ;
      const d = Math.hypot(dx, dz);
      if (d < bestDist) {
        bestDist = d;
        best = edge;
      }
    }
  }
  return best;
}

function snapToEdge(
  newType: ItemType,
  edge: EdgeAnchor,
  y: number
): SnapTransform {
  const yaw = Math.atan2(edge.outX, edge.outZ);
  let offset: number;
  switch (newType) {
    case "floor":
      offset = GRID_SIZE / 2;
      break;
    case "triangle_floor":
      offset = TRIANGLE_APOTHEM;
      break;
    case "wall":
    case "doorway":
    case "window":
    case "garage_frame":
      offset = 0;
      break;
  }
  return {
    position: [
      edge.midX + edge.outX * offset,
      y,
      edge.midZ + edge.outZ * offset,
    ],
    rotation: [0, yaw, 0],
  };
}

function snapFloor(point: Vector3, y: number): SnapTransform {
  const x = Math.round(point.x / GRID_SIZE) * GRID_SIZE;
  const z = Math.round(point.z / GRID_SIZE) * GRID_SIZE;
  return { position: [x, y, z], rotation: [0, 0, 0] };
}

function snapWall(point: Vector3, y: number): SnapTransform {
  const cx = Math.round(point.x / GRID_SIZE) * GRID_SIZE;
  const cz = Math.round(point.z / GRID_SIZE) * GRID_SIZE;
  const dx = point.x - cx;
  const dz = point.z - cz;
  const half = GRID_SIZE / 2;

  if (Math.abs(dx) > Math.abs(dz)) {
    const x = cx + (dx > 0 ? half : -half);
    return { position: [x, y, cz], rotation: [0, Math.PI / 2, 0] };
  }

  const z = cz + (dz > 0 ? half : -half);
  return { position: [cx, y, z], rotation: [0, 0, 0] };
}

function computeTransform(
  type: ItemType,
  point: Vector3,
  floorY: number,
  items: BuildItem[]
): SnapTransform {
  const edge = findEdgeSnap(point, items, floorY);
  if (edge) return snapToEdge(type, edge, floorY);

  switch (type) {
    case "floor":
    case "triangle_floor":
      return snapFloor(point, floorY);
    case "wall":
    case "doorway":
    case "window":
    case "garage_frame":
      return snapWall(point, floorY);
  }
}

function snapToCorner(v: number): number {
  return Math.round((v - GRID_HALF) / GRID_SIZE) * GRID_SIZE + GRID_HALF;
}

const DRAG_THRESHOLD_PX = 5;
const DRAG_AREA_MIN = 0.1;

interface SelectAreaIndicatorProps {
  start: Vec3;
  current: Vec3;
  y: number;
}

function SelectAreaIndicator({ start, current, y }: SelectAreaIndicatorProps) {
  const minX = Math.min(start[0], current[0]);
  const maxX = Math.max(start[0], current[0]);
  const minZ = Math.min(start[2], current[2]);
  const maxZ = Math.max(start[2], current[2]);
  const width = Math.max(maxX - minX, 0.001);
  const depth = Math.max(maxZ - minZ, 0.001);
  const cx = (minX + maxX) / 2;
  const cz = (minZ + maxZ) / 2;
  return (
    <mesh position={[cx, y + 0.05, cz]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[width, depth]} />
      <meshBasicMaterial
        color="#22d3ee"
        transparent
        opacity={0.25}
        depthWrite={false}
      />
    </mesh>
  );
}

export default function BuilderInteraction() {
  const selectedTool = useBaseStore((state) => state.selectedTool);
  const isSelectMode = useBaseStore((state) => state.isSelectMode);
  const currentFloor = useBaseStore((state) => state.currentFloor);
  const buildItems = useBaseStore((state) => state.buildItems);
  const addItem = useBaseStore((state) => state.addItem);
  const clearSelection = useBaseStore((state) => state.clearSelection);
  const dragStartPoint = useBaseStore((state) => state.dragStartPoint);
  const dragCurrentPoint = useBaseStore((state) => state.dragCurrentPoint);
  const setDragStart = useBaseStore((state) => state.setDragStart);
  const setDragCurrent = useBaseStore((state) => state.setDragCurrent);
  const clearDrag = useBaseStore((state) => state.clearDrag);
  const setSelection = useBaseStore((state) => state.setSelection);

  const floorY = currentFloor * WALL_HEIGHT;

  const ghostRef = useRef<Group | null>(null);
  const lastTransformRef = useRef<SnapTransform | null>(null);

  const doorToolActive = isDoorTool(selectedTool);
  const placementType: ItemType | null =
    selectedTool && !doorToolActive ? (selectedTool as ItemType) : null;

  useEffect(() => {
    if (ghostRef.current) {
      ghostRef.current.position.y = floorY;
    }
    if (lastTransformRef.current) {
      const [x, , z] = lastTransformRef.current.position;
      lastTransformRef.current = {
        ...lastTransformRef.current,
        position: [x, floorY, z],
      };
    }
  }, [floorY]);

  const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
    if (!isSelectMode) return;
    if (event.button !== 0) return;
    event.stopPropagation();
    const sx = snapToCorner(event.point.x);
    const sz = snapToCorner(event.point.z);
    setDragStart([sx, floorY, sz]);
    setDragCurrent([sx, floorY, sz]);
  };

  const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
    if (isSelectMode) {
      if (!dragStartPoint) return;
      event.stopPropagation();
      const cx = snapToCorner(event.point.x);
      const cz = snapToCorner(event.point.z);
      setDragCurrent([cx, floorY, cz]);
      return;
    }

    if (doorToolActive) {
      lastTransformRef.current = null;
      return;
    }

    if (!placementType || !ghostRef.current) return;
    event.stopPropagation();

    const transform = computeTransform(
      placementType,
      event.point,
      floorY,
      buildItems
    );
    ghostRef.current.position.set(...transform.position);
    ghostRef.current.rotation.set(...transform.rotation);
    lastTransformRef.current = transform;
  };

  const handlePointerOut = () => {
    if (isSelectMode && dragStartPoint) {
      clearDrag();
    }
    lastTransformRef.current = null;
  };

  const handlePointerUp = (event: ThreeEvent<PointerEvent>) => {
    if (!isSelectMode) return;
    if (!dragStartPoint || !dragCurrentPoint) return;
    event.stopPropagation();

    const [sx, , sz] = dragStartPoint;
    const [cx, , cz] = dragCurrentPoint;
    const minX = Math.min(sx, cx);
    const maxX = Math.max(sx, cx);
    const minZ = Math.min(sz, cz);
    const maxZ = Math.max(sz, cz);

    if (maxX - minX < DRAG_AREA_MIN && maxZ - minZ < DRAG_AREA_MIN) {
      clearDrag();
      return;
    }

    const ids: string[] = [];
    for (const item of buildItems) {
      if (item.position[1] !== floorY) continue;
      if (
        item.position[0] >= minX &&
        item.position[0] <= maxX &&
        item.position[2] >= minZ &&
        item.position[2] <= maxZ
      ) {
        ids.push(item.id);
      }
    }
    setSelection(ids);
    clearDrag();
  };

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    if (event.delta > DRAG_THRESHOLD_PX) return;

    if (isSelectMode) return;

    if (doorToolActive) return;

    if (!placementType) {
      if (!event.shiftKey) clearSelection();
      return;
    }

    if (!lastTransformRef.current) return;
    event.stopPropagation();

    addItem({
      type: placementType,
      position: lastTransformRef.current.position,
      rotation: lastTransformRef.current.rotation,
    });
  };

  const showGhost = placementType !== null && !isSelectMode;
  const showSelectArea =
    isSelectMode && dragStartPoint !== null && dragCurrentPoint !== null;

  return (
    <>
      <mesh
        position={[0, floorY, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerOut={handlePointerOut}
        onPointerUp={handlePointerUp}
        onClick={handleClick}
      >
        <planeGeometry args={[1000, 1000]} />
        <meshBasicMaterial visible={false} />
      </mesh>

      {showGhost && placementType && (
        <GhostMesh ref={ghostRef} type={placementType} />
      )}

      {showSelectArea && dragStartPoint && dragCurrentPoint && (
        <SelectAreaIndicator
          start={dragStartPoint}
          current={dragCurrentPoint}
          y={floorY}
        />
      )}
    </>
  );
}
