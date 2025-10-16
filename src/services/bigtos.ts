// src/services/bigtos.ts
import fetch from "node-fetch";
import logger from '../../server/lib/logger';
import type { IBigtosService, IBigtosSendOptions } from "../../types/bigtos";

const BASE_URL = "https://www.cp.bigtos.com/api/v1";
const API_KEY = process.env.BIGTOS_KEY;

// Development-friendly behavior: if BIGTOS_KEY is missing in non-production,
// provide a no-op stubbed service so the server can run without external keys.
const IS_PROD_BIGTOS = Boolean(API_KEY && process.env.NODE_ENV === 'production');

// Sleep helper for throttling
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export type MessageType = "Text" | "Image" | "File" | "Template";
export type BigtosSendOptions = IBigtosSendOptions;

/** Generic POST helper with error handling */
async function post(endpoint: string, body: Record<string, any>) {
  try {
    const res = await fetch(`${BASE_URL}/${endpoint}`, {
      method: "POST",
      body: new URLSearchParams(body as any),
    });
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      return { raw: text };
    }
  } catch (err: any) {
    logger.error({ err, message: err.message }, '[BigTos] Network error');
    throw err;
  }
}

/** Core unified send */
export async function sendBigtosMessage(opts: BigtosSendOptions) {
  const {
    mobileno,
    msg,
    type = "Text",
    file,
    templateJson,
    throttleMs = 120_000,
  } = opts;

  const numbers = Array.isArray(mobileno) ? mobileno : [mobileno];

  // Bulk trigger: >20 numbers in a batch
  if (numbers.length > 20) {
    logger.info(`[BigTos] Bulk mode for ${numbers.length} numbers`);
    const body: any = {
      key: API_KEY,
      mobileno: numbers.join(","),
      msg,
      type: type === "Template" ? "Text" : type, // Bulk API doesn’t support Template
      messageType: "regular",
    };
    if (file) body.File = file;
    return post("send-bulk-messages", body);
  }

  // Otherwise sequential with throttling
  const results: any[] = [];
  for (let i = 0; i < numbers.length; i++) {
    const n = numbers[i];
    logger.info(`[BigTos] Sending ${type} to ${n}`);

    let payload: any = { key: API_KEY, mobileno: n, msg, type };
    if (file) payload.File = file;
    if (type === "Template" && templateJson)
      payload = {
        key: API_KEY,
        mobileno: n,
        msg: JSON.stringify(templateJson),
        type: "Template",
      };

    const r = await post("sendmessage", payload);
    results.push(r);

    // Wait 120 s between messages (except last)
    if (i < numbers.length - 1) await delay(throttleMs);
  }
  return results;
}

