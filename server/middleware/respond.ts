// Unified Response Formatter Middleware
export function respond(req, res, next) {
  res.success = (data, message = 'OK') => res.json({ success: true, message, data });
  res.fail = (message = 'Error', code = 400) => res.status(code).json({ success: false, message });
  next();
}
