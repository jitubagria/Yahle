// Re-export the canonical BigTos service implemented in src/services.
// This file acts as a stable server-side shim so other server code can
// import either the named `bigtosService` or the legacy default `bigtos`.
export * from "../src/services/bigtos";
export { bigtosService } from "../src/services/bigtos";
// Also re-export the default export so `import bigtos from './bigtos'` works.
export { default } from "../src/services/bigtos";
