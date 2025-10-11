import { db } from "./db";
import { bigtosMessages } from "@shared/schema";

export class BigtosService {
  private apiKey: string;
  private apiUrl = 'https://www.cp.bigtos.com/api/v1/sendmessage';

  constructor() {
    // Require API key from environment variable
    // In development, allow missing key (messages won't be sent)
    this.apiKey = process.env.BIGTOS_API_KEY || '';
    if (!this.apiKey && process.env.NODE_ENV !== 'development') {
      throw new Error('BIGTOS_API_KEY environment variable is required but not set');
    }
  }

  /**
   * Sends a text-only WhatsApp message
   */
  async sendText(mobile: string, message: string): Promise<any> {
    return this.sendMessage(mobile, message, 'Text');
  }

  /**
   * Sends a WhatsApp message with an image
   */
  async sendTextImage(mobile: string, message: string, imageUrl: string): Promise<any> {
    return this.sendMessage(mobile, message, 'Image', imageUrl);
  }

  /**
   * Sends an OTP via WhatsApp
   */
  async sendOTP(mobile: string, otpCode: string): Promise<any> {
    const message = `Your DocsUniverse verification code is: *${otpCode}*\n\nThis code will expire in 10 minutes.\n\nDo not share this code with anyone.`;
    return this.sendText(mobile, message);
  }

  /**
   * Sends course enrollment notification
   */
  async sendCourseEnrollmentNotification(mobile: string, courseName: string): Promise<any> {
    const message = `🎓 *Course Enrollment Confirmed*\n\nYou have successfully enrolled in:\n*${courseName}*\n\nStart learning now on DocsUniverse!`;
    return this.sendText(mobile, message);
  }

  /**
   * Sends quiz completion notification with certificate
   */
  async sendQuizCertificateNotification(mobile: string, quizName: string, score: number): Promise<any> {
    const message = `🏆 *Quiz Completed!*\n\nCongratulations! You scored *${score}%* on:\n*${quizName}*\n\nYour certificate is ready to download on DocsUniverse.`;
    return this.sendText(mobile, message);
  }

  /**
   * Sends masterclass booking confirmation
   */
  async sendMasterclassBookingNotification(mobile: string, masterclassName: string, scheduledAt: string): Promise<any> {
    const message = `📅 *Masterclass Booking Confirmed*\n\n*${masterclassName}*\n\nScheduled: ${scheduledAt}\n\nJoin via DocsUniverse at the scheduled time.`;
    return this.sendText(mobile, message);
  }

  /**
   * Sends research service update notification
   */
  async sendResearchServiceNotification(mobile: string, serviceName: string, status: string): Promise<any> {
    const message = `🔬 *Research Service Update*\n\nYour request for *${serviceName}* is now:\n*${status}*\n\nCheck DocsUniverse for details.`;
    return this.sendText(mobile, message);
  }

  /**
   * Private helper to handle the API request to BigTos
   */
  private async sendMessage(mobile: string, message: string, type: 'Text' | 'Image', imageUrl?: string): Promise<any> {
    // In development without API key, just log and return success
    if (!this.apiKey && process.env.NODE_ENV === 'development') {
      console.log(`[DEV] WhatsApp message to ${mobile}: ${message}`);
      await this.logMessage(mobile, message, imageUrl, type, 'Development mode - not sent', 'success');
      return { status: 'success', dev_mode: true };
    }

    const formData = new URLSearchParams({
      key: this.apiKey,
      mobileno: mobile,
      msg: message,
      type: type,
    });

    if (type === 'Image' && imageUrl) {
      formData.append('File', imageUrl);
    }

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      const responseText = await response.text();
      let responseData: any;
      
      try {
        responseData = JSON.parse(responseText);
      } catch {
        responseData = { raw: responseText };
      }

      // Check if BigTos API returned success
      // BigTos typically returns { status: 'success' } or similar on success
      const isSuccess = response.ok && (
        responseData.status === 'success' || 
        responseData.success === true ||
        responseData.status === 'sent'
      );

      // Log the message to database with correct status
      await this.logMessage(
        mobile, 
        message, 
        imageUrl, 
        type, 
        JSON.stringify(responseData), 
        isSuccess ? 'success' : 'failed'
      );

      if (!isSuccess) {
        throw new Error(`BigTos API failed: ${JSON.stringify(responseData)}`);
      }

      return responseData;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('BigTos API Error:', errorMessage);

      // Log the failed message to database
      await this.logMessage(mobile, message, imageUrl, type, errorMessage, 'failed');

      throw error;
    }
  }

  /**
   * Logs the message transaction to the database
   */
  private async logMessage(
    mobile: string,
    message: string,
    imageUrl: string | undefined,
    type: string,
    apiResponse: string,
    status: 'success' | 'failed'
  ): Promise<void> {
    try {
      await db.insert(bigtosMessages).values({
        mobile,
        message,
        imageUrl: imageUrl || null,
        type,
        apiResponse,
        status,
      });
    } catch (error) {
      console.error('Failed to log BigTos message:', error);
    }
  }
}

// Export singleton instance
export const bigtosService = new BigtosService();
