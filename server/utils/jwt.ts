import jwt, { SignOptions, Secret, JwtPayload } from "jsonwebtoken";

const JWT_SECRET: Secret = process.env.JWT_SECRET as Secret;
if (!JWT_SECRET) throw new Error("JWT_SECRET missing in .env");

export function signAccessToken(payload: object, expiresIn = "7d") {
  const opts: SignOptions = { expiresIn: expiresIn as any };
  return jwt.sign({ ...payload, type: "access" } as any, JWT_SECRET, opts);
}

export function signRefreshToken(payload: object, expiresIn = "30d") {
  const opts: SignOptions = { expiresIn: expiresIn as any };
  return jwt.sign({ ...payload, type: "refresh" } as any, JWT_SECRET, opts);
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}

// Convenience helper for tests: generate a short-lived access token
export function generateToken(payload: object) {
  return signAccessToken(payload, '1h');
}
