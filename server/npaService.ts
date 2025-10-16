import { db } from "./db";
import { NPAStatus } from './enums';
import { npaOptIns, npaTemplates, npaAutomation, users, doctorProfiles } from "../drizzle/schema";
import { eq, and } from "drizzle-orm";
import { bigtosService } from "./bigtos";
import { Storage } from '@google-cloud/storage';
import logger from './lib/logger';
import htmlPdfNode from 'html-pdf-node';

const storage = new Storage();
const bucketName = process.env.DEFAULT_OBJECT_STORAGE_BUCKET_ID || '';

export class NPAService {
  /**
   * Replace placeholders in HTML template with actual doctor data
   */
  private replacePlaceholders(
    htmlContent: string,
    doctorData: {
      name: string;
      designation: string;
      regno: string;
      month: string;
      year: number;
    }
  ): string {
    return htmlContent
      .replace(/\{\{name\}\}/g, doctorData.name)
      .replace(/\{\{designation\}\}/g, doctorData.designation)
      .replace(/\{\{regno\}\}/g, doctorData.regno)
      .replace(/\{\{month\}\}/g, doctorData.month)
      .replace(/\{\{year\}\}/g, doctorData.year.toString());
  }

  /**
   * Generate PDF from HTML content
   */
  private async generatePDF(htmlContent: string): Promise<Buffer> {
    const options = {
      format: 'A4',
      landscape: false,
      printBackground: true,
    };

    const file = { content: htmlContent };

    try {
      const pdfBuffer = await htmlPdfNode.generatePdf(file, options);
      return pdfBuffer;
    } catch (error) {
  logger.error({ err: error }, 'PDF generation error');
      throw new Error('Failed to generate PDF');
    }
  }

  /**
   * Upload PDF to Google Cloud Storage
   */
  private async uploadToStorage(
    pdfBuffer: Buffer,
    fileName: string
  ): Promise<string> {
    try {
      const bucket = storage.bucket(bucketName);
      const blob = bucket.file(`npa-certificates/${fileName}`);

      await blob.save(pdfBuffer, {
        metadata: {
          contentType: 'application/pdf',
        },
      });

      // Make file publicly accessible
      await blob.makePublic();

      // Return public URL
      return `https://storage.googleapis.com/${bucketName}/npa-certificates/${fileName}`;
    } catch (error) {
  logger.error({ err: error }, 'Storage upload error');
      throw new Error('Failed to upload certificate to storage');
    }
  }

  /**
   * Send NPA certificate via WhatsApp
   */
  private async sendViaWhatsApp(
    mobile: string,
    doctorName: string,
    month: string,
    year: number,
    certificateUrl: string
  ): Promise<void> {
    const message = `*NPA Certificate Ready*\n\nDear Dr. ${doctorName},\n\nYour Non-Practicing Allowance certificate for ${month} ${year} is ready.\n\nDownload: ${certificateUrl}\n\nDocsUniverse`;
    
    await bigtosService.sendText(mobile, message);
  }

