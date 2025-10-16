# Yahle / DocsUniverse Server

This repository contains the DocsUniverse API server built with TypeScript, Express, Drizzle (MySQL), and Pino logging.

## Logging

DocsUniverse Server uses Pino for structured logs.

| Environment | Behavior |
|-------------|----------|
| development | pretty-printed color logs (pino-pretty) |
| production  | structured JSON logs (for ELK/Datadog) |
| test        | silent |

Control verbosity with the LOG_LEVEL environment variable (e.g. `info`, `warn`, `error`).

### Request correlation and advanced integrations

You can add per-request correlation IDs and stream logs to external systems using Pino transports or integrations with OpenTelemetry/Prometheus.

Example middleware for correlation ids:

```ts
app.use((req, _res, next) => {
  // Node 18+ or polyfill
  (req as any).id = crypto.randomUUID();
  logger.info({ reqId: (req as any).id, url: req.url }, 'Request started');
  next();
});
```

## Status

- JWT + refresh token authentication ✅
- OTP login via BigTos with optional test bypass ✅
- Typed DB helpers (Drizzle) ✅
- Structured logging (pino) ✅
- Automated tests and CI workflow ✅

---

See `docs/CI.md` for CI and test notes.