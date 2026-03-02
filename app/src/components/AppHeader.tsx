"use client";

import Link from "next/link";
import { useTranslations } from "@/store/useTranslations";
import { LanguageSelect } from "@/components/LanguageSelect";

export const AppHeader = () => {
  const { t } = useTranslations();

  return (
    <header className="flex flex-col gap-4 border-b border-slate-200/70 px-6 py-6 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{t("tagline")}</p>
        <Link className="text-2xl font-semibold text-slate-900" href="/">
          {t("appName")}
        </Link>
      </div>
      <nav className="flex flex-wrap items-center gap-4 text-sm font-semibold text-slate-700">
        <Link className="hover:text-slate-900" href="/practice">
          {t("navPractice")}
        </Link>
        <Link className="hover:text-slate-900" href="/words">
          {t("navWords")}
        </Link>
        <Link className="hover:text-slate-900" href="/notes">
          {t("navNotes")}
        </Link>
        <Link className="hover:text-slate-900" href="/settings">
          {t("navSettings")}
        </Link>
        <LanguageSelect compact />
      </nav>
    </header>
  );
};
