// server/messenger.ts
// Simple abstraction for sending notifications via WhatsApp (Bigtos) or email
// Uses lazy require to avoid heavy deps at import time

function tryLoadBigtos() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require('./lib/bigtosService');
  } catch (_) {
    return null;
  }
}

function tryLoadMailer() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require('./lib/mailer');
  } catch (_) {
    return null;
  }
}

const bigtos = tryLoadBigtos();
const mailer = tryLoadMailer();

export async function sendWhatsApp(phone: string, message: string, opts?: any) {
  if (bigtos && typeof bigtos.sendMessage === 'function') return bigtos.sendMessage(phone, message, opts);
  // fallback: no-op
  return null;
}

export async function sendEmail(to: string, subject: string, html: string) {
  if (mailer && typeof mailer.send === 'function') return mailer.send({ to, subject, html });
  return null;
}

export default { sendWhatsApp, sendEmail };
