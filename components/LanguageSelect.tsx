"use client";

import { useId } from "react";
import { useAppStoreContext } from "@/store/AppStoreProvider";
import { useTranslations } from "@/store/useTranslations";

type LanguageSelectProps = {
  compact?: boolean;
};

export const LanguageSelect = ({ compact }: LanguageSelectProps) => {
  const { data, setLocale } = useAppStoreContext();
  const { t, locales } = useTranslations();
  const fieldId = useId();

  return (
    <label className="flex flex-col gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
      {!compact && <span>{t("languageLabel")}</span>}
      <select
        id={fieldId}
        className={`rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300 ${
          compact ? "min-w-[120px]" : "min-w-[200px]"
        }`}
        value={data.settings.locale}
        onChange={(event) => setLocale(event.target.value as typeof data.settings.locale)}
      >
        {locales.map((locale) => (
          <option key={locale} value={locale}>
            {locale}
          </option>
        ))}
      </select>
      {!compact && (
        <span className="text-[11px] font-normal uppercase tracking-[0.18em] text-slate-400">
          {t("languageHelper")}
        </span>
      )}
    </label>
  );
};
