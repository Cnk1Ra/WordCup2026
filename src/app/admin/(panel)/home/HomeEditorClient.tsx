"use client";

import { useState, useTransition } from "react";
import {
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  ChevronRight,
  Loader2,
} from "lucide-react";
import {
  moveSection,
  toggleSectionEnabled,
} from "./actions";
import { SECTION_TYPE_LABELS, type HomeSection } from "@/lib/home-sections-types";
import { SectionEditor } from "./SectionEditor";

export default function HomeEditorClient({
  sections,
}: {
  sections: HomeSection[];
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function move(id: string, dir: "up" | "down") {
    setBusyId(id);
    startTransition(async () => {
      await moveSection(id, dir);
      setBusyId(null);
    });
  }

  function toggle(id: string) {
    setBusyId(id);
    startTransition(async () => {
      await toggleSectionEnabled(id);
      setBusyId(null);
    });
  }

  const editing = editingId
    ? sections.find((s) => s.id === editingId)
    : null;

  if (editing) {
    return (
      <SectionEditor
        section={editing}
        onBack={() => setEditingId(null)}
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-xs text-foreground/55">
        A ordem aqui é a ordem que aparece na home. Seções desativadas ficam
        ocultas mas continuam no banco.
      </p>
      {sections.map((s, i) => (
        <div
          key={s.id}
          className="rounded-3xl bg-white border border-border p-5 flex items-center gap-3"
        >
          <div className="flex flex-col gap-0.5">
            <button
              onClick={() => move(s.id, "up")}
              disabled={i === 0 || busyId === s.id}
              className="p-1 rounded hover:bg-muted disabled:opacity-20"
              aria-label="Mover pra cima"
            >
              <ArrowUp className="size-4" />
            </button>
            <button
              onClick={() => move(s.id, "down")}
              disabled={i === sections.length - 1 || busyId === s.id}
              className="p-1 rounded hover:bg-muted disabled:opacity-20"
              aria-label="Mover pra baixo"
            >
              <ArrowDown className="size-4" />
            </button>
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-[11px] uppercase tracking-wider text-foreground/50 font-semibold">
              #{i + 1}
            </p>
            <p
              className={`font-bold ${
                !s.enabled ? "text-foreground/45" : ""
              }`}
            >
              {SECTION_TYPE_LABELS[s.type]}
            </p>
          </div>

          <button
            onClick={() => toggle(s.id)}
            disabled={busyId === s.id}
            className="p-2 rounded-lg hover:bg-muted text-foreground/60 hover:text-foreground"
            title={s.enabled ? "Ativa — clique pra ocultar" : "Oculta"}
          >
            {busyId === s.id ? (
              <Loader2 className="size-4 animate-spin" />
            ) : s.enabled ? (
              <Eye className="size-4" />
            ) : (
              <EyeOff className="size-4 text-foreground/30" />
            )}
          </button>
          <button
            onClick={() => setEditingId(s.id)}
            className="h-9 px-4 rounded-full bg-foreground text-white text-xs font-bold hover:bg-foreground/90 inline-flex items-center gap-1"
          >
            Editar <ChevronRight className="size-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
