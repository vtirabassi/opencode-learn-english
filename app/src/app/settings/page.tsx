"use client";

import { useEffect, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { LanguageSelect } from "@/components/LanguageSelect";
import { useAppStoreContext } from "@/store/AppStoreProvider";
import { useTranslations } from "@/store/useTranslations";

export default function SettingsPage() {
  const { data, setDailyGoalMinutes, setShowTranslationsByDefault } = useAppStoreContext();
  const { t } = useTranslations();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsHydrated(true), 0);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-12">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            {t("settingsSubtitle")}
          </p>
          <h2 className="text-3xl font-semibold text-slate-900">{t("settingsTitle")}</h2>
        </div>

        {isHydrated ? (
          <section className="grid gap-6 rounded-3xl border border-slate-200/70 bg-[color:var(--surface)] p-8 shadow-[0_30px_60px_-40px_rgba(30,30,30,0.4)]">
            <LanguageSelect />
            <label className="text-sm font-semibold text-slate-700">
              {t("settingsDailyGoal")}
              <input
                type="number"
                min={5}
                max={60}
                value={data.settings.dailyGoalMinutes}
                onChange={(event) => {
                  const next = Number(event.target.value);
                  if (!Number.isNaN(next)) {
                    setDailyGoalMinutes(next);
                  }
                }}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
              />
            </label>
            <label className="flex items-center gap-3 text-sm font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={data.settings.showTranslationsByDefault}
                onChange={(event) => setShowTranslationsByDefault(event.target.checked)}
              />
              {t("settingsShowTranslations")}
            </label>
            <p className="text-sm text-slate-500">{t("settingsLocalData")}</p>
          </section>
        ) : (
          <section className="rounded-3xl border border-slate-200/70 bg-[color:var(--surface)] p-8 shadow-[0_30px_60px_-40px_rgba(30,30,30,0.4)]">
            <p className="text-sm text-slate-600">{t("loadingData")}</p>
          </section>
        )}
      </main>
    </div>
  );
}
