"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServer } from "@/lib/supabase/server";
import { getCurrentAdmin } from "@/lib/supabase/auth-server";

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
    .select("enabled")
    .eq("id", id)
    .single();
  if (!cur) return;
  await supabase
    .from("home_sections")
    .update({ enabled: !cur.enabled })
    .eq("id", id);
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
  revalidateHome();
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
