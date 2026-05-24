export type ItemType =
  | "floor"
  | "wall"
  | "doorway"
  | "window"
  | "triangle_floor"
  | "garage_frame";

export type AttachmentType = "standard_door" | "double_door" | "garage_door";

export type DoorTool = AttachmentType;

export type Tool = ItemType | DoorTool;

export type Vec3 = [number, number, number];

export interface BuildItem {
  id: string;
  type: ItemType;
  position: Vec3;
  rotation: Vec3;
  color?: string;
  comment?: string;
  attachmentType?: AttachmentType | null;
  isAttachmentOpen?: boolean;
}

export interface AttachmentSnapshot {
  attachmentType?: AttachmentType | null;
  isAttachmentOpen?: boolean;
}

export type HistoryAction =
  | { type: "add"; item: BuildItem }
  | { type: "remove"; item: BuildItem }
  | { type: "removeMany"; items: BuildItem[] }
  | { type: "addMany"; items: BuildItem[] }
  | { type: "move"; ids: string[]; dx: number; dz: number }
  | {
      type: "setAttachment";
      id: string;
      prev: AttachmentSnapshot;
      next: AttachmentSnapshot;
    };
