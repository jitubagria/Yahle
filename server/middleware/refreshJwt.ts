import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { signAccessToken, verifyToken } from "../utils/jwt";
import { db } from "../db";
import { userSessions } from "../../drizzle/schema";
import { and, eq } from "drizzle-orm";

const REFRESH_COOKIE = "yah_refresh";
const JWT_SECRET = process.env.JWT_SECRET!;

/**
 * Auto-refresh JWT middleware
 * Checks access token first, if expired but refresh token is valid,
 * issues a new access token on-the-fly.
 */
export async function refreshJwt(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization as string | undefined;
  const refreshToken =
    (req.cookies && req.cookies[REFRESH_COOKIE]) ||
    (req.headers["x-refresh-token"] as string | undefined) ||
    (req.body && req.body.refreshToken);

  if (!authHeader?.startsWith("Bearer ")) {
    if (!refreshToken) return res.status(401).json({ error: "Missing tokens" });
    return tryRefresh(refreshToken as string, req, res, next);
  }

  const accessToken = authHeader.split(" ")[1];
  try {
    const decoded = verifyToken(accessToken) as any;
    if (decoded.type !== "access")
      throw new Error("Invalid token type (expected access)");
    (req as any).user = decoded;
    return next();
  } catch (err: any) {
    if (err.name === "TokenExpiredError" && refreshToken)
      return tryRefresh(refreshToken as string, req, res, next);
    return res.status(401).json({ error: "Unauthorized: " + err.message });
  }
}

/** Helper: try to refresh */
async function tryRefresh(
  refreshToken: string,
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // ensure token exists & active in DB
    const rows = await db
      .select()
      .from(userSessions)
      .where(and(eq(userSessions.refreshToken, refreshToken), eq(userSessions.isActive, 1)));

    if (!rows.length) return res.status(401).json({ error: "Refresh token revoked or invalid" });

    const decoded = jwt.verify(refreshToken, JWT_SECRET) as any;
    if (decoded.type !== "refresh") throw new Error("Invalid token type");

    const newAccess = signAccessToken({ id: decoded.id, mobile: decoded.mobile });

    // attach to request + optionally return in header
    (req as any).user = { id: decoded.id, mobile: decoded.mobile };
    res.setHeader("x-new-access-token", newAccess);

    // optional: mobile clients can read this header and update stored token
    return next();
  } catch (e) {
    return res.status(401).json({ error: "Invalid or expired refresh token" });
  }
}

export default refreshJwt;
