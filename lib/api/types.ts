/**
 * The wire shape of the Devinso API (`Devinso.Api`), mirrored by hand.
 *
 * Every translatable value arrives in both languages at once — `fullName`
 * beside `fullNameFa` — so the language toggle switches without a refetch. A
 * null Persian value means "not translated yet"; fall back to the English one
 * (see `pickLanguage` in `lib/api/localize.ts`).
 *
 * Enums cross the wire as their names, not numbers.
 */

export type ApiAvailability = "Available" | "Limited" | "Unavailable";
export type ApiAccent = "Crimson" | "Violet" | "Ice";
export type ApiProjectType = "Personal" | "Team";
export type ApiSkillLevel = "Beginner" | "Intermediate" | "Advanced" | "Expert";
export type ApiProjectRole =
  | "Developer"
  | "Designer"
  | "Analyst"
  | "ProjectManager"
  | "QA"
  | "Creator"
  | "Lead"
  | "Strategy"
  | "Contributor";

export type ApiBlockType = "heading" | "text" | "image" | "quote" | "video" | "embed";

// ---------------------------------------------------------------- site -----

export type ApiSiteSettings = {
  identity: { name?: string; description?: string; logoUrl?: string };
  contact: { email?: string; phone?: string; address?: string };
  social: {
    instagram?: string;
    linkedIn?: string;
    gitHub?: string;
    telegram?: string;
    whatsApp?: string;
  };
  hero: { headline?: string; subtext?: string; footerText?: string };
  palette: Array<{ name: string; color: string }>;
};

// -------------------------------------------------------------- members ----

export type ApiLocalizedText = { text: string; textFa?: string };

export type ApiMemberSummary = {
  id: string;
  /** Null on a member saved before the column existed; address them by id. */
  username?: string;
  fullName: string;
  fullNameFa?: string;
  role: string;
  roleFa?: string;
  avatarUrl?: string;
  availability: ApiAvailability;
  accent: ApiAccent;
  focus: ApiLocalizedText[];
  /** ISO date the member joined; the registry shows the year. */
  createdAt: string;
};

export type ApiMemberProfile = ApiMemberSummary & {
  bio?: string;
  bioFa?: string;
  about?: string;
  aboutFa?: string;
  location?: string;
  locationFa?: string;
  skills: ApiNamedLevel[];
  languages: ApiNamedLevel[];
  tools: ApiNamedCategory[];
  experiences: ApiExperience[];
  education: ApiEducation[];
  socialLinks: Array<{ platform: string; url: string }>;
  projects: ApiMemberProject[];
};

export type ApiNamedLevel = { name: string; level: ApiSkillLevel };
export type ApiNamedCategory = { name: string; category?: string };

export type ApiExperience = {
  id: string;
  company: string;
  position: string;
  positionFa?: string;
  description?: string;
  descriptionFa?: string;
  /** ISO date string. */
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
};

export type ApiEducation = {
  id: string;
  institution: string;
  degree: string;
  degreeFa?: string;
  field?: string;
  fieldFa?: string;
  description?: string;
  descriptionFa?: string;
  startDate: string;
  endDate?: string;
};

/** A project on a member's profile, with what that member did on it. */
export type ApiMemberProject = {
  id: string;
  title: string;
  titleFa?: string;
  slug: string;
  description?: string;
  descriptionFa?: string;
  type: ApiProjectType;
  isFeatured: boolean;
  coverImageUrl?: string;
  projectUrl?: string;
  repositoryUrl?: string;
  techStack: ApiNamedCategory[];
  membership: { role?: ApiProjectRole; roleFa?: string };
  createdAt: string;
};

// ------------------------------------------------------------- projects ----

export type ApiProjectSummary = {
  id: string;
  slug: string;
  title: string;
  titleFa?: string;
  type: ApiProjectType;
  isFeatured: boolean;
  memberCount: number;
  coverImageUrl?: string;
  createdAt: string;
};

export type ApiProjectDetail = ApiProjectSummary & {
  description?: string;
  descriptionFa?: string;
  projectUrl?: string;
  repositoryUrl?: string;
  updatedAt?: string;
  techStack: ApiNamedCategory[];
  members: ApiProjectMember[];
  content: ApiContentBlock[];
  media: ApiProjectMedia[];
};

export type ApiProjectMember = {
  memberId: string;
  username?: string;
  fullName: string;
  fullNameFa?: string;
  /** Role on this project. */
  role?: ApiProjectRole;
  /** The member's own job title. */
  jobTitle?: string;
  avatarUrl?: string;
};

/**
 * One box of a project description. `type` is the discriminator: heading and
 * text carry `text`, image carries `imageUrl`, video and embed carry `url`.
 */
export type ApiContentBlock = {
  id: string;
  type: ApiBlockType;
  text?: string;
  textFa?: string;
  imageUrl?: string;
  url?: string;
  caption?: string;
  captionFa?: string;
  order: number;
};

export type ApiProjectMedia = {
  id: string;
  url: string;
  mediaType: string;
  title?: string;
  altText?: string;
  altTextFa?: string;
  displayOrder: number;
};

// ------------------------------------------------------------- openings ----

export type ApiOpeningSummary = {
  id: string;
  title: string;
  createdAt: string;
};

export type ApiOpeningDetail = ApiOpeningSummary & {
  description: string;
  contactEmail?: string;
  contactNumber?: string;
};

// --------------------------------------------------------------- writes ----

export type ProjectRequestSubmission = {
  clientName: string;
  clientEmail: string;
  clientNumber?: string;
  /** What the client is asking for, e.g. "Web application". */
  serviceType: string;
  description?: string;
};

export type JoinApplicationSubmission = {
  fullName: string;
  email: string;
  phoneNumber?: string;
  coverLetter?: string;
};

/** Both write endpoints answer 202 with the new id. */
export type SubmissionAccepted = { id: string };
