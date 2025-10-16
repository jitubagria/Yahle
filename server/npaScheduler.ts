import cron from 'node-cron';
import { npaService } from './npaService';
import logger from './lib/logger';

/**
 * NPA Certificate Automation Scheduler
 * 
 * Runs daily at 3:00 AM to check for certificates that need to be generated
 * based on doctor opt-in preferences (preferredDay matching current day of month)
 */
export function initializeNPAScheduler() {
  // Run every day at 3:00 AM
  // Format: minute hour day month weekday
  // '0 3 * * *' = At 3:00 AM every day
  cron.schedule('0 3 * * *', async () => {
    logger.info('[NPA Scheduler] Starting daily NPA certificate automation...');
    
    try {
      const result = await npaService.runDailyAutomation();
      logger.info({ result }, `[NPA Scheduler] Automation complete: ${result.success} successful, ${result.failed} failed out of ${result.total} total`);
    } catch (error) {
      logger.error({ err: error }, '[NPA Scheduler] Error running daily automation:');
    }
  });

  logger.info('[NPA Scheduler] Initialized - will run daily at 3:00 AM');
}
