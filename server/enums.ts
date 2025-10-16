export const ApprovalStatus = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;
export type ApprovalStatus = (typeof ApprovalStatus)[keyof typeof ApprovalStatus];

export const PaymentStatus = {
  FREE: 'free',
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
} as const;
export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];

export const Visibility = {
  PUBLIC: 'public',
  PRIVATE: 'private',
} as const;
export type Visibility = (typeof Visibility)[keyof typeof Visibility];

export const RoleType = {
  DOCTOR: 'doctor',
  STUDENT: 'student',
  ADMIN: 'admin',
} as const;
export type RoleType = (typeof RoleType)[keyof typeof RoleType];

export const QuizStatus = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  ARCHIVED: 'archived',
} as const;
export type QuizStatus = (typeof QuizStatus)[keyof typeof QuizStatus];

export const QuizDifficulty = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
} as const;
export type QuizDifficulty = (typeof QuizDifficulty)[keyof typeof QuizDifficulty];

export const QuizType = {
  FREE: 'free',
  PRACTICE: 'practice',
  LIVE: 'live',
} as const;
export type QuizType = (typeof QuizType)[keyof typeof QuizType];

export const NPAStatus = {
  PENDING: 'pending',
  GENERATED: 'generated',
  SENT: 'sent',
  FAILED: 'failed',
} as const;
export type NPAStatus = (typeof NPAStatus)[keyof typeof NPAStatus];

export const ResearchRequestStatus = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;
export type ResearchRequestStatus = (typeof ResearchRequestStatus)[keyof typeof ResearchRequestStatus];

export const MedicalVoiceStatus = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  ARCHIVED: 'archived',
} as const;
export type MedicalVoiceStatus = (typeof MedicalVoiceStatus)[keyof typeof MedicalVoiceStatus];

export const ContentType = {
  VIDEO: 'video',
  PDF: 'pdf',
  TEXT: 'text',
  QUIZ: 'quiz',
} as const;
export type ContentType = (typeof ContentType)[keyof typeof ContentType];

export const QuizSessionStatus = {
  WAITING: 'waiting',
  RUNNING: 'running',
  COMPLETED: 'completed',
} as const;
export type QuizSessionStatus = (typeof QuizSessionStatus)[keyof typeof QuizSessionStatus];
