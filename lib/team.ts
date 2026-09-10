// Roster for the home page members section.
//
// This is deliberately a lean projection — only what a roster card renders.
// The full profile behind an active member lives in `components/Profile/data.ts`
// (keyed by the same `username`, which is also the `/member/[username]` route
// segment), so that module stays the source of truth for profile content.
//
// Open slots are placeholders: no username, no focus areas, and the section
// renders them as vacant rather than as people. Fill one in by giving it a real
// name and title and pointing `username` at its profile record.

export type TeamAccent = "crimson" | "violet" | "ice";
export type TeamSlotStatus = "ACTIVE" | "OPEN";

export type TeamMember = {
  id: number;
  /** Two-digit slot label shown in the card chrome. */
  slot: string;
  /** Profile route segment, or null while the slot is unfilled. */
  username: string | null;
  fullName: string;
  fullNameFa: string;
  title: string;
  titleFa: string;
  focus: string[];
  focusFa: string[];
  avatar: string | null;
  accent: TeamAccent;
  status: TeamSlotStatus;
};

export const TEAM_ROSTER: TeamMember[] = [
  {
    id: 1,
    slot: "01",
    username: "arman-kian",
    fullName: "Arman Kian",
    fullNameFa: "آرمان کیان",
    title: "Creative Full-Stack Engineer",
    titleFa: "مهندس خلاق فول‌استک",
    focus: ["Interaction systems", "Realtime interfaces"],
    focusFa: ["سیستم‌های تعاملی", "رابط‌های بلادرنگ"],
    avatar: null,
    accent: "crimson",
    status: "ACTIVE",
  },
  {
    id: 2,
    slot: "02",
    username: null,
    fullName: "MEMBER 02",
    fullNameFa: "عضو ۰۲",
    title: "ROLE TBD",
    titleFa: "نقش تعیین‌نشده",
    focus: [],
    focusFa: [],
    avatar: null,
    accent: "violet",
    status: "OPEN",
  },
  {
    id: 3,
    slot: "03",
    username: null,
    fullName: "MEMBER 03",
    fullNameFa: "عضو ۰۳",
    title: "ROLE TBD",
    titleFa: "نقش تعیین‌نشده",
    focus: [],
    focusFa: [],
    avatar: null,
    accent: "ice",
    status: "OPEN",
  },
  {
    id: 4,
    slot: "04",
    username: null,
    fullName: "MEMBER 04",
    fullNameFa: "عضو ۰۴",
    title: "ROLE TBD",
    titleFa: "نقش تعیین‌نشده",
    focus: [],
    focusFa: [],
    avatar: null,
    accent: "violet",
    status: "OPEN",
  },
];

export function initialsOf(fullName: string) {
  return fullName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
