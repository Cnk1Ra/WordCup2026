"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseServer } from "@/lib/supabase/server";
import { getCurrentAdmin } from "@/lib/supabase/auth-server";

const BUCKET = "products";

async function ensureAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) throw new Error("Não autorizado");
  return admin;
}

export async function saveProduct(input: {
  id: string;
  name: string;
  short_name: string;
  description: string;
  base_price: number;
  badge: string | null;
  is_active: boolean;
  front_image: string;
  back_image: string;
  inventory: { size: string; quantity: number }[];
  category_ids: string[];
}) {
  await ensureAdmin();
  const supabase = getSupabaseServer();

  const { error } = await supabase
    .from("products")
    .update({
      name: input.name,
      short_name: input.short_name,
      description: input.description,
      base_price: input.base_price,
      badge: input.badge,
      is_active: input.is_active,
      front_image: input.front_image || null,
      back_image: input.back_image || null,
    })
    .eq("id", input.id);
  if (error) throw new Error(error.message);

  for (const inv of input.inventory) {
    const { error: invError } = await supabase
      .from("inventory")
      .upsert(
        { product_id: input.id, size: inv.size, quantity: inv.quantity },
        { onConflict: "product_id,size" }
      );
    if (invError) throw new Error(invError.message);
  }

  // Reset + reinsert categorias
  await supabase.from("product_categories").delete().eq("product_id", input.id);
  if (input.category_ids.length > 0) {
    const rows = input.category_ids.map((cid) => ({
      product_id: input.id,
      category_id: cid,
    }));
    const { error: catError } = await supabase
      .from("product_categories")
      .insert(rows);
    if (catError) throw new Error(catError.message);
  }

  revalidatePath("/admin/produtos");
  revalidatePath("/");
}

export async function uploadProductImage(formData: FormData): Promise<string> {
  await ensureAdmin();
  const file = formData.get("file") as File | null;
  const productId = formData.get("productId") as string | null;
  const slot = formData.get("slot") as string | null;

  if (!file || !productId || !slot) {
    throw new Error("Dados incompletos");
  }

  const supabase = getSupabaseServer();
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${productId}/${slot}-${Date.now()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, buffer, {
      contentType: file.type,
      upsert: false,
    });
  if (error) throw new Error(error.message);

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(path);

  return publicUrl;
}

// Remove a URL da imagem do produto (front ou back). Não deleta o arquivo
// do storage — só desvincula. Se quiser limpar storage, vira tarefa de
// housekeeping separada.
export async function removeProductImage(input: {
  id: string;
  slot: "front" | "back";
}) {
  await ensureAdmin();
  const supabase = getSupabaseServer();
  const column = input.slot === "front" ? "front_image" : "back_image";
  const { error } = await supabase
    .from("products")
    .update({ [column]: null })
    .eq("id", input.id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/produtos");
  revalidatePath("/");
}

// Deleta produto + inventory + product_categories (CASCADE FK).
// Bloqueia se houver pedidos com esse produto (proteção contra
// quebrar histórico).
export async function deleteProductAction(id: string) {
  await ensureAdmin();
  const supabase = getSupabaseServer();

  const { count: orderItemCount } = await supabase
    .from("order_items")
    .select("id", { count: "exact", head: true })
    .eq("product_id", id);
  if ((orderItemCount ?? 0) > 0) {
    throw new Error(
      `Não dá pra excluir: produto está em ${orderItemCount} pedido(s). ` +
        "Em vez disso, desative o produto (ele some da loja mas mantém o histórico)."
    );
  }

  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/admin/produtos");
  revalidatePath("/");
  redirect("/admin/produtos");
}
