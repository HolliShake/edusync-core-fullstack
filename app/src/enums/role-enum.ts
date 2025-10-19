export const UserRoleEnum = {
  ADMIN: 'admin',
  PROGRAM_CHAIR: 'program-chair',
  COLLEGE_DEAN: 'college-dean',
  SPECIALIZATION_CHAIR: 'specialization-chair',
  CAMPUS_SCHEDULER: 'campus-scheduler',
  CAMPUS_REGISTRAR: 'campus-registrar',
  STUDENT: 'student',
  FACULTY: 'faculty',
  GUEST: 'guest',
} as const;

export type UserRole = (typeof UserRoleEnum)[keyof typeof UserRoleEnum];
