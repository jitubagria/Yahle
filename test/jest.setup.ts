// Jest setup: ensure JWT secrets are present for tests and quiet noisy logs
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';
process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'test-refresh';
process.env.NODE_ENV = process.env.NODE_ENV || 'test';
// allow explicit test OTP bypass
process.env.ALLOW_TEST_OTP_BYPASS = process.env.ALLOW_TEST_OTP_BYPASS || 'true';

// Quiet console in CI/test to avoid leaking secrets or noisy output
if (process.env.NODE_ENV === 'test') {
  // Keep console.error for test failures but quiet info/debug
  console.info = () => {};
  console.log = () => {};
  console.debug = () => {};
}

// small helper: expose a short delay for tests if needed
(global as any).__TEST_DELAY = async (ms = 10) => new Promise((r) => setTimeout(r, ms));
