export const QUIZ_STATUS = {
  DRAFT: 'draft',
  ACTIVE: 'active',
  ARCHIVED: 'archived',
} as const;

export type QuizStatus = typeof QUIZ_STATUS[keyof typeof QUIZ_STATUS];

// Add other enums here as needed (COURSE_ACCESS, etc.)

export const APPROVAL_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

export type ApprovalStatus = typeof APPROVAL_STATUS[keyof typeof APPROVAL_STATUS];

export const VISIBILITY = {
  PUBLIC: 'public',
  PRIVATE: 'private',
} as const;

export type Visibility = typeof VISIBILITY[keyof typeof VISIBILITY];

