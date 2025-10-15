import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

export function requireJwt(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing Bearer token" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = verifyToken(token);
    if ((decoded as any).type !== "access") throw new Error("Invalid token type");
    (req as any).user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
