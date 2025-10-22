export const AdmissionApplicationLogTypeEnum = {
  SUBMITTED: 'submitted',
  CANCELLED: 'cancelled',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  ACCEPTED: 'accepted',
} as const;

export type AdmissionApplicationLogType =
  (typeof AdmissionApplicationLogTypeEnum)[keyof typeof AdmissionApplicationLogTypeEnum];
