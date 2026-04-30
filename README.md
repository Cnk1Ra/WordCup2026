# SpaceFut

E-commerce de camisas oficiais da Seleção Brasileira para a Copa 2026.

Stack: **Next.js 16 (App Router) + Tailwind v4 + Stripe Checkout**.
Foco mobile-first, design com cantos arredondados, identidade verde-amarela.

## Catálogo

4 SKUs (R$ 150 cada):

- Camisa Brasil I (amarela) — Masculina / Feminina
- Camisa Brasil II (azul) — Masculina / Feminina

**Frete fixo R$ 5** · **Personalização +R$ 49,90** (nome até 12 chars + número 1–99).

## Rodando local

```bash
npm install
cp .env.example .env.local
# adicione sua STRIPE_SECRET_KEY (sk_test_... durante dev)
npm run dev
```

Abra http://localhost:3000

## Deploy (Vercel)

Já conectado a [word-cup2026.vercel.app](https://word-cup2026.vercel.app).

Defina as env vars no Vercel:

- `STRIPE_SECRET_KEY` — chave secreta da Stripe (use `sk_live_...` em prod)
- `NEXT_PUBLIC_BASE_URL` — opcional; em prod o origin do request resolve sozinho

## Estrutura

```
src/
  app/
    page.tsx                 — home (hero + grid)
    produto/[slug]/          — PDP com personalização + sticky CTA mobile
    carrinho/                — carrinho client-side (localStorage)
    sucesso/                 — pós-pagamento
    api/checkout/route.ts    — cria Stripe Checkout Session
  components/                — Header, ProductCard
  lib/
    products.ts              — catálogo + preços
    cart.tsx                 — Cart Context Provider
public/images/               — assets (logo, fotos)
```

## TODO próximo

- Fotos de produto reais (4 jerseys, múltiplos ângulos por SKU)
- Combos (camisa + boné, kit M+F, pais & filhos)
- Webhook de Stripe pra registrar pedidos + email
- Página `/sobre`, FAQ, política de troca/devolução
- Pixel Meta + Google Tag pra anúncios geo BH+Sabará
