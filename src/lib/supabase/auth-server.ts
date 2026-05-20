import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function getSupabaseAuth() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(items) {
          try {
            items.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Server Component context — set ignored
          }
        },
      },
    }
  );
}

export async function getCurrentAdmin() {
  const supabase = await getSupabaseAuth();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return null;

  const { data: admin } = await supabase
    .from("admins")
    .select("id, email, name, role")
    .eq("email", user.email)
    .maybeSingle();

  if (!admin) return null;
  return { ...admin, userId: user.id };
}
