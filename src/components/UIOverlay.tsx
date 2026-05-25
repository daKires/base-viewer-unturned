"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import {
  AppWindow,
  ChevronDown,
  ChevronUp,
  Columns2,
  Container,
  DoorClosed,
  DoorOpen,
  Download,
  MousePointer2,
  RectangleVertical,
  Square,
  Triangle,
  Undo2,
  Upload,
  Warehouse,
  X,
} from "lucide-react";
import { useBaseStore } from "@/store/useBaseStore";
import { importBaseFromFile } from "@/utils/storageUtils";
import type { Tool } from "@/types";
import ExportModal from "./ExportModal";
import VariantSelector from "./VariantSelector";

const TOOL_LABEL: Record<Tool, string> = {
  floor: "Floor/Roof",
  wall: "Wall",
  doorway: "Doorway",
  window: "Window",
  triangle_floor: "Triangle",
  garage_frame: "Garage Frame",
  standard_door: "Standard Door",
  double_door: "Double Doors",
  garage_door: "Garage Door",
};

const TOOL_ICON: Record<Tool, typeof Square> = {
  floor: Square,
  wall: RectangleVertical,
  doorway: DoorOpen,
  window: AppWindow,
  triangle_floor: Triangle,
  garage_frame: Warehouse,
  standard_door: DoorClosed,
  double_door: Columns2,
  garage_door: Container,
};

const BUILD_TOOLS: Tool[] = [
  "floor",
  "triangle_floor",
  "wall",
  "doorway",
  "window",
  "garage_frame",
];

const DOOR_TOOLS: Tool[] = ["standard_door", "double_door", "garage_door"];

