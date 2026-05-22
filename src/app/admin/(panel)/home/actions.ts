"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServer } from "@/lib/supabase/server";
import { getCurrentAdmin } from "@/lib/supabase/auth-server";
import { logAdminAction } from "@/lib/audit-log";

async function ensureAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) throw new Error("Não autorizado");
}

function revalidateHome() {
  revalidatePath("/", "layout");
  revalidatePath("/admin/home");
}

export async function toggleSectionEnabled(id: string) {
  await ensureAdmin();
  const supabase = getSupabaseServer();
  const { data: cur } = await supabase
    .from("home_sections")
    .select("enabled, kind, title")
    .eq("id", id)
    .single();
  if (!cur) return;
  const next = !cur.enabled;
  await supabase
    .from("home_sections")
    .update({ enabled: next })
    .eq("id", id);
  await logAdminAction({
    action: next ? "home_section.enable" : "home_section.disable",
    entityType: "home_sections",
    entityId: id,
    description: `${next ? "Ativou" : "Desativou"} seção ${cur.title ?? cur.kind ?? id}`,
  });
  revalidateHome();
}

export async function moveSection(id: string, direction: "up" | "down") {
  await ensureAdmin();
  const supabase = getSupabaseServer();
  const { data: all } = await supabase
    .from("home_sections")
    .select("id, display_order")
    .order("display_order");
  if (!all) return;

  const idx = all.findIndex((s) => s.id === id);
  if (idx === -1) return;
  const swapIdx = direction === "up" ? idx - 1 : idx + 1;
  if (swapIdx < 0 || swapIdx >= all.length) return;

  const a = all[idx];
  const b = all[swapIdx];
  await supabase
    .from("home_sections")
    .update({ display_order: b.display_order })
    .eq("id", a.id);
  await supabase
    .from("home_sections")
    .update({ display_order: a.display_order })
    .eq("id", b.id);

  revalidateHome();
}

export async function updateSectionData(
  id: string,
  data: Record<string, unknown>
) {
  await ensureAdmin();
  const supabase = getSupabaseServer();
  const { error } = await supabase
    .from("home_sections")
    .update({ data })
    .eq("id", id);
  if (error) throw new Error(error.message);
  await logAdminAction({
    action: "home_section.update",
    entityType: "home_sections",
    entityId: id,
    description: `Editou conteúdo da seção ${id}`,
  });
  revalidateHome();
}

// Busca produtos pelo nome pra o picker (admin). Retorna até 20.
// Estratégia em 2 passos:
// 1) ILIKE direto (rápido, mas não tolera acentos)
// 2) Se pouco resultado, fetch paginado de todos os ativos + normalize
//    client-side (cobre acentos, cobre catalogo > 1000 produtos)
export async function searchProductsForPicker(query: string) {
  await ensureAdmin();
  const q = query.trim();
  if (!q) return [];
  const supabase = getSupabaseServer();
  const norm = (s: string) =>
    s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const qn = norm(q);

  // 1ª tentativa: ILIKE rápido
  const { data: direct } = await supabase
    .from("products")
    .select("id, slug, name, short_name, front_image")
    .eq("is_active", true)
    .or(`name.ilike.%${q}%,short_name.ilike.%${q}%,slug.ilike.%${qn}%`)
    .limit(20);
  if ((direct?.length ?? 0) >= 5) return direct ?? [];

  // Fallback: paginação + normalize (sem limite de 1000)
  const all: { id: string; slug: string; name: string; short_name: string | null; front_image: string | null }[] = [];
  let offset = 0;
  while (true) {
    const { data: page } = await supabase
      .from("products")
      .select("id, slug, name, short_name, front_image")
      .eq("is_active", true)
      .range(offset, offset + 999);
    if (!page || page.length === 0) break;
    all.push(...page);
    if (page.length < 1000) break;
    offset += 1000;
  }
  return all
    .filter((p) => norm(`${p.name} ${p.short_name ?? ""} ${p.slug}`).includes(qn))
    .slice(0, 20);
}

// Resolve IDs em dados pra exibir no preview da lista de picks.
export async function getProductsByIds(ids: string[]) {
  await ensureAdmin();
  if (ids.length === 0) return [];
  const supabase = getSupabaseServer();
  const { data } = await supabase
    .from("products")
    .select("id, slug, name, short_name, front_image")
    .in("id", ids);
  // Preserva a ordem do array de entrada
  const byId = new Map((data ?? []).map((p) => [p.id, p]));
  return ids
    .map((id) => byId.get(id))
    .filter((p): p is NonNullable<typeof p> => !!p);
}

export async function uploadSectionImage(formData: FormData): Promise<string> {
  await ensureAdmin();
  const file = formData.get("file") as File | null;
  if (!file) throw new Error("Arquivo obrigatório.");
  if (!file.type.startsWith("image/")) throw new Error("Precisa ser imagem.");
  if (file.size > 5_000_000) throw new Error("Máx 5MB.");

  const supabase = getSupabaseServer();
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
  const path = `home/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const { error } = await supabase.storage
    .from("home")
    .upload(path, buffer, { contentType: file.type, upsert: false });
  if (error) throw new Error(error.message);
  const {
    data: { publicUrl },
  } = supabase.storage.from("home").getPublicUrl(path);
  return publicUrl;
}
