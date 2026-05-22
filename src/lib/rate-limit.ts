// Rate limit in-memory. Usa um Map de buckets por chave (geralmente IP).
// Cada bucket guarda count + timestamp de reset.
//
// Limitação conhecida: Vercel serverless tem múltiplas instâncias de função,
// cada uma com Map separado. Atacante muito sofisticado pode contornar
// distribuindo entre instâncias frias — mas cold start (~1s) já throttle.
// Pra catálogo de 700 produtos + 2 admins isso resolve 99% dos casos.
// Migrar pra @upstash/ratelimit (Redis) quando crescer.

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

// Garbage collection passivo: a cada 100 chamadas, varre buckets expirados
let calls = 0;
function maybeGc() {
  if (++calls % 100 !== 0) return;
  const now = Date.now();
  for (const [k, b] of buckets) {
    if (b.resetAt < now) buckets.delete(k);
  }
}

export type RateLimitResult = {
  ok: boolean;
  remaining: number;
  resetInSeconds: number;
};

export function rateLimit(
  key: string,
  max: number,
  windowMs: number
): RateLimitResult {
  maybeGc();
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || b.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: max - 1, resetInSeconds: Math.ceil(windowMs / 1000) };
  }
  if (b.count >= max) {
    return {
      ok: false,
      remaining: 0,
      resetInSeconds: Math.ceil((b.resetAt - now) / 1000),
    };
  }
  b.count++;
  return {
    ok: true,
    remaining: max - b.count,
    resetInSeconds: Math.ceil((b.resetAt - now) / 1000),
  };
}

// Extrai IP do request — Vercel injeta x-forwarded-for.
export function getClientIp(headers: Headers): string {
  const xff = headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const real = headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}