export default function UIOverlay() {
  const buildItems = useBaseStore((state) => state.buildItems);
  const selectedTool = useBaseStore((state) => state.selectedTool);
  const currentFloor = useBaseStore((state) => state.currentFloor);
  const isSelectMode = useBaseStore((state) => state.isSelectMode);
  const canUndo = useBaseStore((state) => state.history.length > 0);
  const selectedCount = useBaseStore((state) => state.selectedIds.length);

  const setBase = useBaseStore((state) => state.setBase);
  const setSelectedTool = useBaseStore((state) => state.setSelectedTool);
  const toggleSelectMode = useBaseStore((state) => state.toggleSelectMode);
  const nextFloor = useBaseStore((state) => state.nextFloor);
  const prevFloor = useBaseStore((state) => state.prevFloor);
  const undo = useBaseStore((state) => state.undo);
  const clearSelection = useBaseStore((state) => state.clearSelection);
  const deleteSelected = useBaseStore((state) => state.deleteSelected);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isExportOpen, setIsExportOpen] = useState(false);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA")
      ) {
        return;
      }

      if (event.key === "Escape") {
        setSelectedTool(null);
        if (isSelectMode) toggleSelectMode();
        clearSelection();
        return;
      }

      if (event.key === "PageUp") {
        event.preventDefault();
        nextFloor();
        return;
      }

      if (event.key === "PageDown") {
        event.preventDefault();
        prevFloor();
        return;
      }

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "z") {
        event.preventDefault();
        undo();
        return;
      }

      if (event.key === "Delete" || event.key === "Backspace") {
        if (selectedCount > 0) {
          event.preventDefault();
          deleteSelected();
        }
        return;
      }

      if (event.key === "s" || event.key === "S") {
        if (event.ctrlKey || event.metaKey || event.altKey) return;
        toggleSelectMode();
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [
    setSelectedTool,
    toggleSelectMode,
    nextFloor,
    prevFloor,
    undo,
    clearSelection,
    deleteSelected,
    isSelectMode,
    selectedCount,
  ]);

  const handleSelectTool = (tool: Tool) => {
    setSelectedTool(selectedTool === tool ? null : tool);
  };

  const handleCancel = () => {
    setSelectedTool(null);
    if (isSelectMode) toggleSelectMode();
  };

  const handleOpenExport = () => {
    setIsExportOpen(true);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      importBaseFromFile(file, setBase);
    }
    event.target.value = "";
  };

  const baseButton =
    "flex items-center gap-2 rounded-md px-4 py-2 text-sm text-white backdrop-blur transition-colors";

  const toolButtonClass = (tool: Tool) =>
    [
      baseButton,
      selectedTool === tool
        ? "bg-emerald-600/90 ring-2 ring-emerald-300 hover:bg-emerald-600"
        : "bg-zinc-900/80 hover:bg-zinc-800",
    ].join(" ");

  const selectButtonClass = [
    baseButton,
    isSelectMode
      ? "bg-cyan-600/90 ring-2 ring-cyan-300 hover:bg-cyan-600"
      : "bg-zinc-900/80 hover:bg-zinc-800",
  ].join(" ");

  const utilityButtonClass = [baseButton, "bg-zinc-900/80 hover:bg-zinc-800"].join(
    " "
  );

  const cancelButtonClass = [baseButton, "bg-zinc-700/80 hover:bg-zinc-700"].join(
    " "
  );

  const undoButtonClass = [
    baseButton,
    "bg-zinc-900/80 hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-zinc-900/80",
  ].join(" ");

  const modeLabel = isSelectMode
    ? "select"
    : selectedTool
      ? TOOL_LABEL[selectedTool]
      : "none";

  const renderToolButton = (tool: Tool) => {
    const Icon = TOOL_ICON[tool];
    return (
      <button
        key={tool}
        type="button"
        onClick={() => handleSelectTool(tool)}
        className={toolButtonClass(tool)}
      >
        <Icon className="h-4 w-4" />
        {TOOL_LABEL[tool]}
      </button>
    );
  };

  return (
    <>
      <div className="absolute left-4 top-4 z-10 flex flex-col gap-2">
        {BUILD_TOOLS.map(renderToolButton)}

        <div className="mt-1 h-px bg-zinc-700/60" />

        {DOOR_TOOLS.map(renderToolButton)}

        <button
          type="button"
          onClick={toggleSelectMode}
          className={selectButtonClass}
        >
          <MousePointer2 className="h-4 w-4" />
          Select Mode (S)
        </button>

        {(selectedTool || isSelectMode) && (
          <button type="button" onClick={handleCancel} className={cancelButtonClass}>
            <X className="h-4 w-4" />
            Cancel (ESC)
          </button>
        )}

        <VariantSelector />

        <div className="mt-2 h-px bg-zinc-700/60" />

        <button type="button" onClick={nextFloor} className={utilityButtonClass}>
          <ChevronUp className="h-4 w-4" />
          Floor Up (PgUp)
        </button>

        <button type="button" onClick={prevFloor} className={utilityButtonClass}>
          <ChevronDown className="h-4 w-4" />
          Floor Down (PgDn)
        </button>

        <button
          type="button"
          onClick={undo}
          disabled={!canUndo}
          className={undoButtonClass}
        >
          <Undo2 className="h-4 w-4" />
          Undo (Ctrl+Z)
        </button>

        <div className="mt-2 h-px bg-zinc-700/60" />

        <button
          type="button"
          onClick={handleOpenExport}
          className={utilityButtonClass}
        >
          <Download className="h-4 w-4" />
          Export Base
        </button>

        <button
          type="button"
          onClick={handleImportClick}
          className={utilityButtonClass}
        >
          <Upload className="h-4 w-4" />
          Import Base
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="mt-2 flex flex-col gap-1 rounded-md bg-zinc-900/60 px-3 py-2 text-xs text-zinc-400 backdrop-blur">
          <span>
            Floor:{" "}
            <span className="font-medium text-zinc-200">{currentFloor}</span>
          </span>
          <span>
            Mode: <span className="font-medium text-zinc-200">{modeLabel}</span>
          </span>
          <span>
            Pieces in base:{" "}
            <span className="font-medium text-zinc-200">{buildItems.length}</span>
          </span>
        </div>
      </div>

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        items={buildItems}
      />
    </>
  );
}
