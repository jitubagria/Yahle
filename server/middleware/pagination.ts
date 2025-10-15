// Pagination Middleware
export function pagination(req, res, next) {
  req.limit = Number(req.query.limit) || 20;
  req.offset = Number(req.query.offset) || 0;
  next();
}
