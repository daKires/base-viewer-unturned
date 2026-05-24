"use client";

import { ChangeEvent, useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Check,
  ClipboardPaste,
  Copy,
  Paintbrush,
  Trash2,
  X,
} from "lucide-react";
import { useBaseStore } from "@/store/useBaseStore";

interface PaletteColor {
  name: string;
  hex: string;
}

const COLOR_PALETTE: PaletteColor[] = [
  { name: "Vermelho", hex: "#ef4444" },
  { name: "Verde", hex: "#22c55e" },
  { name: "Azul", hex: "#3b82f6" },
  { name: "Amarelo", hex: "#eab308" },
  { name: "Madeira", hex: "#92400e" },
  { name: "Metal", hex: "#71717a" },
];

const COMMENT_MAX = 500;
const MOVE_STEP = 4;
const PASTE_OFFSET_X = 4;
const PASTE_OFFSET_Z = 0;

export default function SelectionPanel() {
  const selectedIds = useBaseStore((state) => state.selectedIds);
  const buildItems = useBaseStore((state) => state.buildItems);
  const updateMetadataForSelected = useBaseStore(
    (state) => state.updateMetadataForSelected
  );
  const clearSelection = useBaseStore((state) => state.clearSelection);
  const deleteSelected = useBaseStore((state) => state.deleteSelected);
  const copySelected = useBaseStore((state) => state.copySelected);
  const pasteClipboard = useBaseStore((state) => state.pasteClipboard);
  const moveSelected = useBaseStore((state) => state.moveSelected);
  const clipboardSize = useBaseStore((state) => state.clipboard.length);

  const [comment, setComment] = useState("");

  const selectionKey = selectedIds.join(",");

  useEffect(() => {
    if (selectedIds.length === 0) {
      setComment("");
      return;
    }
    const firstSelected = buildItems.find((it) => it.id === selectedIds[0]);
    setComment(firstSelected?.comment ?? "");
  }, [selectionKey, selectedIds, buildItems]);

  if (selectedIds.length === 0) return null;

  const count = selectedIds.length;
  const headerText =
    count === 1 ? "1 item selecionado" : `${count} itens selecionados`;

  const handleApplyColor = (hex: string) => {
    updateMetadataForSelected({ color: hex });
  };

  const handleClearColor = () => {
    updateMetadataForSelected({ color: undefined });
  };

  const handleCommentChange = (event: ChangeEvent<HTMLInputElement>) => {
    setComment(event.target.value);
  };

  const handleApplyComment = () => {
    const trimmed = comment.trim();
    updateMetadataForSelected({
      comment: trimmed === "" ? undefined : trimmed,
    });
  };

  const handlePaste = () => {
    pasteClipboard(PASTE_OFFSET_X, PASTE_OFFSET_Z);
  };

  const iconButton =
    "flex h-8 w-8 items-center justify-center rounded bg-zinc-800 text-white hover:bg-zinc-700 transition-colors";
  const actionButton =
    "flex items-center gap-1 rounded bg-zinc-800 px-3 py-1.5 text-xs text-white hover:bg-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-zinc-800";
  const deleteButton =
    "flex items-center gap-1 rounded bg-rose-600/90 px-3 py-1.5 text-xs text-white hover:bg-rose-600 transition-colors";

  return (
    <div className="absolute bottom-4 left-1/2 z-10 flex min-w-[560px] -translate-x-1/2 flex-col gap-3 rounded-lg bg-zinc-900/90 px-4 py-3 text-sm text-white shadow-xl ring-1 ring-zinc-700 backdrop-blur">
      <div className="flex items-center justify-between">
        <span className="font-medium text-zinc-100">{headerText}</span>
        <button
          type="button"
          onClick={clearSelection}
          className="flex items-center gap-1 rounded px-2 py-1 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-white"
        >
          <X className="h-3.5 w-3.5" />
          Limpar Seleção
        </button>
      </div>

      <div className="flex items-center gap-2">
        <Paintbrush className="h-4 w-4 text-zinc-400" />
        <div className="flex flex-wrap gap-2">
          {COLOR_PALETTE.map((color) => (
            <button
              key={color.hex}
              type="button"
              title={color.name}
              onClick={() => handleApplyColor(color.hex)}
              style={{ backgroundColor: color.hex }}
              className="h-8 w-8 rounded-md ring-1 ring-zinc-700 transition hover:ring-2 hover:ring-zinc-300"
            />
          ))}
        </div>
        <button
          type="button"
          onClick={handleClearColor}
          className="ml-1 rounded px-2 py-1 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-white"
        >
          Limpar cor
        </button>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={comment}
          onChange={handleCommentChange}
          maxLength={COMMENT_MAX}
          placeholder="Comentário (ex: cozinha, entrada principal)"
          className="flex-1 rounded bg-zinc-800 px-3 py-2 text-sm text-white placeholder-zinc-500 outline-none ring-1 ring-zinc-700 focus:ring-emerald-500"
        />
        <button
          type="button"
          onClick={handleApplyComment}
          className="flex items-center gap-1 rounded bg-emerald-600/90 px-3 py-2 text-sm text-white hover:bg-emerald-600"
        >
          <Check className="h-4 w-4" />
          Aplicar
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-t border-zinc-700/60 pt-3">
        <div className="flex items-center gap-1">
          <span className="mr-1 text-xs text-zinc-400">Mover:</span>
          <button
            type="button"
            onClick={() => moveSelected(0, -MOVE_STEP)}
            title="Z- (frente)"
            className={iconButton}
          >
            <ArrowUp className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => moveSelected(0, MOVE_STEP)}
            title="Z+ (trás)"
            className={iconButton}
          >
            <ArrowDown className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => moveSelected(-MOVE_STEP, 0)}
            title="X- (esquerda)"
            className={iconButton}
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => moveSelected(MOVE_STEP, 0)}
            title="X+ (direita)"
            className={iconButton}
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

        <button type="button" onClick={copySelected} className={actionButton}>
          <Copy className="h-3.5 w-3.5" />
          Copiar
        </button>
        <button
          type="button"
          onClick={handlePaste}
          disabled={clipboardSize === 0}
          className={actionButton}
        >
          <ClipboardPaste className="h-3.5 w-3.5" />
          Colar ao lado
        </button>

        <button
          type="button"
          onClick={deleteSelected}
          className={`${deleteButton} ml-auto`}
        >
          <Trash2 className="h-3.5 w-3.5" />
          Deletar (Del)
        </button>
      </div>
    </div>
  );
}
