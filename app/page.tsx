"use client";

import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/Button";
import { LanguageSelect } from "@/components/LanguageSelect";
import { useTranslations } from "@/store/useTranslations";

export default function Home() {
  const { t } = useTranslations();

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 py-16">
        <section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
              {t("tagline")}
            </p>
            <h2 className="text-4xl font-semibold text-slate-900 sm:text-5xl">
              {t("heroTitle")}
            </h2>
            <p className="max-w-xl text-lg leading-8 text-slate-600">
              {t("heroSubtitle")}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/practice">
                <Button>{t("ctaPractice")}</Button>
              </Link>
              <Link href="/words">
                <Button variant="secondary">{t("ctaAddWord")}</Button>
              </Link>
            </div>
          </div>
          <div className="rounded-3xl border border-amber-200/80 bg-white/70 p-8 shadow-[0_20px_60px_-30px_rgba(46,34,18,0.45)]">
            <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
              {t("languageLabel")}
            </h3>
            <div className="mt-6">
              <LanguageSelect />
            </div>
            <p className="mt-6 text-sm text-slate-600">{t("languageHelper")}</p>
          </div>
        </section>

        <section className="grid gap-6 rounded-3xl border border-slate-200/70 bg-[color:var(--surface)] p-10 shadow-[0_30px_60px_-40px_rgba(30,30,30,0.4)]">
          <h3 className="text-2xl font-semibold text-slate-900">
            {t("landingFocusTitle")}
          </h3>
          <div className="grid gap-6 sm:grid-cols-3">
            {[t("landingFocus1"), t("landingFocus2"), t("landingFocus3")].map(
              (item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-slate-100 bg-[color:var(--surface-muted)] p-6 text-sm text-slate-600"
                >
                  {item}
                </div>
              ),
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
