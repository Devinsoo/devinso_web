// Types mirror the Devinso ERD tables (users, member_profiles, skills,
// member_skills, projects, project_members) so the profile UI is a direct
// reflection of the schema rather than an invented shape.

export type UserRole = "ADMIN" | "MEMBER";
export type UserStatus = "ACTIVE" | "INACTIVE" | "BLOCKED";
export type SkillLevel = "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";
export type ProjectType = "PERSONAL" | "TEAM";
export type ProjectStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
export type AvailabilityStatus = "AVAILABLE" | "LIMITED" | "UNAVAILABLE";
export type LanguageProficiency = "NATIVE" | "PROFESSIONAL" | "CONVERSATIONAL" | "BASIC";

// users
export type MemberUser = {
  id: number;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string; // ISO date
};

// themes (only the slice a public profile needs)
export type MemberTheme = {
  id: number;
  name: string;
  slug: string;
};

// member_profiles
export type MemberProfileRecord = {
  id: number;
  userId: number;
  username: string;
  fullName: string;
  fullNameFa?: string;
  title: string;
  titleFa?: string;
  bio: string;
  bioFa?: string;
  currentFocus: string[];
  currentFocusFa?: string[];
  availability: AvailabilityStatus;
  resumeUrl?: string;
  avatar?: string;
  phone?: string;
  location?: string;
  locationFa?: string;
  linkedin?: string;
  github?: string;
  website?: string;
  theme?: MemberTheme;
};

export type MemberExperience = {
  id: number;
  company: string;
  role: string;
  roleFa?: string;
  period: string;
  periodFa?: string;
  description: string;
  descriptionFa?: string;
  current?: boolean;
};

export type SpokenLanguage = {
  id: number;
  name: string;
  nameFa?: string;
  proficiency: LanguageProficiency;
};

export type MemberTool = {
  id: number;
  name: string;
  category: string;
};

export type MemberEducation = {
  id: number;
  institution: string;
  institutionFa?: string;
  degree: string;
  degreeFa?: string;
  field: string;
  fieldFa?: string;
  period: string;
  periodFa?: string;
};

export type ProfileSignal = {
  id: number;
  label: string;
  labelFa?: string;
  value: string;
  valueFa?: string;
};

// skills
export type Skill = {
  id: number;
  name: string;
  category: string;
};

// member_skills (joined with skills)
export type MemberSkill = {
  id: number;
  level: SkillLevel;
  skill: Skill;
};

// projects (joined with the member's own project_members row)
export type MemberProject = {
  id: number;
  title: string;
  description: string;
  descriptionFa?: string;
  outcome?: string;
  outcomeFa?: string;
  featured?: boolean;
  coverImage?: string;
  projectUrl?: string;
  githubUrl?: string;
  techStack: string[];
  type: ProjectType;
  status: ProjectStatus;
  createdAt: string;
  membership: {
    role: string;
    roleFa?: string;
    joinedAt?: string;
  };
};

export type MemberProfileData = {
  user: MemberUser;
  profile: MemberProfileRecord;
  experiences: MemberExperience[];
  skills: MemberSkill[];
  languages: SpokenLanguage[];
  tools: MemberTool[];
  education: MemberEducation[];
  signals: ProfileSignal[];
  projects: MemberProject[];
};
