import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const email = String(form.get("email") || "").trim();
  const password = String(form.get("password") || "");
  const redirectTo = String(form.get("redirectTo") || "/admin");

  const loginUrl = new URL("/admin/login", request.url);
  if (redirectTo && redirectTo !== "/admin") {
    loginUrl.searchParams.set("redirectTo", redirectTo);
  }

  if (!email || !password) {
    loginUrl.searchParams.set("err", "missing");
    return NextResponse.redirect(loginUrl, 303);
  }

  let response = NextResponse.redirect(new URL(redirectTo, request.url), 303);

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(items) {
          items.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    let code = "invalid";
    if (/email not confirmed/i.test(error.message)) code = "unconfirmed";
    else if (/too many/i.test(error.message)) code = "rate";
    loginUrl.searchParams.set("err", code);
    response = NextResponse.redirect(loginUrl, 303);
  }

  return response;
}
