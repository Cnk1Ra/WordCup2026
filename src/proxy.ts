import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Rate limit /buscar — server component faz fetch de toda a tabela de
  // produtos a cada request. Sem limit, atacante pode DoS o DB. 30 req/min
  // é generoso pra uso real (3 buscas/seg por usuario).
  if (path === "/buscar" && request.nextUrl.searchParams.has("q")) {
    const ip = getClientIp(request.headers);
    const rl = rateLimit(`search:${ip}`, 30, 60 * 1000);
    if (!rl.ok) {
      return new NextResponse(
        "Muitas buscas. Aguarde um momento.",
        { status: 429, headers: { "Retry-After": String(rl.resetInSeconds) } }
      );
    }
  }

  const response = NextResponse.next({
    request: { headers: request.headers },
  });

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
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Refresh session
  await supabase.auth.getUser();

  if (path.startsWith("/admin") && path !== "/admin/login") {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirectTo", path);
      return NextResponse.redirect(loginUrl);
    }
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/buscar"],
};
