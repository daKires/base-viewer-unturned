import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type {
  AttachmentSnapshot,
  AttachmentType,
  BuildItem,
  HistoryAction,
  MapContext,
  Tool,
  Vec3,
} from "@/types";

const HISTORY_MAX = 50;
const STORAGE_KEY = "base-viewer-store";

function pushHistory(prev: HistoryAction[], action: HistoryAction): HistoryAction[] {
  const next = [...prev, action];
  return next.length > HISTORY_MAX ? next.slice(-HISTORY_MAX) : next;
}

function snapshotAttachment(item: BuildItem): AttachmentSnapshot {
  return {
    attachmentType: item.attachmentType ?? null,
    isAttachmentOpen: item.isAttachmentOpen ?? false,
  };
}

function applyAttachment(item: BuildItem, snap: AttachmentSnapshot): BuildItem {
  const next: BuildItem = { ...item };
  if (snap.attachmentType === null || snap.attachmentType === undefined) {
    delete next.attachmentType;
    delete next.isAttachmentOpen;
  } else {
    next.attachmentType = snap.attachmentType;
    next.isAttachmentOpen = snap.isAttachmentOpen ?? false;
  }
  return next;
}

interface MetadataPatch {
  color?: string;
  comment?: string;
}

interface BaseState {
  buildItems: BuildItem[];
  selectedTool: Tool | null;
  currentFloor: number;
  isSelectMode: boolean;
  history: HistoryAction[];
  selectedIds: string[];
  clipboard: BuildItem[];
  dragStartPoint: Vec3 | null;
  dragCurrentPoint: Vec3 | null;
  currentMap: MapContext;
  selectedVariantId: string | null;

  addItem: (item: Omit<BuildItem, "id">) => void;
  removeItem: (id: string) => void;
  removeMany: (ids: string[]) => void;
  setBase: (items: BuildItem[]) => void;
  clearBase: () => void;
  setSelectedTool: (tool: Tool | null) => void;
  toggleSelectMode: () => void;
  nextFloor: () => void;
  prevFloor: () => void;
  undo: () => void;
  toggleSelectItem: (id: string, isMulti: boolean) => void;
  setSelection: (ids: string[]) => void;
  clearSelection: () => void;
  updateMetadataForSelected: (patch: MetadataPatch) => void;
  deleteSelected: () => void;
  copySelected: () => void;
  pasteClipboard: (offsetX: number, offsetZ: number) => void;
  moveSelected: (dx: number, dz: number) => void;
  setDragStart: (point: Vec3 | null) => void;
  setDragCurrent: (point: Vec3 | null) => void;
  clearDrag: () => void;
  setAttachment: (id: string, attachmentType: AttachmentType) => void;
  toggleAttachmentOpen: (id: string) => void;
  setCurrentMap: (map: MapContext) => void;
  setSelectedVariantId: (id: string | null) => void;
}

