# CI / Test Notes

## OTP Behavior

- `9999999999`: Test-only path. When `NODE_ENV === 'test'` and the client posts to `/api/auth/login` with mobileno `9999999999`, the endpoint will return the OTP directly in the HTTP response as `{ otp: '123456' }`. This is used to make auth tests deterministic without relying on external SMS.
- `9999999999`: Test-only path. When `ALLOW_TEST_OTP_BYPASS=true` (recommended in test/CI) and the client posts to `/api/auth/login` with mobileno `9999999999`, the endpoint will return the OTP directly in the HTTP response as `{ otp: '123456' }`. This is used to make auth tests deterministic without relying on external SMS.
- Other numbers: The server will call the BigTos API to send OTPs and will record an audit row in the `bigtos_messages` table.

## Running tests locally

Make sure to set required env vars for CI parity (or rely on test defaults):

- `JWT_SECRET` (test will default to `test-secret` if not provided)
- `JWT_REFRESH_SECRET` (test will default to `test-refresh`)
- `ALLOW_TEST_OTP_BYPASS` (set to `true` in tests to enable OTP echo for `9999999999`)

Run:

```powershell
npx tsc --noEmit
npm test -- --runInBand --detectOpenHandles
```

## GitHub Actions

The CI workflow (see `.github/workflows/test.yml`) runs the TypeScript check and the test suite.

## Secrets required in CI

Set the following repository secrets in GitHub:

- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `BIGTOS_KEY`


## Expanding coverage

Recommended next steps for test coverage:

- Add integration tests for `/api/jobs`, `/api/research`, `/api/courses` using the same `await createApp()` + Supertest pattern.
- Replace the test-only OTP bypass with a controlled mock of the BigTos client if you prefer no special-case code paths in the server.
 
## Logging

- The project uses `pino` for structured logging.
- Pretty output is enabled in development (via `pino-pretty`).
- In tests the logger is silent to avoid noisy output.
- Adjust logging verbosity using the `LOG_LEVEL` env var (e.g. `info`, `warn`, `error`).

CI tip: the workflow sets `LOG_LEVEL=warn` to reduce noise during CI runs.
### Test-mode OTP bypass

When `ALLOW_TEST_OTP_BYPASS=true`, requests to `/api/auth/login` with `mobileno = 9999999999` return the OTP directly for testing. Disable or unset this flag in production.
