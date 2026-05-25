"use client";

import { useState } from "react";
import type { ThreeEvent } from "@react-three/fiber";
import { DEFAULT_COLOR_BY_TYPE, WALL_HEIGHT } from "@/constants/dimensions";
import { useBaseStore } from "@/store/useBaseStore";
import type { AttachmentType, BuildItem, DoorTool, ItemType, Tool } from "@/types";
import CommentLabel from "./CommentLabel";
import { DoorAttachment, ItemGeometry, ItemOutline } from "./itemGeometries";

interface BuildItemMeshProps {
  item: BuildItem;
}

const PREVIEW_COLOR = "#eab308";
const HOVER_HIGHLIGHT_COLOR = "#fbbf24";
const DRAG_THRESHOLD_PX = 5;

const DOOR_TOOLS: ReadonlyArray<DoorTool> = [
  "standard_door",
  "double_door",
  "garage_door",
];

function isDoorTool(tool: Tool | null): tool is DoorTool {
  return tool !== null && (DOOR_TOOLS as ReadonlyArray<string>).includes(tool);
}

function attachmentTargetType(tool: DoorTool): ItemType {
  if (tool === "standard_door") return "doorway";
  return "garage_frame";
}

function isAttachmentParent(
  type: ItemType
): type is "doorway" | "garage_frame" {
  return type === "doorway" || type === "garage_frame";
}

function isCompatibleAttachment(
  parentType: ItemType,
  attachmentType: AttachmentType
): boolean {
  if (attachmentType === "standard_door") return parentType === "doorway";
  return parentType === "garage_frame";
}

export default function BuildItemMesh({ item }: BuildItemMeshProps) {
  const selectedTool = useBaseStore((state) => state.selectedTool);
  const isSelectMode = useBaseStore((state) => state.isSelectMode);
  const isSelected = useBaseStore((state) =>
    state.selectedIds.includes(item.id)
  );
  const willBeSelected = useBaseStore((state) => {
    if (!state.isSelectMode) return false;
    if (!state.dragStartPoint || !state.dragCurrentPoint) return false;
    const targetY = state.currentFloor * WALL_HEIGHT;
    if (item.position[1] !== targetY) return false;
    const [sx, , sz] = state.dragStartPoint;
    const [cx, , cz] = state.dragCurrentPoint;
    const minX = Math.min(sx, cx);
    const maxX = Math.max(sx, cx);
    const minZ = Math.min(sz, cz);
    const maxZ = Math.max(sz, cz);
    return (
      item.position[0] >= minX &&
      item.position[0] <= maxX &&
      item.position[2] >= minZ &&
      item.position[2] <= maxZ
    );
  });
  const toggleSelectItem = useBaseStore((state) => state.toggleSelectItem);
  const setAttachment = useBaseStore((state) => state.setAttachment);
  const toggleAttachmentOpen = useBaseStore(
    (state) => state.toggleAttachmentOpen
  );

  const [isHovered, setIsHovered] = useState(false);

  const doorToolActive = isDoorTool(selectedTool);
  const isAttachmentTarget =
    doorToolActive && item.type === attachmentTargetType(selectedTool);

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    if (event.delta > DRAG_THRESHOLD_PX) return;

    if (doorToolActive) {
      if (!isAttachmentTarget) return;
      event.stopPropagation();
      setAttachment(item.id, selectedTool);
      return;
    }

    if (selectedTool) return;
    event.stopPropagation();
    toggleSelectItem(item.id, event.shiftKey);
  };

  const handlePointerOver = (event: ThreeEvent<PointerEvent>) => {
    if (!isAttachmentTarget) return;
    event.stopPropagation();
    setIsHovered(true);
  };

  const handlePointerOut = (event: ThreeEvent<PointerEvent>) => {
    if (!isHovered) return;
    event.stopPropagation();
    setIsHovered(false);
  };

  const handleAttachmentToggle = (event: ThreeEvent<MouseEvent>) => {
    if (event.delta > DRAG_THRESHOLD_PX) return;
    if (doorToolActive) return;
    if (selectedTool) return;
    if (isSelectMode) return;
    event.stopPropagation();
    toggleAttachmentOpen(item.id);
  };

  const baseColor = item.color ?? DEFAULT_COLOR_BY_TYPE[item.type];
  const color = willBeSelected
    ? PREVIEW_COLOR
    : isAttachmentTarget && isHovered
      ? HOVER_HIGHLIGHT_COLOR
      : baseColor;

  const showAttachment =
    isAttachmentParent(item.type) &&
    item.attachmentType &&
    isCompatibleAttachment(item.type, item.attachmentType);

  return (
    <group
      position={item.position}
      rotation={item.rotation}
      onClick={handleClick}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
    >
      <ItemGeometry type={item.type} color={color} />
      {showAttachment && item.attachmentType && (
        <DoorAttachment
          parentType={item.type as "doorway" | "garage_frame"}
          attachmentType={item.attachmentType}
          isOpen={item.isAttachmentOpen ?? false}
          onToggle={handleAttachmentToggle}
        />
      )}
      {isSelected && <ItemOutline type={item.type} />}
      {item.comment && <CommentLabel type={item.type} text={item.comment} />}
    </group>
  );
}
