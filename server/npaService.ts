import { db } from "./db";
import { npaOptIns, npaTemplates, npaAutomation, doctorProfiles, users } from "@shared/schema";
import { eq, and } from "drizzle-orm";
import { bigtosService } from "./bigtos";
import html from 'html-pdf-node';
import { Storage } from '@google-cloud/storage';

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
      const pdfBuffer = await html.generatePdf(file, options);
      return pdfBuffer;
    } catch (error) {
      console.error('PDF generation error:', error);
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
      console.error('Storage upload error:', error);
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
          eq(npaOptIns.isActive, true)
        ))
        .limit(1);

      if (!optIn) {
        throw new Error('Opt-in not found or inactive');
      }

      // Get doctor profile
      const [doctorProfile] = await db
        .select()
        .from(doctorProfiles)
        .where(eq(doctorProfiles.id, optIn.doctorProfileId))
        .limit(1);

      if (!doctorProfile) {
        throw new Error('Doctor profile not found');
      }

      // Get user details
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, optIn.userId))
        .limit(1);

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
          .where(eq(npaTemplates.isActive, true))
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

      // Replace placeholders in template
      const htmlContent = this.replacePlaceholders(template.htmlContent, {
        name: doctorProfile.name || user.email || 'Doctor',
        designation: doctorProfile.designation || 'Medical Professional',
        regno: doctorProfile.registrationNumber || 'N/A',
        month: month,
        year: year,
      });

      // Generate PDF
      const pdfBuffer = await this.generatePDF(htmlContent);

      // Create unique filename
      const fileName = `NPA_${doctorProfile.registrationNumber || optIn.userId}_${month}_${year}_${Date.now()}.pdf`;

      // Upload to storage
      const certificateUrl = await this.uploadToStorage(pdfBuffer, fileName);

      // Send via WhatsApp if phone available
      const deliveryPhone = optIn.deliveryWhatsapp || user.phone;
      if (deliveryPhone) {
        await this.sendViaWhatsApp(
          deliveryPhone,
          doctorProfile.name || 'Doctor',
          month,
          year,
          certificateUrl
        );
      }

      // Log the automation
      await db.insert(npaAutomation).values({
        optInId: optIn.id,
        templateId: template.id,
        userId: optIn.userId,
        doctorProfileId: optIn.doctorProfileId,
        month: month,
        year: year,
        status: 'sent',
        certificateUrl: certificateUrl,
        sentDate: new Date(),
      });

      console.log(`NPA certificate generated and sent for opt-in ${optInId}`);

      return {
        success: true,
        certificateUrl: certificateUrl,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`NPA generation error for opt-in ${optInId}:`, errorMessage);

      // Log the error
      try {
        const now = new Date();
        const monthNames = [
          'January', 'February', 'March', 'April', 'May', 'June',
          'July', 'August', 'September', 'October', 'November', 'December'
        ];
        
        await db.insert(npaAutomation).values({
          optInId: optInId,
          templateId: null,
          userId: 0,
          doctorProfileId: 0,
          month: monthNames[now.getMonth()],
          year: now.getFullYear(),
          status: 'error',
          errorMessage: errorMessage,
        });
      } catch (logError) {
        console.error('Failed to log NPA error:', logError);
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
    console.log('Starting NPA daily automation...');

    const today = new Date().getDate(); // Day of month (1-31)

    // Get all active opt-ins that are due today
    const optIns = await db
      .select()
      .from(npaOptIns)
      .where(and(
        eq(npaOptIns.isActive, true),
        eq(npaOptIns.preferredDay, today)
      ));

    console.log(`Found ${optIns.length} opt-ins scheduled for day ${today}`);

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

    console.log(`NPA automation complete: ${successCount} success, ${failedCount} failed`);

    return {
      total: optIns.length,
      success: successCount,
      failed: failedCount,
    };
  }
}

// Export singleton instance
export const npaService = new NPAService();
