export const EnrollmentLogActionEnum = {
  enroll: 'enroll',
  program_chair_approved: 'program_chair_approved',
  registrar_approved: 'registrar_approved',
  program_chair_dropped_approved: 'program_chair_dropped_approved',
  registrar_dropped_approved: 'registrar_dropped_approved',
  dropped: 'dropped',
  rejected: 'rejected',
} as const;

export type EnrollmentLogAction =
  (typeof EnrollmentLogActionEnum)[keyof typeof EnrollmentLogActionEnum];
