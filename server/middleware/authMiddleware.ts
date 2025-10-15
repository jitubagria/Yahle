// JWT Auth Middleware
export function authMiddleware(req, res, next) {
  // ...verify JWT
  next();
}
