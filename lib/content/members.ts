import { fetchMember, fetchMembers } from "@/lib/api/devinso";
import type { ApiAccent, ApiMemberProfile, ApiMemberSummary, ApiSkillLevel } from "@/lib/api/types";
import { TEAM_ROSTER, type TeamAccent, type TeamAvailability, type TeamMember } from "@/lib/team";
import type { MemberProfileData, SkillLevel } from "@/components/Profile/types";
import { toMemberProjects } from "@/lib/content/projects";

/**
 * Maps the API onto the shapes the member UI already speaks, so the components
 * stay untouched and keep working when the API is down.
 */

const ACCENTS: Record<ApiAccent, TeamAccent> = {
  Crimson: "crimson",
  Violet: "violet",
  Ice: "ice",
};

const AVAILABILITY: Record<string, TeamAvailability> = {
  Available: "AVAILABLE",
  Limited: "LIMITED",
  Unavailable: "UNAVAILABLE",
};

const SKILL_LEVELS: Record<ApiSkillLevel, SkillLevel> = {
  Beginner: "BEGINNER",
  Intermediate: "INTERMEDIATE",
  Advanced: "ADVANCED",
  Expert: "EXPERT",
};

const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

function toPersianDigits(value: string) {
  return value.replace(/[0-9]/g, (digit) => PERSIAN_DIGITS[Number(digit)]);
}

function slot(index: number) {
  return String(index + 1).padStart(2, "0");
}

function year(iso: string) {
  const parsed = new Date(iso);
  return Number.isNaN(parsed.getTime()) ? null : String(parsed.getFullYear());
}

function toTeamMember(member: ApiMemberSummary, index: number): TeamMember {
  return {
    // Positional: the roster keys rows by their slot, not by database id.
    id: index + 1,
    slot: slot(index),
    username: member.username ?? null,
    fullName: member.fullName,
    fullNameFa: member.fullNameFa ?? member.fullName,
    title: member.role,
    titleFa: member.roleFa ?? member.role,
    focus: member.focus.map((item) => item.text),
    focusFa: member.focus.map((item) => item.textFa ?? item.text),
    avatar: member.avatarUrl ?? null,
    accent: ACCENTS[member.accent] ?? "crimson",
    status: "ACTIVE",
    availability: AVAILABILITY[member.availability] ?? "AVAILABLE",
    since: year(member.createdAt),
  };
}

/**
 * The registry: published members from the API, then the bundled roster's open
 * slots to fill out the console grid. Vacancies are a design element with no
 * database row behind them, so they stay in the bundled roster.
 *
 * Falls back to the bundled roster entirely when the API is unreachable.
 */
export async function loadRoster(): Promise<TeamMember[]> {
  const members = await fetchMembers();
  if (!members) return TEAM_ROSTER;

  const active = members.map(toTeamMember);
  const vacancies = TEAM_ROSTER.filter((row) => row.status === "OPEN");

  // Keep the console the same size it was designed at: fill the remaining
  // slots with vacancies, renumbered so the slot labels stay sequential.
  const openSlots = Math.max(TEAM_ROSTER.length - active.length, 0);

  const filled = vacancies.slice(0, openSlots).map((row, index) => {
    const position = active.length + index;
    const label = slot(position);

    // A vacancy is labelled by the slot it occupies, so renumbering has to
    // rewrite the name too — otherwise "MEMBER 02" sits in slot 03.
    return {
      ...row,
      id: position + 1,
      slot: label,
      fullName: `MEMBER ${label}`,
      fullNameFa: `عضو ${toPersianDigits(label)}`,
    };
  });

  return [...active, ...filled];
}

/**
 * Accent colour per member username. A project has no accent of its own, so a
 * project page tints itself with its lead member's colour.
 */
