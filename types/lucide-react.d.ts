/**
 * Type declarations for lucide-react, which ships none.
 *
 * The package's own package.json points `typings` at `dist/lucide-react.d.ts`,
 * but no such file is in the published tarball — verified by reinstalling
 * 1.31.0 — and there is no `@types/lucide-react` on the registry. Without this
 * file every icon import is an implicit any and `next build` fails its type
 * check, while `next dev` (which does not type check) works fine.
 *
 * Icons are declared explicitly rather than through a blanket
 * `declare module "lucide-react"`, so icon props are still checked. Importing
 * an icon that is not listed below fails with "has no exported member" — add it
 * here. Delete this file once the package ships its own types.
 */
declare module "lucide-react" {
  import type { ComponentType, SVGProps } from "react";

  export type LucideProps = SVGProps<SVGSVGElement> & {
    size?: string | number;
    absoluteStrokeWidth?: boolean;
  };

  export type LucideIcon = ComponentType<LucideProps>;

  export const ArrowLeft: LucideIcon;
  export const ArrowUpRight: LucideIcon;
  export const CalendarDays: LucideIcon;
  export const Code: LucideIcon;
  export const Command: LucideIcon;
  export const FileText: LucideIcon;
  export const Globe: LucideIcon;
  export const GraduationCap: LucideIcon;
  export const Languages: LucideIcon;
  export const MapPin: LucideIcon;
  export const Moon: LucideIcon;
  export const Phone: LucideIcon;
  export const Sun: LucideIcon;
  export const UserRound: LucideIcon;
  export const UsersRound: LucideIcon;
  export const Wrench: LucideIcon;
}
