"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSupabaseAuth } from "@/lib/supabase/auth-server";

export type LoginState = { error: string | null };

export async function loginAction(
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const redirectTo = String(formData.get("redirectTo") || "/admin");

  if (!email || !password) {
    return { error: "Email e senha são obrigatórios." };
  }

  const supabase = await getSupabaseAuth();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { error: translateError(error.message) };
  }

  revalidatePath("/", "layout");
  redirect(redirectTo);
}

function translateError(msg: string): string {
  if (/invalid login credentials/i.test(msg)) return "Email ou senha incorretos.";
  if (/email not confirmed/i.test(msg)) return "Email não confirmado.";
  if (/too many/i.test(msg))
    return "Muitas tentativas. Tente em alguns minutos.";
  return msg;
}
