"use client";

import { LOCALES } from "@/lib/types";
import { getTranslations, type TranslationKey } from "@/lib/translations";
import { useAppStoreContext } from "@/store/AppStoreProvider";

export const useTranslations = () => {
  const { data } = useAppStoreContext();
  const dictionary = getTranslations(data.settings.locale);

  const t = (key: TranslationKey) => dictionary[key] ?? key;

  return {
    t,
    locale: data.settings.locale,
    locales: LOCALES,
  };
};
