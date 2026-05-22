import * as Sentry from "@sentry/nextjs";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0.1,
    environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? "development",
    release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
    // Não capturar PII por padrao
    sendDefaultPii: false,
    integrations: [
      Sentry.replayIntegration({
        // Mascarar todos os textos/inputs por padrao — replay nao deve vazar
        // dados de cliente (nome, email, endereco, CPF).
        maskAllText: true,
        maskAllInputs: true,
        blockAllMedia: true,
      }),
    ],
  });
}

// Captura erros de navegacao (App Router)
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