export async function loadAccentsByUsername(): Promise<Map<string, TeamAccent>> {
  const members = await fetchMembers();
  const accents = new Map<string, TeamAccent>();

  for (const member of members ?? []) {
    if (member.username) accents.set(member.username, ACCENTS[member.accent] ?? "crimson");
  }

  return accents;
}

function toProfileData(member: ApiMemberProfile): MemberProfileData {
  return {
    user: {
      // The public API exposes no account data, by design. What the header
      // renders is true of every profile it serves: a published team member.
      id: 1,
      role: "MEMBER",
      status: "ACTIVE",
      createdAt: member.createdAt,
    },

    profile: {
      id: 0,
      userId: 0,
      username: member.username ?? member.id,
      fullName: member.fullName,
      fullNameFa: member.fullNameFa,
      title: member.role,
      titleFa: member.roleFa,
      bio: member.bio ?? member.about ?? "",
      bioFa: member.bioFa ?? member.aboutFa,
      currentFocus: member.focus.map((item) => item.text),
      currentFocusFa: member.focus.map((item) => item.textFa ?? item.text),
      availability: AVAILABILITY[member.availability] ?? "AVAILABLE",
      avatar: member.avatarUrl,
      location: member.location,
      locationFa: member.locationFa,

      // Social links are a list server-side; the profile header reads three
      // named ones, so they are matched by platform and the rest ignored.
      github: socialLink(member, "github"),
      linkedin: socialLink(member, "linkedin"),
      website: socialLink(member, "website"),

      // No columns behind these yet: the header hides each when absent.
      // phone, resumeUrl and theme are deliberately left unset.
    },

    experiences: member.experiences.map((experience, index) => ({
      id: index + 1,
      company: experience.company,
      role: experience.position,
      roleFa: experience.positionFa,
      period: period(experience.startDate, experience.endDate, experience.isCurrent),
      description: experience.description ?? "",
      descriptionFa: experience.descriptionFa,
      current: experience.isCurrent,
    })),

    skills: member.skills.map((skill, index) => ({
      id: index + 1,
      level: SKILL_LEVELS[skill.level] ?? "INTERMEDIATE",
      skill: { id: index + 1, name: skill.name, category: "" },
    })),

    languages: member.languages.map((language, index) => ({
      id: index + 1,
      name: language.name,
      // The API grades languages on the skill scale; the UI's proficiency
      // scale is the nearest equivalent.
      proficiency:
        language.level === "Expert"
          ? "NATIVE"
          : language.level === "Advanced"
            ? "PROFESSIONAL"
            : language.level === "Intermediate"
              ? "CONVERSATIONAL"
              : "BASIC",
    })),

    tools: member.tools.map((tool, index) => ({
      id: index + 1,
      name: tool.name,
      category: tool.category ?? "",
    })),

    education: member.education.map((entry, index) => ({
      id: index + 1,
      institution: entry.institution,
      degree: entry.degree,
      degreeFa: entry.degreeFa,
      field: entry.field ?? "",
      fieldFa: entry.fieldFa,
      period: period(entry.startDate, entry.endDate, false),
    })),

    // No signals table yet; the panel renders empty rather than inventing rows.
    signals: [],

    projects: toMemberProjects(member.projects),
  };
}

function socialLink(member: ApiMemberProfile, platform: string) {
  return member.socialLinks.find((link) => link.platform.toLowerCase() === platform)?.url;
}

/** "2024 — NOW" / "2022 — 2024", which is how the UI renders a date range. */
function period(startDate: string, endDate: string | undefined, isCurrent: boolean) {
  const from = year(startDate) ?? "";
  if (isCurrent || !endDate) return `${from} — NOW`;
  return `${from} — ${year(endDate) ?? ""}`;
}

/**
 * A profile by username, or null when the member is unpublished, unknown, or
 * the API is down. The caller decides whether that means 404 or bundled
 * content.
 */
export async function loadMemberProfile(handle: string): Promise<MemberProfileData | null> {
  const member = await fetchMember(handle);
  return member ? toProfileData(member) : null;
}
