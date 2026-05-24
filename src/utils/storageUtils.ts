import type { AttachmentType, BuildItem, ItemType } from "@/types";

const VALID_TYPES: ItemType[] = [
  "floor",
  "wall",
  "doorway",
  "window",
  "triangle_floor",
  "garage_frame",
];
const VALID_ATTACHMENTS: AttachmentType[] = [
  "standard_door",
  "double_door",
  "garage_door",
];
const HEX_RE = /^#[0-9a-fA-F]{6}$/;
const COMMENT_MAX = 500;
const INVALID_FILENAME_RE = /[\\/:*?"<>|]/g;
const DEFAULT_FILENAME = "unturned_base";

function isValidVec3(v: unknown): v is [number, number, number] {
  return (
    Array.isArray(v) &&
    v.length === 3 &&
    v.every((n) => typeof n === "number" && Number.isFinite(n))
  );
}

function isValidColor(v: unknown): boolean {
  return v === undefined || (typeof v === "string" && HEX_RE.test(v));
}

function isValidComment(v: unknown): boolean {
  return v === undefined || (typeof v === "string" && v.length <= COMMENT_MAX);
}

function isValidAttachmentType(v: unknown): boolean {
  if (v === undefined || v === null) return true;
  return (
    typeof v === "string" &&
    VALID_ATTACHMENTS.includes(v as AttachmentType)
  );
}

function isValidAttachmentOpen(v: unknown): boolean {
  return v === undefined || typeof v === "boolean";
}

function isValidBuildItem(raw: unknown): raw is BuildItem {
  if (typeof raw !== "object" || raw === null) return false;
  const item = raw as Record<string, unknown>;
  return (
    typeof item.id === "string" &&
    typeof item.type === "string" &&
    VALID_TYPES.includes(item.type as ItemType) &&
    isValidVec3(item.position) &&
    isValidVec3(item.rotation) &&
    isValidColor(item.color) &&
    isValidComment(item.comment) &&
    isValidAttachmentType(item.attachmentType) &&
    isValidAttachmentOpen(item.isAttachmentOpen)
  );
}

export function exportBaseToFile(
  items: BuildItem[],
  filename?: string
): void {
  const sanitized = (filename ?? DEFAULT_FILENAME)
    .replace(INVALID_FILENAME_RE, "_")
    .trim();
  const safe = sanitized.length > 0 ? sanitized : DEFAULT_FILENAME;

  const json = JSON.stringify(items, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${safe}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

export function importBaseFromFile(
  file: File,
  onLoaded: (items: BuildItem[]) => void
): void {
  const reader = new FileReader();

  reader.onload = (event) => {
    const text = event.target?.result;
    if (typeof text !== "string") {
      console.error("Falha ao ler o arquivo: conteúdo inválido");
      return;
    }

    try {
      const parsed: unknown = JSON.parse(text);
      if (!Array.isArray(parsed)) {
        console.error("Arquivo inválido: esperado um array de itens");
        return;
      }
      if (!parsed.every(isValidBuildItem)) {
        console.error("Arquivo inválido: um ou mais itens estão malformados");
        return;
      }
      onLoaded(parsed);
    } catch (err) {
      console.error("Falha ao parsear JSON:", err);
    }
  };

  reader.onerror = () => {
    console.error("Erro ao ler o arquivo");
  };

  reader.readAsText(file);
}
