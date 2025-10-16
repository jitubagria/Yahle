// server/jobs/autoRunner.ts
import registry from './registry';

export function runAll() {
  const jobs = registry.listJobs();
  jobs.forEach(j => {
    const handler = registry.getHandler(j.name);
    if (handler) {
      try {
        // run async but don't await - best-effort
        Promise.resolve().then(() => handler());
      } catch (err) {
        // silent - individual handlers should log
      }
    }
  });
}

export default { runAll };
