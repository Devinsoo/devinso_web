"use client";

import { useEffect, useState } from "react";
import { EntryGate } from "@/components/Entry/EntryGate";
import { Hero } from "@/components/Hero/Hero";
import type { TeamMember } from "@/lib/team";
import type { WorkProject } from "@/components/Work/SelectedWork";
import { markEntryComplete, savePreferences, type DevinsoLanguage, type DevinsoTheme } from "@/lib/preferences";

type Screen = "entry" | "site";

type AppShellProps = {
  /** Registry rows fetched on the server and handed to the members section. */
  members?: TeamMember[];
  /** Team projects fetched on the server and handed to the work rail. */
  work?: WorkProject[];
  initialEntryComplete: boolean;
  initialTheme?: DevinsoTheme;
  initialLanguage?: DevinsoLanguage;
};

function getSystemTheme(): DevinsoTheme {
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function getBrowserLanguage(): DevinsoLanguage {
  return window.navigator.language?.toLowerCase().startsWith("fa") ? "fa" : "en";
}

export function AppShell({ initialEntryComplete, initialTheme, initialLanguage, members, work }: AppShellProps) {
  const [screen, setScreen] = useState<Screen>(initialEntryComplete ? "site" : "entry");
  const [theme, setTheme] = useState<DevinsoTheme>(initialTheme ?? "dark");
  const [language, setLanguage] = useState<DevinsoLanguage>(initialLanguage ?? "en");

  useEffect(() => {
    const nextTheme = initialTheme ?? getSystemTheme();
    const nextLanguage = initialLanguage ?? getBrowserLanguage();
    setTheme(nextTheme);
    setLanguage(nextLanguage);
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

  const persistAndEnter = (nextTheme = theme, nextLanguage = language) => {
    savePreferences(nextTheme, nextLanguage);
    markEntryComplete();
    setScreen("site");
  };

  if (screen === "site") {
    return <Hero initialTheme={theme} initialLanguage={language} members={members} work={work} />;
  }

  return (
    <EntryGate
      theme={theme}
      language={language}
      onThemeChange={setTheme}
      onLanguageChange={setLanguage}
      onEnter={() => persistAndEnter()}
      onUseSystem={() => {
        const nextTheme = getSystemTheme();
        const nextLanguage = getBrowserLanguage();
        setTheme(nextTheme);
        setLanguage(nextLanguage);
        persistAndEnter(nextTheme, nextLanguage);
      }}
    />
  );
}
