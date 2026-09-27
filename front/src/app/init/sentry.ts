import * as Sentry from "@sentry/react";

const SENTRY_DSN = import.meta.env["VITE_SENTRY_DSN"] as string;

export function initSentry() {
  if (SENTRY_DSN) {
    Sentry.init({ dsn: SENTRY_DSN, environment: import.meta.env.MODE });
  }
}
