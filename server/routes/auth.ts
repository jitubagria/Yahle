// server/routes/auth.ts
import { Router } from "express";
import { eq, desc } from "drizzle-orm";
import { db } from "../db";
import { users, otps } from "../../drizzle/schema";
import { bigtosService } from "../bigtos";
import { userSessions } from "../../drizzle/schema";
import { addHours } from "date-fns";
import { and } from "drizzle-orm";
import {
  signAccessToken,
  signRefreshToken,
  verifyToken,
} from "../utils/jwt";
import { requireJwt } from "../middleware/authJwt";

const router = Router();
const OTP_TTL_MIN = 5;

// Utility: generate random 6-digit OTP
const genOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

/**
 * POST /auth/send-otp
 * Creates or updates a user record, stores OTP, and sends via BigTos WhatsApp API.
 */
router.post("/auth/send-otp", async (req, res, next) => {
  try {
    const { mobile } = req.body as { mobile: string };
    if (!mobile) return res.status(400).json({ error: "mobile required" });

    const otp = genOtp();
    const expiresAt = new Date(Date.now() + OTP_TTL_MIN * 60_000);

    // Ensure user exists (phone column)
    await db.insert(users).values({ phone: mobile }).onDuplicateKeyUpdate({ set: { phone: mobile } as any });

    // Save OTP (phone column)
    await db.insert(otps).values({ phone: mobile, otp, expiresAt });

    // Send via unified BigTos service
    await bigtosService.sendText(
      mobile,
      `Your Yahle login OTP is ${otp}. It will expire in ${OTP_TTL_MIN} minutes.`
    );

    res.json({ ok: true });
  } catch (err) {
    console.error("[Auth] send-otp error:", err);
    next(err);
  }
});

/**
 * POST /auth/verify-otp
 * Confirms OTP validity and sets session userId.
 */
router.post("/auth/verify-otp", async (req, res, next) => {
  try {
    const { mobile, otp } = req.body as { mobile: string; otp: string };
    if (!mobile || !otp) return res.status(400).json({ error: "mobile & otp required" });

    const [latest] = await db
      .select()
      .from(otps)
      .where(eq(otps.mobile, mobile))
      .orderBy(desc(otps.id));

    if (!latest || latest.otp !== otp || !latest.expiresAt || latest.expiresAt < new Date()) {
      return res.status(401).json({ error: "Invalid or expired OTP" });
    }

    const [user] = await db.select().from(users).where(eq(users.mobile, mobile));
    if (!user) return res.status(404).json({ error: "User not found" });

    // Create session for web clients
    if (req.session) req.session.userId = user.id;

    // Issue JWTs for API/mobile clients
    const accessToken = signAccessToken({ id: user.id, mobile: user.mobile });
    const refreshToken = signRefreshToken({ id: user.id, mobile: user.mobile });

    // Save refresh token record (DB)
    await db.insert(userSessions).values({
      userId: user.id,
      refreshToken,
      device: (req.headers["user-agent"] as string) ?? "unknown",
      ip: req.ip ?? "",
      expiresAt: addHours(new Date(), 24 * 30),
    });

    // set cookie for web, also return for mobile
    res.cookie("yah_refresh", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.json({ ok: true, userId: user.id, accessToken, refreshToken });
  } catch (err) {
    console.error("[Auth] verify-otp error:", err);
    next(err);
  }
});

/**
 * GET /auth/me
 * Returns user info for authenticated API clients (JWT) or web session users
 */
router.get("/auth/me", requireJwt, async (req, res) => {
  try {
    // prefer JWT user
    const jwtUser = (req as any).user;
    if (jwtUser) {
      const [user] = await db.select().from(users).where(eq(users.id, jwtUser.id));
      return res.json({ ok: true, user });
    }

    // fallback: session
    if (req.session && req.session.userId) {
      const [user] = await db.select().from(users).where(eq(users.id, req.session.userId));
      return res.json({ ok: true, user });
    }

    res.status(401).json({ error: "Not authenticated" });
  } catch (err) {
    console.error("[Auth] /auth/me error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

/** Refresh token → new access token */
router.post("/auth/refresh-token", async (req, res) => {
  try {
    const token = req.cookies?.["yah_refresh"] || req.body?.refreshToken || req.headers["x-refresh-token"];
    if (!token) return res.status(401).json({ error: "Refresh token missing" });

    // validate against DB
    const sessionRows = await db
      .select()
      .from(userSessions)
      .where(and(eq(userSessions.refreshToken, token), eq(userSessions.isActive, true)));

    if (!sessionRows.length) return res.status(401).json({ error: "Refresh token revoked or invalid" });

    const decoded = verifyToken(token as string) as any;
    if (decoded.type !== "refresh") return res.status(401).json({ error: "Invalid token type" });

    const accessToken = signAccessToken({ id: decoded.id, mobile: decoded.mobile });
    res.json({ ok: true, accessToken });
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired refresh token" });
  }
});

/** Logout clears refresh cookie and session */
router.post("/auth/logout", (req, res) => {
  const token = req.cookies?.["yah_refresh"] || req.body?.refreshToken || req.headers["x-refresh-token"];
  if (token) {
    db.update(userSessions).set({ isActive: false }).where(eq(userSessions.refreshToken, token)).catch(() => {});
  }

  res.clearCookie("yah_refresh");
  if (req.session) req.session.destroy(() => {});
  res.json({ ok: true });
});

export default router;
