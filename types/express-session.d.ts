import "express-session";
import "express";

declare module "express-session" {
  interface SessionData {
    userId?: number;
    email?: string;
    role?: string;
  }
}

declare global {
  namespace Express {
    interface Request {
      // express-session attaches this
      session: import("express-session").Session & Partial<import("express-session").SessionData>;
    }
  }
}
