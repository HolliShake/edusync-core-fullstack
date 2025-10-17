export const CurriculumStateEnum = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  ARCHIVED: 'archived',
} as const;

export type CurriculumStateEnum = (typeof CurriculumStateEnum)[keyof typeof CurriculumStateEnum];