/** Named helpers */
export const bigtosService: IBigtosService = IS_PROD_BIGTOS
  ? {
      async sendMessage(opts) {
        // adapt to existing sendBigtosMessage logic
        return sendBigtosMessage({
          mobileno: opts.mobileno,
          msg: opts.msg,
          type: (opts.type as MessageType) || undefined,
          file: opts.file,
          templateJson: opts.templateJson,
          throttleMs: opts.throttleMs,
        } as BigtosSendOptions);
      },

      async sendText(mobileno: string | string[], msg: string) {
        return sendBigtosMessage({ type: "Text", mobileno, msg });
      },
      async sendOTP(mobileno: string, otpCode: string) {
        // keep the same friendly message format used elsewhere
        return sendBigtosMessage({ type: "Text", mobileno, msg: `Your DocsUniverse verification code is: *${otpCode}*` });
      },

      async sendImage(mobileno: string | string[], caption: string, fileUrl: string) {
        return sendBigtosMessage({ type: "Image", mobileno, msg: caption, file: fileUrl });
      },

      async sendFile(mobileno: string | string[], caption: string, fileUrl: string) {
        return sendBigtosMessage({ type: "File", mobileno, msg: caption, file: fileUrl });
      },

      async sendTemplate(mobileno: string | string[], templateJson: object) {
        return sendBigtosMessage({ type: "Template", mobileno, msg: JSON.stringify(templateJson), templateJson });
      },

      // Admin/Utility endpoints
      async getHistory() {
        return (await fetch(`${BASE_URL}/history/${API_KEY}`)).json();
      },
      async getStatus() {
        return (await fetch(`${BASE_URL}/status/${API_KEY}`)).json();
      },
      async getCredit() {
        return post("credit", { key: API_KEY });
      },

      async getAccountInfo() {
        const [status, credit] = await Promise.all([
          // @ts-ignore runtime call
          fetch(`${BASE_URL}/status/${API_KEY}`).then((r) => r.json()),
          // @ts-ignore runtime call
          post("credit", { key: API_KEY }),
        ]);
        return { status, credit };
      },
      // legacy aliases implemented on the main service (call the core sender directly)
      async sendTextImage(mobileno: string | string[], msg: string, file?: string) {
        return sendBigtosMessage({ type: "Image", mobileno, msg, file: file });
      },
      async sendCourseEnrollmentNotification(mobileno: string, courseName: string) {
        return sendBigtosMessage({ type: "Text", mobileno, msg: `🎓 Course Enrollment Confirmed: ${courseName}` });
      },
      async sendQuizCertificateNotification(mobileno: string, quizName: string, score: number) {
        return sendBigtosMessage({ type: "Text", mobileno, msg: `🏆 Quiz Completed: ${quizName} — Score: ${score}%` });
      },
      async sendMasterclassBookingNotification(mobileno: string, masterclassName: string, scheduledAt: string) {
        return sendBigtosMessage({ type: "Text", mobileno, msg: `📅 Masterclass Booking Confirmed: ${masterclassName} at ${scheduledAt}` });
      },
      async sendResearchServiceNotification(mobileno: string, serviceName: string, status: string) {
        return sendBigtosMessage({ type: "Text", mobileno, msg: `🔬 Research Service Update: ${serviceName} — ${status}` });
      },
      async sendVoiceUpdate(mobileno: string, userName: string, voiceTitle: string, updateTitle: string) {
        return sendBigtosMessage({ type: "Text", mobileno, msg: `Update for ${voiceTitle}: ${updateTitle}` });
      },
    }
  : {
      // Dev stub: log and no-op
      async sendMessage(opts) {
        logger.info({ opts }, '[BigTos stub] sendMessage');
        return { stub: true };
      },
      async sendText(mobileno: string | string[], msg: string) {
        logger.info({ mobileno, msg }, '[BigTos stub] sendText');
        return { stub: true };
      },
      async sendOTP(mobileno: string, otpCode: string) {
        logger.info({ mobileno, otpCode }, '[BigTos stub] sendOTP');
        return { stub: true };
      },
      async sendImage() {
        return { stub: true };
      },
      async sendFile() {
        return { stub: true };
      },
      async sendTemplate() {
        return { stub: true };
      },
      async getHistory() {
        return { stub: true };
      },
      async getStatus() {
        return { stub: true };
      },
      async getCredit() {
        return { stub: true };
      },
      async getAccountInfo() {
        return { stub: true };
      },
      // legacy aliases present on the dev stub as well
      async sendTextImage(mobileno: string | string[], msg: string, file?: string) {
        logger.info({ mobileno, msg, file }, '[BigTos stub] sendTextImage');
        return { stub: true };
      },
      async sendCourseEnrollmentNotification(mobileno: string, courseName: string) {
        logger.info({ mobileno, courseName }, '[BigTos stub] sendCourseEnrollmentNotification');
        return { stub: true };
      },
      async sendQuizCertificateNotification(mobileno: string, quizName: string, score: number) {
        logger.info({ mobileno, quizName, score }, '[BigTos stub] sendQuizCertificateNotification');
        return { stub: true };
      },
      async sendMasterclassBookingNotification(mobileno: string, masterclassName: string, scheduledAt: string) {
        logger.info({ mobileno, masterclassName, scheduledAt }, '[BigTos stub] sendMasterclassBookingNotification');
        return { stub: true };
      },
      async sendResearchServiceNotification(mobileno: string, serviceName: string, status: string) {
        logger.info({ mobileno, serviceName, status }, '[BigTos stub] sendResearchServiceNotification');
        return { stub: true };
      },
      async sendVoiceUpdate(mobileno: string, userName: string, voiceTitle: string, updateTitle: string) {
        logger.info({ mobileno, userName, voiceTitle, updateTitle }, '[BigTos stub] sendVoiceUpdate');
        return { stub: true };
      },
    };

// --- Backwards-compatible aliases (older code expects these names) ---
export const bigtosServiceCompat: IBigtosService & Record<string, any> = {
  ...bigtosService,
  // older API names
  sendOTP: (mobileno: string, otpCode: string) =>
    Promise.resolve(bigtosService.sendText?.(mobileno, `Your DocsUniverse verification code is: *${otpCode}*`)),
  sendTextImage: (mobileno: string | string[], msg: string, file?: string) =>
    Promise.resolve(bigtosService.sendImage?.(mobileno, msg, file || "")),
  sendCourseEnrollmentNotification: (mobileno: string, courseName: string) =>
    Promise.resolve(bigtosService.sendText?.(mobileno, `🎓 Course Enrollment Confirmed: ${courseName}`)),
  sendQuizCertificateNotification: (mobileno: string, quizName: string, score: number) =>
    Promise.resolve(bigtosService.sendText?.(mobileno, `🏆 Quiz Completed: ${quizName} — Score: ${score}%`)),
  sendMasterclassBookingNotification: (mobileno: string, masterclassName: string, scheduledAt: string) =>
    Promise.resolve(bigtosService.sendText?.(mobileno, `📅 Masterclass Booking Confirmed: ${masterclassName} at ${scheduledAt}`)),
  sendResearchServiceNotification: (mobileno: string, serviceName: string, status: string) =>
    Promise.resolve(bigtosService.sendText?.(mobileno, `🔬 Research Service Update: ${serviceName} — ${status}`)),
  sendVoiceUpdate: (mobileno: string, userName: string, voiceTitle: string, updateTitle: string) =>
    Promise.resolve(bigtosService.sendText?.(mobileno, `Update for ${voiceTitle}: ${updateTitle}`)),
  getStatus: bigtosService.getStatus,
  getCredit: bigtosService.getCredit,
  getHistory: bigtosService.getHistory,
  getAccountInfo: bigtosService.getAccountInfo,
};

// default export remaining name used across repo
export default bigtosServiceCompat;

// Temporary compat alias used by older code that references `bigtos`
export const bigtos = bigtosServiceCompat; // TODO: migrate imports to named `bigtosService`
