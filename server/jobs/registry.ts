// server/jobs/registry.ts
type JobHandler = () => Promise<void> | void;

const registry: Record<string, { cron?: string; handler: JobHandler }> = {};

export function registerJob(name: string, opts: { cron?: string; handler: JobHandler }) {
  registry[name] = opts;
}

export function listJobs() {
  return Object.keys(registry).map(k => ({ name: k, cron: registry[k].cron ?? null }));
}

export function getHandler(name: string) {
  return registry[name]?.handler ?? null;
}

export default { registerJob, listJobs, getHandler };
