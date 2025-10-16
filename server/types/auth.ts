export interface JwtPayload {
  userId?: number;
  mobileno: string;
  iat?: number;
  exp?: number;
}

export interface InsertOtp {
  phone: string;
  otp: string;
  expiresAt: string; // ISO
}

export default {};