export const useBaseStore = create<BaseState>()(
  persist(
    (set) => ({
      buildItems: [],
      selectedTool: null,
      currentFloor: 0,
      isSelectMode: false,
      history: [],
      selectedIds: [],
      clipboard: [],
      dragStartPoint: null,
      dragCurrentPoint: null,
      currentMap: "Vanilla",
      selectedVariantId: null,

      addItem: (item) =>
        set((state) => {
          const created: BuildItem = { ...item, id: crypto.randomUUID() };
          return {
            buildItems: [...state.buildItems, created],
            history: pushHistory(state.history, { type: "add", item: created }),
          };
        }),

      removeItem: (id) =>
        set((state) => {
          const target = state.buildItems.find((item) => item.id === id);
          if (!target) return state;
          return {
            buildItems: state.buildItems.filter((item) => item.id !== id),
            history: pushHistory(state.history, { type: "remove", item: target }),
            selectedIds: state.selectedIds.filter((sid) => sid !== id),
          };
        }),

      removeMany: (ids) =>
        set((state) => {
          if (ids.length === 0) return state;
          const idSet = new Set(ids);
          const removed = state.buildItems.filter((item) => idSet.has(item.id));
          if (removed.length === 0) return state;
          return {
            buildItems: state.buildItems.filter((item) => !idSet.has(item.id)),
            history: pushHistory(state.history, {
              type: "removeMany",
              items: removed,
            }),
            selectedIds: state.selectedIds.filter((sid) => !idSet.has(sid)),
          };
        }),

      setBase: (items) =>
        set({ buildItems: items, history: [], selectedIds: [] }),

      clearBase: () =>
        set({ buildItems: [], history: [], selectedIds: [] }),

      setSelectedTool: (tool) =>
        set((state) => ({
          selectedTool: tool,
          isSelectMode: tool !== null ? false : state.isSelectMode,
          selectedIds: tool !== null ? [] : state.selectedIds,
          selectedVariantId: null,
        })),

      toggleSelectMode: () =>
        set((state) => {
          const next = !state.isSelectMode;
          return {
            isSelectMode: next,
            selectedTool: next ? null : state.selectedTool,
            dragStartPoint: null,
            dragCurrentPoint: null,
            selectedVariantId: next ? null : state.selectedVariantId,
          };
        }),

      nextFloor: () =>
        set((state) => ({
          currentFloor: state.currentFloor + 1,
          selectedIds: [],
        })),

      prevFloor: () =>
        set((state) => ({
          currentFloor: state.currentFloor - 1,
          selectedIds: [],
        })),

      undo: () =>
        set((state) => {
          if (state.history.length === 0) return state;
          const last = state.history[state.history.length - 1];
          const history = state.history.slice(0, -1);

          if (last.type === "add") {
            return {
              buildItems: state.buildItems.filter((item) => item.id !== last.item.id),
              history,
              selectedIds: state.selectedIds.filter((sid) => sid !== last.item.id),
            };
          }

          if (last.type === "removeMany") {
            return {
              buildItems: [...state.buildItems, ...last.items],
              history,
            };
          }

          if (last.type === "addMany") {
            const idSet = new Set(last.items.map((it) => it.id));
            return {
              buildItems: state.buildItems.filter((it) => !idSet.has(it.id)),
              history,
              selectedIds: state.selectedIds.filter((sid) => !idSet.has(sid)),
            };
          }

          if (last.type === "move") {
            const idSet = new Set(last.ids);
            return {
              buildItems: state.buildItems.map((it) =>
                idSet.has(it.id)
                  ? {
                      ...it,
                      position: [
                        it.position[0] - last.dx,
                        it.position[1],
                        it.position[2] - last.dz,
                      ],
                    }
                  : it
              ),
              history,
            };
          }

          if (last.type === "setAttachment") {
            return {
              buildItems: state.buildItems.map((it) =>
                it.id === last.id ? applyAttachment(it, last.prev) : it
              ),
              history,
            };
          }

          return {
            buildItems: [...state.buildItems, last.item],
            history,
          };
        }),

      toggleSelectItem: (id, isMulti) =>
        set((state) => {
          if (!isMulti) {
            return { selectedIds: [id] };
          }
          return state.selectedIds.includes(id)
            ? { selectedIds: state.selectedIds.filter((sid) => sid !== id) }
            : { selectedIds: [...state.selectedIds, id] };
        }),

      setSelection: (ids) => set({ selectedIds: ids }),

      clearSelection: () => set({ selectedIds: [] }),

      updateMetadataForSelected: (patch) =>
        set((state) => {
          if (state.selectedIds.length === 0) return state;
          const selected = new Set(state.selectedIds);
          return {
            buildItems: state.buildItems.map((item) => {
              if (!selected.has(item.id)) return item;
              const next: BuildItem = { ...item };
              if (patch.color === undefined && "color" in patch) {
                delete next.color;
              } else if (patch.color !== undefined) {
                next.color = patch.color;
              }
              if (patch.comment === undefined && "comment" in patch) {
                delete next.comment;
              } else if (patch.comment !== undefined) {
                next.comment = patch.comment;
              }
              return next;
            }),
          };
        }),

      deleteSelected: () =>
        set((state) => {
          if (state.selectedIds.length === 0) return state;
          const idSet = new Set(state.selectedIds);
          const removed = state.buildItems.filter((it) => idSet.has(it.id));
          if (removed.length === 0) return state;
          return {
            buildItems: state.buildItems.filter((it) => !idSet.has(it.id)),
            history: pushHistory(state.history, {
              type: "removeMany",
              items: removed,
            }),
            selectedIds: [],
          };
        }),

      copySelected: () =>
        set((state) => {
          if (state.selectedIds.length === 0) return state;
          const idSet = new Set(state.selectedIds);
          const cloned = state.buildItems
            .filter((it) => idSet.has(it.id))
            .map((it) => ({ ...it }));
          return { clipboard: cloned };
        }),

      pasteClipboard: (offsetX, offsetZ) =>
        set((state) => {
          if (state.clipboard.length === 0) return state;
          const pasted: BuildItem[] = state.clipboard.map((it) => ({
            ...it,
            id: crypto.randomUUID(),
            position: [
              it.position[0] + offsetX,
              it.position[1],
              it.position[2] + offsetZ,
            ],
          }));
          return {
            buildItems: [...state.buildItems, ...pasted],
            history: pushHistory(state.history, {
              type: "addMany",
              items: pasted,
            }),
            selectedIds: pasted.map((it) => it.id),
          };
        }),

      moveSelected: (dx, dz) =>
        set((state) => {
          if (state.selectedIds.length === 0) return state;
          if (dx === 0 && dz === 0) return state;
          const idSet = new Set(state.selectedIds);
          return {
            buildItems: state.buildItems.map((it) =>
              idSet.has(it.id)
                ? {
                    ...it,
                    position: [
                      it.position[0] + dx,
                      it.position[1],
                      it.position[2] + dz,
                    ],
                  }
                : it
            ),
            history: pushHistory(state.history, {
              type: "move",
              ids: [...state.selectedIds],
              dx,
              dz,
            }),
          };
        }),

      setDragStart: (point) => set({ dragStartPoint: point }),
      setDragCurrent: (point) => set({ dragCurrentPoint: point }),
      clearDrag: () => set({ dragStartPoint: null, dragCurrentPoint: null }),

      setAttachment: (id, attachmentType) =>
        set((state) => {
          const target = state.buildItems.find((it) => it.id === id);
          if (!target) return state;
          const prev = snapshotAttachment(target);
          const next: AttachmentSnapshot = {
            attachmentType,
            isAttachmentOpen: false,
          };
          if (
            prev.attachmentType === next.attachmentType &&
            prev.isAttachmentOpen === next.isAttachmentOpen
          ) {
            return state;
          }
          return {
            buildItems: state.buildItems.map((it) =>
              it.id === id ? applyAttachment(it, next) : it
            ),
            history: pushHistory(state.history, {
              type: "setAttachment",
              id,
              prev,
              next,
            }),
          };
        }),

      toggleAttachmentOpen: (id) =>
        set((state) => {
          const target = state.buildItems.find((it) => it.id === id);
          if (!target) return state;
          if (!target.attachmentType) return state;
          const prev = snapshotAttachment(target);
          const next: AttachmentSnapshot = {
            attachmentType: prev.attachmentType,
            isAttachmentOpen: !prev.isAttachmentOpen,
          };
          return {
            buildItems: state.buildItems.map((it) =>
              it.id === id ? applyAttachment(it, next) : it
            ),
            history: pushHistory(state.history, {
              type: "setAttachment",
              id,
              prev,
              next,
            }),
          };
        }),

      setCurrentMap: (map) =>
        set({ currentMap: map, selectedVariantId: null }),

      setSelectedVariantId: (id) => set({ selectedVariantId: id }),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        buildItems: state.buildItems,
        currentMap: state.currentMap,
        selectedVariantId: state.selectedVariantId,
      }),
    }
  )
);
