"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

// Global error boundary — captura erros que escapam dos layouts.
// Reporta pro Sentry antes de mostrar a tela de fallback.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="pt-BR">
      <body
        style={{
          fontFamily: "system-ui, -apple-system, sans-serif",
          padding: "2rem",
          maxWidth: "560px",
          margin: "4rem auto",
          textAlign: "center",
          color: "#222",
        }}
      >
        <h1 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "0.75rem" }}>
          Algo deu errado
        </h1>
        <p style={{ color: "#666", marginBottom: "1.5rem" }}>
          Nosso time já foi notificado. Tente recarregar a página em alguns segundos.
        </p>
        <button
          type="button"
          onClick={reset}
          style={{
            padding: "0.75rem 1.5rem",
            background: "#111",
            color: "#fff",
            border: "none",
            borderRadius: "0.75rem",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Tentar de novo
        </button>
      </body>
    </html>
  );
}
