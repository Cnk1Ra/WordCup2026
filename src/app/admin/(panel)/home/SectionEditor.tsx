"use client";

import { useState, useTransition } from "react";
import {
  ArrowLeft,
  Save,
  Loader2,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import { updateSectionData, uploadSectionImage } from "./actions";
import { SECTION_TYPE_LABELS, type HomeSection, type HeroSlide, type TrustBarItem } from "@/lib/home-sections-types";
import { ProductPicker } from "./ProductPicker";

type Props = {
  section: HomeSection;
  onBack: () => void;
};

export function SectionEditor({ section, onBack }: Props) {
  const [saving, startTransition] = useTransition();
  const [toast, setToast] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-4">
      <button
        onClick={onBack}
        className="self-start inline-flex items-center gap-1 text-sm text-foreground/60 hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Voltar
      </button>

      <header>
        <p className="text-xs uppercase tracking-wider text-foreground/50 font-semibold">
          Editando seção
        </p>
        <h2 className="text-2xl font-black tracking-tight">
          {SECTION_TYPE_LABELS[section.type]}
        </h2>
      </header>

      {section.type === "hero_carousel" && (
        <HeroCarouselEditor
          section={section}
          onSave={(data) => {
            startTransition(async () => {
              await updateSectionData(section.id, data as Record<string, unknown>);
              setToast("Salvo!");
              setTimeout(() => setToast(null), 2000);
            });
          }}
          saving={saving}
        />
      )}
      {section.type === "trust_bar" && (
        <TrustBarEditor
          section={section}
          onSave={(data) => {
            startTransition(async () => {
              await updateSectionData(section.id, data as Record<string, unknown>);
              setToast("Salvo!");
              setTimeout(() => setToast(null), 2000);
            });
          }}
          saving={saving}
        />
      )}
      {(section.type === "categories" ||
        section.type === "products_grid" ||
        section.type === "how_it_works" ||
        section.type === "faq") && (
        <GenericEditor
          section={section}
          onSave={(data) => {
            startTransition(async () => {
              await updateSectionData(section.id, data as Record<string, unknown>);
              setToast("Salvo!");
              setTimeout(() => setToast(null), 2000);
            });
          }}
          saving={saving}
        />
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 bg-brand-green text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}

function HeroCarouselEditor({
  section,
  onSave,
  saving,
}: {
  section: Extract<HomeSection, { type: "hero_carousel" }>;
  onSave: (data: unknown) => void;
  saving: boolean;
}) {
  const [slides, setSlides] = useState<HeroSlide[]>(section.data.slides ?? []);
  const [autoplay, setAutoplay] = useState(section.data.autoplay_seconds ?? 6);

  function update(i: number, patch: Partial<HeroSlide>) {
    setSlides((prev) => prev.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  }

  function addSlide() {
    setSlides((prev) => [
      ...prev,
      {
        image: "",
        tag: "",
        title_1: "",
        title_2: "",
        description: "",
        cta_label: "Comprar agora",
        cta_link: "/",
      },
    ]);
  }

  function removeSlide(i: number) {
    if (!confirm("Remover este slide?")) return;
    setSlides((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function handleImageUpload(i: number, file: File) {
    const fd = new FormData();
    fd.append("file", file);
    try {
      const url = await uploadSectionImage(fd);
      update(i, { image: url });
    } catch (e) {
      alert(e instanceof Error ? e.message : "Erro upload.");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-3xl bg-white border border-border p-5 flex items-center gap-3">
        <label className="text-xs font-bold text-foreground/70">
          Tempo entre slides (segundos)
        </label>
        <input
          type="number"
          min="3"
          max="20"
          value={autoplay}
          onChange={(e) => setAutoplay(parseInt(e.target.value, 10))}
          className="w-20 h-9 rounded-2xl border border-border bg-muted px-3 text-sm font-medium focus:outline-none focus:border-foreground"
        />
      </div>

      {slides.map((slide, i) => (
        <div
          key={i}
          className="rounded-3xl bg-white border border-border p-5 flex flex-col gap-4"
        >
          <div className="flex items-center justify-between">
            <p className="font-bold">Slide {i + 1}</p>
            <button
              onClick={() => removeSlide(i)}
              className="p-2 rounded-lg hover:bg-red-50 text-red-600"
              aria-label="Remover"
            >
              <Trash2 className="size-4" />
            </button>
          </div>

          <ImageField
            value={slide.image}
            onChange={(v) => update(i, { image: v })}
            onUpload={(f) => handleImageUpload(i, f)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Etiqueta">
              <input
                value={slide.tag}
                onChange={(e) => update(i, { tag: e.target.value })}
                placeholder="Ex.: Coleção 2026"
                className="h-11 rounded-2xl border border-border bg-muted px-4 text-sm font-medium focus:outline-none focus:border-foreground"
              />
            </Field>
            <Field label="Título (linha 1)">
              <input
                value={slide.title_1}
                onChange={(e) => update(i, { title_1: e.target.value })}
                className="h-11 rounded-2xl border border-border bg-muted px-4 text-sm font-medium focus:outline-none focus:border-foreground"
              />
            </Field>
            <Field label="Título (linha 2 — destacada)">
              <input
                value={slide.title_2}
                onChange={(e) => update(i, { title_2: e.target.value })}
                className="h-11 rounded-2xl border border-border bg-muted px-4 text-sm font-medium focus:outline-none focus:border-foreground"
              />
            </Field>
            <Field label="Texto do botão">
              <input
                value={slide.cta_label}
                onChange={(e) => update(i, { cta_label: e.target.value })}
                className="h-11 rounded-2xl border border-border bg-muted px-4 text-sm font-medium focus:outline-none focus:border-foreground"
              />
            </Field>
            <Field label="Descrição" full>
              <textarea
                value={slide.description}
                onChange={(e) => update(i, { description: e.target.value })}
                rows={2}
                className="rounded-2xl border border-border bg-muted px-4 py-3 text-sm font-medium focus:outline-none focus:border-foreground resize-none"
              />
            </Field>
            <Field label="Link do botão" full>
              <input
                value={slide.cta_link}
                onChange={(e) => update(i, { cta_link: e.target.value })}
                placeholder="/colecao/... ou #camisas"
                className="h-11 rounded-2xl border border-border bg-muted px-4 text-sm font-medium focus:outline-none focus:border-foreground"
              />
            </Field>
          </div>
        </div>
      ))}

      <button
        onClick={addSlide}
        type="button"
        className="self-start inline-flex items-center gap-2 h-11 px-5 rounded-full border-2 border-dashed border-border hover:border-foreground text-sm font-bold"
      >
        <Plus className="size-4" /> Adicionar slide
      </button>

      <SaveBar
        saving={saving}
        onSave={() => onSave({ slides, autoplay_seconds: autoplay })}
      />
    </div>
  );
}

function TrustBarEditor({
  section,
  onSave,
  saving,
}: {
  section: Extract<HomeSection, { type: "trust_bar" }>;
  onSave: (data: unknown) => void;
  saving: boolean;
}) {
  const [items, setItems] = useState<TrustBarItem[]>(section.data.items ?? []);

  function update(i: number, patch: Partial<TrustBarItem>) {
    setItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  }

  function add() {
    setItems((prev) => [
      ...prev,
      { icon: "star", title: "Novo selo", subtitle: "Descrição curta" },
    ]);
  }

  function remove(i: number) {
    if (!confirm("Remover este selo?")) return;
    setItems((prev) => prev.filter((_, idx) => idx !== i));
  }

  return (
    <div className="flex flex-col gap-4">
      {items.map((it, i) => (
        <div key={i} className="rounded-3xl bg-white border border-border p-5 grid grid-cols-1 sm:grid-cols-[100px_1fr_1fr_auto] gap-3 items-end">
          <Field label="Ícone">
            <select
              value={it.icon}
              onChange={(e) => update(i, { icon: e.target.value as TrustBarItem["icon"] })}
              className="h-11 rounded-2xl border border-border bg-muted px-3 text-sm font-medium focus:outline-none focus:border-foreground"
            >
              <option value="truck">🚚 truck</option>
              <option value="shield">🛡 shield</option>
              <option value="star">⭐ star</option>
              <option value="package">📦 package</option>
              <option value="shirt">👕 shirt</option>
              <option value="type">📝 type</option>
            </select>
          </Field>
          <Field label="Título">
            <input
              value={it.title}
              onChange={(e) => update(i, { title: e.target.value })}
              className="h-11 rounded-2xl border border-border bg-muted px-4 text-sm font-medium focus:outline-none focus:border-foreground"
            />
          </Field>
          <Field label="Subtítulo">
            <input
              value={it.subtitle}
              onChange={(e) => update(i, { subtitle: e.target.value })}
              className="h-11 rounded-2xl border border-border bg-muted px-4 text-sm font-medium focus:outline-none focus:border-foreground"
            />
          </Field>
          <button
            onClick={() => remove(i)}
            className="h-11 px-3 rounded-lg hover:bg-red-50 text-red-600 self-end"
            aria-label="Remover"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      ))}

      <button
        onClick={add}
        type="button"
        className="self-start inline-flex items-center gap-2 h-11 px-5 rounded-full border-2 border-dashed border-border hover:border-foreground text-sm font-bold"
      >
        <Plus className="size-4" /> Adicionar selo
      </button>

      <SaveBar saving={saving} onSave={() => onSave({ items })} />
    </div>
  );
}

function GenericEditor({
  section,
  onSave,
  saving,
}: {
  section: HomeSection;
  onSave: (data: unknown) => void;
  saving: boolean;
}) {
  type GenericData = {
    title?: string;
    subtitle?: string;
    limit?: number;
    steps?: { title: string; description: string }[];
    picks?: string[];
    category_slug?: string;
  };
  const [data, setData] = useState<GenericData>(section.data as GenericData);

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-3xl bg-white border border-border p-5 flex flex-col gap-3">
        {("title" in data) && (
          <Field label="Título">
            <input
              value={data.title ?? ""}
              onChange={(e) => setData({ ...data, title: e.target.value })}
              className="h-11 rounded-2xl border border-border bg-muted px-4 text-sm font-medium focus:outline-none focus:border-foreground"
            />
          </Field>
        )}
        {("subtitle" in data) && (
          <Field label="Subtítulo / etiqueta">
            <input
              value={data.subtitle ?? ""}
              onChange={(e) => setData({ ...data, subtitle: e.target.value })}
              className="h-11 rounded-2xl border border-border bg-muted px-4 text-sm font-medium focus:outline-none focus:border-foreground"
            />
          </Field>
        )}
        {section.type === "products_grid" && (
          <Field
            label="Limite de produtos exibidos"
            hint="Quantos produtos mostrar nessa seção"
          >
            <input
              type="number"
              min="4"
              max="48"
              value={data.limit ?? 12}
              onChange={(e) =>
                setData({ ...data, limit: parseInt(e.target.value, 10) })
              }
              className="h-11 rounded-2xl border border-border bg-muted px-4 text-sm font-medium focus:outline-none focus:border-foreground w-32"
            />
          </Field>
        )}
      </div>

      {section.type === "products_grid" && (
        <ProductPicker
          picks={data.picks ?? []}
          onChange={(picks) => setData({ ...data, picks })}
          hasCategory={!!data.category_slug}
        />
      )}

      {section.type === "how_it_works" && data.steps && (
        <HowItWorksSteps
          steps={data.steps}
          onChange={(steps) => setData({ ...data, steps })}
        />
      )}

      <SaveBar saving={saving} onSave={() => onSave(data)} />
    </div>
  );
}

function HowItWorksSteps({
  steps,
  onChange,
}: {
  steps: { title: string; description: string }[];
  onChange: (s: { title: string; description: string }[]) => void;
}) {
  return (
    <div className="rounded-3xl bg-white border border-border p-5 flex flex-col gap-4">
      <p className="font-bold text-sm">Passos</p>
      {steps.map((step, i) => (
        <div key={i} className="grid grid-cols-1 gap-2 pb-3 border-b border-border last:border-b-0 last:pb-0">
          <input
            value={step.title}
            onChange={(e) => {
              const next = [...steps];
              next[i] = { ...next[i], title: e.target.value };
              onChange(next);
            }}
            placeholder={`Passo ${i + 1} — título`}
            className="h-10 rounded-2xl border border-border bg-muted px-4 text-sm font-bold focus:outline-none focus:border-foreground"
          />
          <textarea
            value={step.description}
            onChange={(e) => {
              const next = [...steps];
              next[i] = { ...next[i], description: e.target.value };
              onChange(next);
            }}
            placeholder="Descrição"
            rows={2}
            className="rounded-2xl border border-border bg-muted px-4 py-2 text-sm focus:outline-none focus:border-foreground resize-none"
          />
        </div>
      ))}
    </div>
  );
}

function ImageField({
  value,
  onChange,
  onUpload,
}: {
  value: string;
  onChange: (v: string) => void;
  onUpload: (file: File) => Promise<void> | void;
}) {
  const [uploading, setUploading] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-bold text-foreground/70">Imagem</span>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative size-32 sm:size-40 shrink-0 rounded-2xl bg-muted border border-border overflow-hidden grid place-items-center">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="size-full object-cover" />
          ) : (
            <span className="text-[11px] text-foreground/40">sem imagem</span>
          )}
        </div>
        <div className="flex flex-col gap-2 flex-1">
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="URL da imagem"
            className="h-11 rounded-2xl border border-border bg-muted px-4 text-sm focus:outline-none focus:border-foreground"
          />
          <label className="inline-flex items-center justify-center gap-2 h-10 rounded-full border-2 border-dashed border-border hover:border-foreground text-sm font-bold cursor-pointer">
            {uploading ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Enviando…
              </>
            ) : (
              <>
                <Upload className="size-4" /> Upload (max 5MB)
              </>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                setUploading(true);
                await onUpload(f);
                setUploading(false);
              }}
            />
          </label>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  hint,
  full,
  children,
}: {
  label: string;
  hint?: string;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className={`flex flex-col gap-1.5 ${full ? "sm:col-span-2" : ""}`}>
      <span className="text-xs font-bold text-foreground/70">{label}</span>
      {children}
      {hint && <span className="text-[11px] text-foreground/50">{hint}</span>}
    </label>
  );
}

function SaveBar({
  saving,
  onSave,
}: {
  saving: boolean;
  onSave: () => void;
}) {
  return (
    <div className="sticky bottom-4 self-start">
      <button
        onClick={onSave}
        disabled={saving}
        className="h-12 px-6 rounded-full bg-foreground text-white font-bold text-sm hover:bg-foreground/90 disabled:opacity-50 inline-flex items-center gap-2"
      >
        {saving ? (
          <>
            <Loader2 className="size-4 animate-spin" /> Salvando…
          </>
        ) : (
          <>
            <Save className="size-4" /> Salvar
          </>
        )}
      </button>
    </div>
  );
}
