export const RequirementTypeEnum = {
  ADMISSION: 'admission',
  GRADUATION: 'graduation',
  ENROLLMENT: 'enrollment',
  SCHOLARSHIP: 'scholarship',
  TRANSFER: 'transfer',
  GENERAL: 'general',
} as const;

export type RequirementTypeEnum = (typeof RequirementTypeEnum)[keyof typeof RequirementTypeEnum];

export const RequirementTypeLabels: Record<RequirementTypeEnum, string> = {
  [RequirementTypeEnum.ADMISSION]: 'Admission',
  [RequirementTypeEnum.GRADUATION]: 'Graduation',
  [RequirementTypeEnum.ENROLLMENT]: 'Enrollment',
  [RequirementTypeEnum.SCHOLARSHIP]: 'Scholarship',
  [RequirementTypeEnum.TRANSFER]: 'Transfer',
  [RequirementTypeEnum.GENERAL]: 'General',
};
