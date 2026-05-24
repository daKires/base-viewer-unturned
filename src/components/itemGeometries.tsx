"use client";

import { forwardRef, useEffect, useMemo } from "react";
import { Edges } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import { BoxGeometry, CylinderGeometry, type Group } from "three";
import {
  DEFAULT_DOOR_COLOR,
  DOORWAY_OPENING_HEIGHT,
  DOORWAY_OPENING_WIDTH,
  DOOR_THICKNESS,
  GARAGE_OPENING_HEIGHT,
  GARAGE_OPENING_WIDTH,
  ITEM_PARTS,
  TRIANGLE_RADIUS,
  TRIANGLE_THICKNESS,
} from "@/constants/dimensions";
import type { AttachmentType, ItemType } from "@/types";

const GHOST_COLOR = "#10b981";
const GHOST_OPACITY = 0.5;
const OUTLINE_COLOR = "#22d3ee";
const FLOOR_EDGE_COLOR = "#2a2a2a";
const FLOOR_EDGE_WIDTH = 2;

const FLOOR_TYPES: ReadonlyArray<ItemType> = ["floor", "triangle_floor"];

interface ItemGeometryProps {
  type: ItemType;
  color: string;
}

export function ItemGeometry({ type, color }: ItemGeometryProps) {
  if (type === "triangle_floor") {
    return (
      <mesh castShadow receiveShadow>
        <cylinderGeometry
          args={[TRIANGLE_RADIUS, TRIANGLE_RADIUS, TRIANGLE_THICKNESS, 3]}
        />
        <meshStandardMaterial color={color} />
        <Edges color={FLOOR_EDGE_COLOR} lineWidth={FLOOR_EDGE_WIDTH} />
      </mesh>
    );
  }

  const showFloorEdges = FLOOR_TYPES.includes(type);

  return (
    <>
      {ITEM_PARTS[type].map((part, i) => (
        <mesh key={i} position={part.position} castShadow receiveShadow>
          <boxGeometry args={part.size} />
          <meshStandardMaterial color={color} />
          {showFloorEdges && (
            <Edges color={FLOOR_EDGE_COLOR} lineWidth={FLOOR_EDGE_WIDTH} />
          )}
        </mesh>
      ))}
    </>
  );
}

interface GhostGeometryProps {
  type: ItemType;
}

export const GhostGeometry = forwardRef<Group, GhostGeometryProps>(
  function GhostGeometry({ type }, ref) {
    if (type === "triangle_floor") {
      return (
        <group ref={ref}>
          <mesh>
            <cylinderGeometry
              args={[TRIANGLE_RADIUS, TRIANGLE_RADIUS, TRIANGLE_THICKNESS, 3]}
            />
            <meshStandardMaterial
              color={GHOST_COLOR}
              transparent
              opacity={GHOST_OPACITY}
              depthWrite={false}
            />
          </mesh>
        </group>
      );
    }

    return (
      <group ref={ref}>
        {ITEM_PARTS[type].map((part, i) => (
          <mesh key={i} position={part.position}>
            <boxGeometry args={part.size} />
            <meshStandardMaterial
              color={GHOST_COLOR}
              transparent
              opacity={GHOST_OPACITY}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>
    );
  }
);

interface ItemOutlineProps {
  type: ItemType;
}

export function ItemOutline({ type }: ItemOutlineProps) {
  const triangleGeometry = useMemo(() => {
    if (type !== "triangle_floor") return null;
    return new CylinderGeometry(
      TRIANGLE_RADIUS,
      TRIANGLE_RADIUS,
      TRIANGLE_THICKNESS,
      3
    );
  }, [type]);

  const boxEdges = useMemo(() => {
    if (type === "triangle_floor") return [];
    return ITEM_PARTS[type].map((part) => ({
      geometry: new BoxGeometry(...part.size),
      position: part.position,
    }));
  }, [type]);

  useEffect(() => {
    return () => {
      triangleGeometry?.dispose();
      boxEdges.forEach((e) => e.geometry.dispose());
    };
  }, [triangleGeometry, boxEdges]);

  if (type === "triangle_floor" && triangleGeometry) {
    return (
      <lineSegments renderOrder={1}>
        <edgesGeometry args={[triangleGeometry]} />
        <lineBasicMaterial color={OUTLINE_COLOR} depthTest={false} />
      </lineSegments>
    );
  }

  return (
    <>
      {boxEdges.map((e, i) => (
        <lineSegments key={i} position={e.position} renderOrder={1}>
          <edgesGeometry args={[e.geometry]} />
          <lineBasicMaterial color={OUTLINE_COLOR} depthTest={false} />
        </lineSegments>
      ))}
    </>
  );
}

interface DoorAttachmentProps {
  parentType: "doorway" | "garage_frame";
  attachmentType: AttachmentType;
  isOpen: boolean;
  color?: string;
  onToggle?: (event: ThreeEvent<MouseEvent>) => void;
}

export function DoorAttachment({
  parentType,
  attachmentType,
  isOpen,
  color,
  onToggle,
}: DoorAttachmentProps) {
  const doorColor = color ?? DEFAULT_DOOR_COLOR;

  if (attachmentType === "standard_door" && parentType === "doorway") {
    const w = DOORWAY_OPENING_WIDTH;
    const h = DOORWAY_OPENING_HEIGHT;
    const yaw = isOpen ? Math.PI / 2 : 0;
    return (
      <group position={[-w / 2, h / 2, 0]} rotation={[0, yaw, 0]}>
        <mesh
          position={[w / 2, 0, 0]}
          castShadow
          receiveShadow
          onClick={onToggle}
        >
          <boxGeometry args={[w, h, DOOR_THICKNESS]} />
          <meshStandardMaterial color={doorColor} />
        </mesh>
      </group>
    );
  }

  if (attachmentType === "double_door" && parentType === "garage_frame") {
    const w = GARAGE_OPENING_WIDTH;
    const h = GARAGE_OPENING_HEIGHT;
    const leafWidth = w / 2;
    const leftYaw = isOpen ? Math.PI / 2 : 0;
    const rightYaw = isOpen ? -Math.PI / 2 : 0;
    return (
      <>
        <group position={[-w / 2, h / 2, 0]} rotation={[0, leftYaw, 0]}>
          <mesh
            position={[leafWidth / 2, 0, 0]}
            castShadow
            receiveShadow
            onClick={onToggle}
          >
            <boxGeometry args={[leafWidth, h, DOOR_THICKNESS]} />
            <meshStandardMaterial color={doorColor} />
          </mesh>
        </group>
        <group position={[w / 2, h / 2, 0]} rotation={[0, rightYaw, 0]}>
          <mesh
            position={[-leafWidth / 2, 0, 0]}
            castShadow
            receiveShadow
            onClick={onToggle}
          >
            <boxGeometry args={[leafWidth, h, DOOR_THICKNESS]} />
            <meshStandardMaterial color={doorColor} />
          </mesh>
        </group>
      </>
    );
  }

  if (attachmentType === "garage_door" && parentType === "garage_frame") {
    const w = GARAGE_OPENING_WIDTH;
    const h = GARAGE_OPENING_HEIGHT;
    const baseY = h / 2;
    const openY = baseY + h;
    return (
      <group position={[0, isOpen ? openY : baseY, 0]}>
        <mesh
          position={[0, 0, 0]}
          castShadow
          receiveShadow
          onClick={onToggle}
        >
          <boxGeometry args={[w, h, DOOR_THICKNESS]} />
          <meshStandardMaterial color={doorColor} />
        </mesh>
      </group>
    );
  }

  return null;
}
