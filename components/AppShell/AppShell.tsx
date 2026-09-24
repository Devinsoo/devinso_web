"use client";

import { useEffect, useState } from "react";
import { Hero } from "@/components/Hero/Hero";
import type { TeamMember } from "@/lib/team";
import type { WorkProject } from "@/components/Work/SelectedWork";
import type { ApiSiteSettings } from "@/lib/api/types";
import type { DevinsoLanguage, DevinsoTheme } from "@/lib/preferences";

type AppShellProps = {
  /** Registry rows fetched on the server and handed to the members section. */
  members?: TeamMember[];
  /** Team projects fetched on the server and handed to the work rail. */
  work?: WorkProject[];
  /** Site-wide settings (contact, social, identity) used by the footer. */
  settings?: ApiSiteSettings | null;
  initialTheme?: DevinsoTheme;
  initialLanguage?: DevinsoLanguage;
};

function getSystemTheme(): DevinsoTheme {
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function getBrowserLanguage(): DevinsoLanguage {
  return window.navigator.language?.toLowerCase().startsWith("fa") ? "fa" : "en";
}

export function AppShell({ initialTheme, initialLanguage, members, work, settings }: AppShellProps) {
  const [theme, setTheme] = useState<DevinsoTheme>(initialTheme ?? "dark");
  const [language, setLanguage] = useState<DevinsoLanguage>(initialLanguage ?? "en");

  useEffect(() => {
    // No saved preference: fall back to what the browser already tells us.
    //
    // This deliberately runs after mount instead of during render. The server
    // cannot read matchMedia or navigator.language, so resolving it inline
    // would make the client's first render disagree with the server's markup
    // and blow up hydration. Seeding from the cookie and correcting once on
    // the client is the hydration-safe shape — which is precisely what
    // set-state-in-effect cannot distinguish from a cascading render.
    /* eslint-disable react-hooks/set-state-in-effect */
    const nextTheme = initialTheme ?? getSystemTheme();
    const nextLanguage = initialLanguage ?? getBrowserLanguage();
    setTheme(nextTheme);
    setLanguage(nextLanguage);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [initialLanguage, initialTheme]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  useEffect(() => {
    document.documentElement.dataset.language = language;
    document.documentElement.lang = language;
    document.documentElement.dir = "ltr";
  }, [language]);

  return (
    <Hero
      initialTheme={theme}
      initialLanguage={language}
      members={members}
      work={work}
      settings={settings}
    />
  );
}
