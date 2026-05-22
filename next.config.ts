import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).host
  : null;

// CSP — controla o que o browser pode carregar/executar. Bloqueia XSS via
// dominios não-permitidos. Stripe Checkout precisa de stripe.com + js.stripe.com.
// 'unsafe-inline' em style é necessario pro Tailwind v4 runtime + JSX inline styles.
// 'unsafe-eval' em script só em dev (Turbopack hot reload).
const isDev = process.env.NODE_ENV !== "production";
const csp = [
  `default-src 'self'`,
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://js.stripe.com`,
  `style-src 'self' 'unsafe-inline'`,
  `img-src 'self' data: blob: https: http:`,
  `font-src 'self' data:`,
  `connect-src 'self' ${supabaseHost ? `https://${supabaseHost} wss://${supabaseHost}` : ""} https://api.stripe.com https://*.vercel-insights.com https://*.sentry.io https://*.ingest.sentry.io https://*.ingest.us.sentry.io`,
  `frame-src 'self' https://js.stripe.com https://hooks.stripe.com`,
  `frame-ancestors 'none'`,
  `base-uri 'self'`,
  `form-action 'self' https://checkout.stripe.com`,
  `upgrade-insecure-requests`,
].join("; ");

const securityHeaders = [
  // Força HTTPS por 2 anos + inclui subdominios + preload list (precisa submit em hstspreload.org depois)
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  // Previne MIME-sniffing (server diz "text/plain" → browser não tenta interpretar como HTML)
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Anti-clickjacking — não embebível em iframe externo
  { key: "X-Frame-Options", value: "DENY" },
  // Refer só envia origem (não path completo) em cross-origin
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Desabilita APIs sensíveis que não usamos
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  // CSP
  { key: "Content-Security-Policy", value: csp },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      ...(supabaseHost
        ? [
            {
              protocol: "https" as const,
              hostname: supabaseHost,
              pathname: "/storage/v1/object/public/**",
            },
          ]
        : []),
      { protocol: "https" as const, hostname: "placehold.co" },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

// Wrap com Sentry. Em dev sem DSN, withSentryConfig vira no-op (não interfere).
// Pra envio de source maps, defina SENTRY_AUTH_TOKEN (escopo write) no Vercel.
export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: !process.env.CI,
  widenClientFileUpload: true,
  // Não tenta upload de source maps se nao tiver auth token (evita warning ruidoso)
  sourcemaps: {
    disable: !process.env.SENTRY_AUTH_TOKEN,
  },
});