  /**
   * Generate and deliver NPA certificate for a single opt-in
   */
  async generateCertificate(optInId: number): Promise<{
    success: boolean;
    certificateUrl?: string;
    error?: string;
  }> {
    try {
      // Get opt-in details with doctor profile and template
      const [optIn] = await db
        .select()
        .from(npaOptIns)
        .where(and(
            eq(npaOptIns.id, optInId),
            eq(npaOptIns.isActive, 1)
          ))
        .limit(1);

      if (!optIn) {
        throw new Error('Opt-in not found or inactive');
      }

      // Get doctor profile (guard nullable doctorProfileId)
      let doctorProfile: any = null;
      if (optIn.doctorProfileId != null) {
        [doctorProfile] = await db
          .select()
          .from(doctorProfiles)
          .where(eq(doctorProfiles.id, optIn.doctorProfileId))
          .limit(1);
      }

      if (!doctorProfile) {
        throw new Error('Doctor profile not found');
      }

      // Get user details (guard nullable userId)
      let user: any = null;
      if (optIn.userId != null) {
        [user] = await db
          .select()
          .from(users)
          .where(eq(users.id, optIn.userId))
          .limit(1);
      }

      if (!user) {
        throw new Error('User not found');
      }

      // Get template (use specified template or active default)
      let template;
      if (optIn.templateId) {
        [template] = await db
          .select()
          .from(npaTemplates)
          .where(eq(npaTemplates.id, optIn.templateId))
          .limit(1);
      } else {
        [template] = await db
          .select()
          .from(npaTemplates)
          .where(eq(npaTemplates.isActive, 1))
          .limit(1);
      }

      if (!template) {
        throw new Error('No active template found');
      }

      // Current month and year
      const now = new Date();
      const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      const month = monthNames[now.getMonth()];
      const year = now.getFullYear();

      // Build doctor's full name from profile
      const doctorName = [
        doctorProfile.firstName,
        doctorProfile.middleName,
        doctorProfile.lastName
      ].filter(Boolean).join(' ') || user.email || 'Doctor';

      // Replace placeholders in template (guard htmlTemplate)
      const templateHtml = template.htmlTemplate ?? '';
      const htmlContent = this.replacePlaceholders(templateHtml, {
        name: doctorName,
        designation: doctorProfile.professionaldegree || 'Medical Professional',
        regno: `DOC${String(optIn.userId).padStart(6, '0')}`, // Generate registration number from user ID
        month: month,
        year: year,
      });

      // Generate PDF
      const pdfBuffer = await this.generatePDF(htmlContent);

      // Create unique filename
      const fileName = `NPA_${optIn.userId}_${month}_${year}_${Date.now()}.pdf`;

      // Upload to storage
      const certificateUrl = await this.uploadToStorage(pdfBuffer, fileName);

      // Send via WhatsApp if phone available
      const deliveryPhone = optIn.deliveryWhatsapp || user.phone;
      if (deliveryPhone) {
        await this.sendViaWhatsApp(
          deliveryPhone,
          doctorName,
          month,
          year,
          certificateUrl
        );
      }

      // Log the automation (cast to any to avoid strict insert type mismatches)
      await db.insert(npaAutomation).values({
        optInId: String(optIn.id),
        templateUsed: template.id,
        userId: optIn.userId,
        month: month,
  status: NPAStatus.SENT,
        generatedPdfUrl: certificateUrl,
        sentDate: new Date(),
      } as any).execute();

  logger.info({ optInId }, `NPA certificate generated and sent for opt-in ${optInId}`);

      return {
        success: true,
        certificateUrl: certificateUrl,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  logger.error({ optInId, err: errorMessage }, `NPA generation error for opt-in ${optInId}`);

      // Log the error
      try {
        const now = new Date();
        const monthNames = [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ];
        
        // Get opt-in to find user ID
        const [optIn] = await db
          .select()
          .from(npaOptIns)
          .where(eq(npaOptIns.id, optInId))
          .limit(1);
        
        await db.insert(npaAutomation).values({
          optInId: String(optInId),
          templateUsed: null,
          userId: optIn?.userId || 0,
          month: monthNames[now.getMonth()],
          status: 'error',
          lastError: errorMessage,
        } as any).execute();
      } catch (logError) {
  logger.error({ err: logError }, 'Failed to log NPA error');
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Run daily automation - check all opt-ins and generate for those due today
   */
  async runDailyAutomation(): Promise<{
    total: number;
    success: number;
    failed: number;
  }> {
  logger.info('Starting NPA daily automation...');

    const today = new Date().getDate(); // Day of month (1-31)

    // Get all active opt-ins that are due today (preferredDay stored as string)
    const optIns = await db
      .select()
      .from(npaOptIns)
      .where(and(
        eq(npaOptIns.isActive, 1),
        eq(npaOptIns.preferredDay, today)
      ));

  logger.info({ count: optIns.length, day: today }, `Found ${optIns.length} opt-ins scheduled for day ${today}`);

    let successCount = 0;
    let failedCount = 0;

    for (const optIn of optIns) {
      const result = await this.generateCertificate(optIn.id);
      if (result.success) {
        successCount++;
      } else {
        failedCount++;
      }
    }

  logger.info({ successCount, failedCount }, `NPA automation complete: ${successCount} success, ${failedCount} failed`);

    return {
      total: optIns.length,
      success: successCount,
      failed: failedCount,
    };
  }
}

// Export singleton instance
export const npaService = new NPAService();
