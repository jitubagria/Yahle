import { Router } from "express";
const router = Router();

router.get("/", (req, res) => {
  res.json({
    message: "Auth API working",
    endpoints: ["/send-otp", "/verify-otp", "/me", "/refresh-token", "/logout"]
  });
});

export default router;
