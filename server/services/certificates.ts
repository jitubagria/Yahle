import { Jimp } from 'jimp';
import { db } from "../db";
import { entityTemplates, certificates, users } from "../../shared/schema";
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

    // Parse text positions
    const positions: TextPositions = JSON.parse(template.textPositions);
    const textColor = template.textColor || '#000000';

    // Load background image
    const image = await Jimp.read(template.backgroundImage);

    // Load font - using built-in Jimp fonts for now
    // Map size to nearest Jimp font
    const getFontForSize = (size: number) => {
      if (size >= 64) return Jimp.FONT_SANS_64_BLACK;
      if (size >= 32) return Jimp.FONT_SANS_32_BLACK;
      if (size >= 16) return Jimp.FONT_SANS_16_BLACK;
      return Jimp.FONT_SANS_8_BLACK;
    };

    // Add text overlays
    if (positions.name && data.userName) {
      const font = await Jimp.loadFont(getFontForSize(positions.name.size));
      const maxWidth = image.bitmap.width - positions.name.x;
      image.print(
        font,
        positions.name.x,
        positions.name.y,
        {
          text: data.userName,
          alignmentX: positions.name.align === 'center' ? Jimp.HORIZONTAL_ALIGN_CENTER : Jimp.HORIZONTAL_ALIGN_LEFT,
        },
        maxWidth
      );
    }

    if (positions.title && data.title) {
      const font = await Jimp.loadFont(getFontForSize(positions.title.size));
      const maxWidth = image.bitmap.width - positions.title.x;
      image.print(
        font,
        positions.title.x,
        positions.title.y,
        {
          text: data.title,
          alignmentX: positions.title.align === 'center' ? Jimp.HORIZONTAL_ALIGN_CENTER : Jimp.HORIZONTAL_ALIGN_LEFT,
        },
        maxWidth
      );
    }

    if (positions.date) {
      const dateStr = data.completionDate || new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      const font = await Jimp.loadFont(getFontForSize(positions.date.size));
      const maxWidth = image.bitmap.width - positions.date.x;
      image.print(
        font,
        positions.date.x,
        positions.date.y,
        {
          text: dateStr,
          alignmentX: positions.date.align === 'center' ? Jimp.HORIZONTAL_ALIGN_CENTER : Jimp.HORIZONTAL_ALIGN_LEFT,
        },
        maxWidth
      );
    }

    if (positions.score && data.score) {
      const font = await Jimp.loadFont(getFontForSize(positions.score.size));
      const maxWidth = image.bitmap.width - positions.score.x;
      image.print(
        font,
        positions.score.x,
        positions.score.y,
        {
          text: `Score: ${data.score}`,
          alignmentX: positions.score.align === 'center' ? Jimp.HORIZONTAL_ALIGN_CENTER : Jimp.HORIZONTAL_ALIGN_LEFT,
        },
        maxWidth
      );
    }

    if (positions.rank && data.rank) {
      const font = await Jimp.loadFont(getFontForSize(positions.rank.size));
      const maxWidth = image.bitmap.width - positions.rank.x;
      image.print(
        font,
        positions.rank.x,
        positions.rank.y,
        {
          text: `Rank: ${data.rank}`,
          alignmentX: positions.rank.align === 'center' ? Jimp.HORIZONTAL_ALIGN_CENTER : Jimp.HORIZONTAL_ALIGN_LEFT,
        },
        maxWidth
      );
    }

    // Generate unique filename
    const filename = `certificate_${data.entityType}_${data.userId}_${Date.now()}.jpg`;
    
    // Convert to buffer
    const buffer = await image.getBufferAsync(Jimp.MIME_JPEG);
    
    // For now, convert buffer to base64 data URL (later can upload to cloud storage)
    const base64 = buffer.toString('base64');
    const outputUrl = `data:image/jpeg;base64,${base64}`;

    // Save certificate record
    const [cert] = await db.insert(certificates)
      .values({
        entityType: data.entityType,
        entityId: data.entityId,
        userId: data.userId,
        name: data.userName,
        title: data.title,
        score: data.score || null,
        rank: data.rank || null,
        backgroundImage: template.backgroundImage,
        outputUrl,
        sentStatus: false,
      })
      .returning();

    // Send via WhatsApp (placeholder - will integrate with BigTos API)
    const phoneNumber = await getUserPhone(data.userId);
    if (phoneNumber && process.env.BIGTOS_API_KEY) {
      const message = `🎓 Congratulations ${data.userName}! You've successfully completed ${data.title}. Your certificate is ready!`;
      
      try {
        // TODO: Integrate with BigTos WhatsApp API
        // await sendWhatsAppFile(phoneNumber, outputUrl, message);
        console.log(`WhatsApp certificate would be sent to ${phoneNumber}`);
        
        // Update sent status
        await db.update(certificates)
          .set({ sentStatus: true, sentAt: new Date() })
          .where(eq(certificates.id, cert.id));
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
