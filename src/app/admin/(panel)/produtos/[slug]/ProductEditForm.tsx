"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Upload,
  Save,
  Loader2,
  CheckCircle2,
  XCircle,
  ImageIcon,
} from "lucide-react";
import {
  saveProduct,
  uploadProductImage,
  removeProductImage,
  deleteProductAction,
} from "./actions";
import { Trash2 } from "lucide-react";

const SIZES = ["P", "M", "G", "GG", "XGG"] as const;

type Inventory = { size: string; quantity: number };
type Product = {
  id: string;
  slug: string;
  name: string;
  short_name: string | null;
  description: string | null;
  base_price: string | number;
  badge: string | null;
  is_active: boolean;
  front_image: string | null;
  back_image: string | null;
  hex: string | null;
  accent_hex: string | null;
  text_color: string | null;
  color: string | null;
};

type Category = { id: string; name: string; slug: string };

export function ProductEditForm({
  product,
  inventory,
  allCategories,
  selectedCategoryIds,
}: {
  product: Product;
  inventory: Inventory[];
  allCategories: Category[];
  selectedCategoryIds: string[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState<{
    type: "success" | "error";
    msg: string;
  } | null>(null);

  const [name, setName] = useState(product.name);
  const [shortName, setShortName] = useState(product.short_name ?? "");
  const [description, setDescription] = useState(product.description ?? "");
  const [basePrice, setBasePrice] = useState(String(product.base_price));
  const [badge, setBadge] = useState(product.badge ?? "");
  const [isActive, setIsActive] = useState(product.is_active);
  const [frontImage, setFrontImage] = useState(product.front_image ?? "");
  const [backImage, setBackImage] = useState(product.back_image ?? "");

  const initialStock: Record<string, number> = {};
  SIZES.forEach((s) => {
    initialStock[s] = inventory.find((i) => i.size === s)?.quantity ?? 0;
  });
  const [stock, setStock] = useState(initialStock);
  const [selectedCats, setSelectedCats] = useState<Set<string>>(
    new Set(selectedCategoryIds)
  );

  function toggleCat(id: string) {
    setSelectedCats((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function flash(type: "success" | "error", msg: string) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  }

  async function handleRemoveImage(slot: "front" | "back") {
    if (!confirm(`Remover imagem ${slot === "front" ? "da frente" : "das costas"}?`)) return;
    try {
      await removeProductImage({ id: product.id, slot });
      if (slot === "front") setFrontImage("");
      else setBackImage("");
      flash("success", "Imagem removida.");
    } catch (e) {
      flash("error", e instanceof Error ? e.message : "Erro ao remover.");
    }
  }

  async function handleDeleteProduct() {
    const confirmed = confirm(
      `Excluir DEFINITIVAMENTE o produto "${product.short_name ?? product.name}"?\n\n` +
        "Isso apaga o produto e todo seu estoque/categorias vinculadas. " +
        "Se quiser só tirar da loja, desative em vez disso."
    );
    if (!confirmed) return;
    startTransition(async () => {
      try {
        await deleteProductAction(product.id);
      } catch (e) {
        flash("error", e instanceof Error ? e.message : "Erro ao excluir.");
      }
    });
  }

  async function handleUpload(slot: "front" | "back", file: File) {
    if (!file.type.startsWith("image/")) {
      flash("error", "Arquivo precisa ser uma imagem.");
      return;
    }
    if (file.size > 5_000_000) {
      flash("error", "Imagem muito grande (máx 5MB).");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("productId", product.id);
    formData.append("slot", slot);
    try {
      const url = await uploadProductImage(formData);
      if (slot === "front") setFrontImage(url);
      else setBackImage(url);
      flash("success", "Imagem enviada.");
    } catch (e) {
      flash("error", e instanceof Error ? e.message : "Erro no upload.");
    }
  }

  function handleSave() {
    startTransition(async () => {
      try {
        await saveProduct({
          id: product.id,
          name,
          short_name: shortName,
          description,
          base_price: Number(basePrice),
          badge: badge || null,
          is_active: isActive,
          front_image: frontImage,
          back_image: backImage,
          inventory: Object.entries(stock).map(([size, quantity]) => ({
            size,
            quantity: Math.max(0, Math.floor(quantity)),
          })),
          category_ids: Array.from(selectedCats),
        });
        flash("success", "Salvo com sucesso.");
        router.refresh();
      } catch (e) {
        flash("error", e instanceof Error ? e.message : "Erro ao salvar.");
      }
    });
  }

  return (
    <div className="flex flex-col gap-4 pb-24">
      {allCategories.length > 0 && (
        <section className="rounded-3xl bg-white border border-border p-6 flex flex-col gap-4">
          <h2 className="font-bold">Categorias</h2>
          <p className="text-xs text-foreground/60">
            Em quais categorias esse produto aparece? Selecione uma ou mais.
          </p>
          <div className="flex flex-wrap gap-2">
            {allCategories.map((c) => {
              const active = selectedCats.has(c.id);
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => toggleCat(c.id)}
                  className={`px-4 h-9 rounded-full text-sm font-bold transition border ${
                    active
                      ? "bg-foreground text-white border-foreground"
                      : "bg-white text-foreground/70 border-border hover:border-foreground"
                  }`}
                >
                  {c.name}
                </button>
              );
            })}
          </div>
        </section>
      )}

      <section className="rounded-3xl bg-white border border-border p-6 flex flex-col gap-4">
        <h2 className="font-bold">Imagens</h2>
        <p className="text-xs text-foreground/60">
          PNG ou JPG, máx 5MB. Frente e costas separadas.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <ImageSlot
            label="Frente"
            url={frontImage}
            onUpload={(f) => handleUpload("front", f)}
            onRemove={() => handleRemoveImage("front")}
            tint={product.hex ?? "#000000"}
          />
          <ImageSlot
            label="Costas"
            url={backImage}
            onUpload={(f) => handleUpload("back", f)}
            onRemove={() => handleRemoveImage("back")}
            tint={product.hex ?? "#000000"}
          />
        </div>
      </section>

      <section className="rounded-3xl bg-white border border-border p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Nome completo">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full h-11 rounded-xl border border-border bg-muted px-4 text-sm focus:outline-none focus:border-foreground"
          />
        </Field>
        <Field label="Nome curto (card)">
          <input
            type="text"
            value={shortName}
            onChange={(e) => setShortName(e.target.value)}
            className="w-full h-11 rounded-xl border border-border bg-muted px-4 text-sm focus:outline-none focus:border-foreground"
          />
        </Field>
        <Field label="Preço base (R$)">
          <input
            type="number"
            step="0.01"
            min="0"
            value={basePrice}
            onChange={(e) => setBasePrice(e.target.value)}
            className="w-full h-11 rounded-xl border border-border bg-muted px-4 text-sm focus:outline-none focus:border-foreground"
          />
        </Field>
        <Field label="Badge (ex: Lançamento)">
          <input
            type="text"
            value={badge}
            onChange={(e) => setBadge(e.target.value)}
            placeholder="Vazio = sem badge"
            className="w-full h-11 rounded-xl border border-border bg-muted px-4 text-sm focus:outline-none focus:border-foreground"
          />
        </Field>
        <Field label="Descrição" className="sm:col-span-2">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full rounded-xl border border-border bg-muted px-4 py-3 text-sm focus:outline-none focus:border-foreground resize-none"
          />
        </Field>
        <Field label="Status" className="sm:col-span-2">
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="size-4"
            />
            <span className="text-sm">
              {isActive
                ? "Visível na loja"
                : "Oculto (não aparece pra clientes)"}
            </span>
          </label>
        </Field>
      </section>

      <section className="rounded-3xl bg-white border border-border p-6 flex flex-col gap-4">
        <div>
          <h2 className="font-bold">Estoque por tamanho</h2>
          <p className="text-xs text-foreground/60">
            Quantidade em pronta entrega. Se 0, vira &ldquo;sob encomenda&rdquo;.
          </p>
        </div>
        <div className="grid grid-cols-5 gap-2">
          {SIZES.map((s) => (
            <Field key={s} label={s}>
              <input
                type="number"
                min="0"
                value={stock[s]}
                onChange={(e) =>
                  setStock({ ...stock, [s]: Number(e.target.value) || 0 })
                }
                className="w-full h-11 rounded-xl border border-border bg-muted px-3 text-sm text-center font-bold focus:outline-none focus:border-foreground"
              />
            </Field>
          ))}
        </div>
      </section>

      {/* Save bar */}
      <div className="fixed bottom-0 inset-x-0 lg:left-64 z-30 bg-white border-t border-border p-3 flex items-center gap-3 justify-end">
        {toast && (
          <span
            className={`flex items-center gap-2 text-xs font-bold ${
              toast.type === "success" ? "text-brand-green" : "text-red-600"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="size-4" />
            ) : (
              <XCircle className="size-4" />
            )}
            {toast.msg}
          </span>
        )}
        <button
          onClick={handleSave}
          disabled={isPending}
          className="h-11 px-6 rounded-full bg-foreground text-white font-bold text-sm hover:bg-foreground/90 disabled:opacity-50 transition flex items-center gap-2"
        >
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Save className="size-4" />
          )}
          Salvar alterações
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`flex flex-col gap-1.5 ${className}`}>
      <span className="text-xs font-bold text-foreground/70">{label}</span>
      {children}
    </label>
  );
}

function ImageSlot({
  label,
  url,
  onUpload,
  onRemove,
  tint,
}: {
  label: string;
  url: string;
  onUpload: (file: File) => void;
  onRemove?: () => void;
  tint: string;
}) {
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function handleFile(file: File) {
    setUploading(true);
    await onUpload(file);
    setUploading(false);
  }

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-bold text-foreground/70">{label}</p>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const file = e.dataTransfer.files[0];
          if (file) handleFile(file);
        }}
        className={`relative aspect-square rounded-2xl border-2 border-dashed overflow-hidden transition ${
          dragOver
            ? "border-foreground bg-foreground/5"
            : "border-border bg-muted"
        }`}
        style={{ backgroundColor: dragOver ? undefined : tint + "12" }}
      >
        {url ? (
          <Image
            src={url}
            alt={label}
            fill
            sizes="(max-width: 768px) 50vw, 200px"
            className="object-contain p-3"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-foreground/40">
            <ImageIcon className="size-8" />
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 grid place-items-center bg-white/70">
            <Loader2 className="size-6 animate-spin" />
          </div>
        )}
        <div className="absolute bottom-2 right-2 flex items-center gap-2">
          {url && onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="inline-flex items-center gap-1 rounded-full bg-white border border-border text-red-600 text-[11px] font-bold px-3 py-1.5 hover:bg-red-50 transition"
            >
              <Trash2 className="size-3.5" />
              Remover
            </button>
          )}
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />
            <span className="inline-flex items-center gap-1.5 rounded-full bg-foreground text-white text-[11px] font-bold px-3 py-1.5 hover:bg-foreground/90 transition">
              <Upload className="size-3.5" />
              Trocar
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}
