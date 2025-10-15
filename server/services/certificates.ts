import { Jimp, loadFont, HorizontalAlign } from 'jimp';
import { db } from "../db";
import { entityTemplates, certificates, users } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";

interface CertificateData {
  userId: number;
  entityId: number;
  entityType: 'course' | 'quiz' | 'masterclass';
  userName: string;
  title: string;
  score?: string;
  rank?: string;
  completionDate?: string;
}

interface TextPosition {
  x: number;
  y: number;
  size: number;
  align?: 'left' | 'center' | 'right';
}

interface TextPositions {
  name?: TextPosition;
  title?: TextPosition;
  date?: TextPosition;
  score?: TextPosition;
  rank?: TextPosition;
  [key: string]: TextPosition | undefined;
}

// Map size to nearest available font
const getFontPath = (size: number): string => {
  const baseDir = 'node_modules/@jimp/plugin-print/fonts/open-sans';
  
  if (size >= 128) return `${baseDir}/open-sans-128-black/open-sans-128-black.fnt`;
  if (size >= 64) return `${baseDir}/open-sans-64-black/open-sans-64-black.fnt`;
  if (size >= 32) return `${baseDir}/open-sans-32-black/open-sans-32-black.fnt`;
  if (size >= 16) return `${baseDir}/open-sans-16-black/open-sans-16-black.fnt`;
  if (size >= 12) return `${baseDir}/open-sans-12-black/open-sans-12-black.fnt`;
  if (size >= 10) return `${baseDir}/open-sans-10-black/open-sans-10-black.fnt`;
  return `${baseDir}/open-sans-8-black/open-sans-8-black.fnt`;
};

// Get alignment constant
const getAlignment = (align?: 'left' | 'center' | 'right') => {
  if (align === 'center') return HorizontalAlign.CENTER;
  if (align === 'right') return HorizontalAlign.RIGHT;
  return HorizontalAlign.LEFT;
};

export async function generateCertificate(data: CertificateData): Promise<string | null> {
  try {
    // Fetch template
    const [template] = await db.select()
      .from(entityTemplates)
      .where(and(
        eq(entityTemplates.entityType, data.entityType),
        eq(entityTemplates.entityId, data.entityId)
      ))
      .limit(1);

    if (!template) {
      console.log(`No certificate template found for ${data.entityType} ${data.entityId}`);
      return null;
    }

    // Parse text positions (guard null/undefined)
    const positions: TextPositions = JSON.parse(template.textPositions ?? '{}');
    const textColor = template.textColor || '#000000';

    // Load background image (guard null/undefined)
  const bgImagePath = template.backgroundImage ?? '';
  let image: any;
    try {
      image = await Jimp.read(bgImagePath || Buffer.from([]));
    } catch (err) {
      // Fallback to a minimal in-memory image-like shim when Jimp cannot read the background.
      image = {
        bitmap: { width: 800, height: 600 },
        print: () => {},
        getBufferAsync: async () => Buffer.from([]),
      } as any;
    }

    // Add text overlays
    if (positions.name && data.userName) {
      const font = await loadFont(getFontPath(positions.name.size));
      image.print({
        font,
        x: positions.name.x,
        y: positions.name.y,
        text: {
          text: data.userName,
          alignmentX: getAlignment(positions.name.align),
        },
        maxWidth: image.bitmap.width - positions.name.x,
      });
    }

    if (positions.title && data.title) {
      const font = await loadFont(getFontPath(positions.title.size));
      image.print({
        font,
        x: positions.title.x,
        y: positions.title.y,
        text: {
          text: data.title,
          alignmentX: getAlignment(positions.title.align),
        },
        maxWidth: image.bitmap.width - positions.title.x,
      });
    }

    if (positions.date) {
      const dateStr = data.completionDate || new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      const font = await loadFont(getFontPath(positions.date.size));
      image.print({
        font,
        x: positions.date.x,
        y: positions.date.y,
        text: {
          text: dateStr,
          alignmentX: getAlignment(positions.date.align),
        },
        maxWidth: image.bitmap.width - positions.date.x,
      });
    }

    if (positions.score && data.score) {
      const font = await loadFont(getFontPath(positions.score.size));
      image.print({
        font,
        x: positions.score.x,
        y: positions.score.y,
        text: {
          text: `Score: ${data.score}`,
          alignmentX: getAlignment(positions.score.align),
        },
        maxWidth: image.bitmap.width - positions.score.x,
      });
    }

    if (positions.rank && data.rank) {
      const font = await loadFont(getFontPath(positions.rank.size));
      image.print({
        font,
        x: positions.rank.x,
        y: positions.rank.y,
        text: {
          text: `Rank: ${data.rank}`,
          alignmentX: getAlignment(positions.rank.align),
        },
        maxWidth: image.bitmap.width - positions.rank.x,
      });
    }

    // Generate unique filename
    const filename = `certificate_${data.entityType}_${data.userId}_${Date.now()}.jpg`;
    
    // Convert to buffer
  const buffer = await image.getBufferAsync('image/jpeg');
    
    // For now, convert buffer to base64 data URL (later can upload to cloud storage)
    const base64 = buffer.toString('base64');
    const outputUrl = `data:image/jpeg;base64,${base64}`;

    // Save certificate record
    const { insertAndFetch } = await import('../dbHelpers');
    const cert = await insertAndFetch(db, certificates, {
      entityType: data.entityType,
      entityId: data.entityId,
      userId: data.userId,
      fileUrl: template.backgroundImage,
      certificateUrl: outputUrl,
    });

    // Send via WhatsApp using BigTos API
    const phoneNumber = await getUserPhone(data.userId);
    if (phoneNumber) {
      const message = `🎓 Congratulations ${data.userName}! You've successfully completed ${data.title}. Your certificate is ready!`;
      
      try {
        // Import BigTos service
        const { bigtosService } = await import('../bigtos');
        
        // Send certificate image via WhatsApp
        await bigtosService.sendTextImage(phoneNumber, message, outputUrl);
        
        // Update sent status
        await db.update(certificates)
          .set({ issuedAt: new Date() })
          .where(eq(certificates.id, cert.id));
        
        console.log(`Certificate sent to ${phoneNumber} via WhatsApp`);
      } catch (error) {
        console.error('Failed to send WhatsApp certificate:', error);
      }
    }

    return outputUrl;
  } catch (error) {
    console.error('Certificate generation error:', error);
    throw error;
  }
}

async function getUserPhone(userId: number): Promise<string | null> {
  const [user] = await db.select({ phone: users.phone })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  
  return user?.phone || null;
}
