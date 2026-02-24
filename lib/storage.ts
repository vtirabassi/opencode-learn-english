import type { AppData, Settings } from "@/lib/types";

const STORAGE_KEY = "opencode.learnEnglish.v1";

export const defaultSettings: Settings = {
  locale: "en-US",
  dailyGoalMinutes: 15,
  showTranslationsByDefault: false,
};

export const defaultAppData: AppData = {
  words: [],
  settings: defaultSettings,
};

const isBrowser = typeof window !== "undefined";

export const loadAppData = (): AppData => {
  if (!isBrowser) return defaultAppData;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return defaultAppData;
  try {
    const parsed = JSON.parse(raw) as AppData;
    return {
      words: parsed.words ?? [],
      settings: {
        ...defaultSettings,
        ...(parsed.settings ?? {}),
      },
    };
  } catch {
    return defaultAppData;
  }
};

export const saveAppData = (data: AppData) => {
  if (!isBrowser) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const updateSettings = (data: AppData, nextSettings: Settings): AppData => ({
  ...data,
  settings: nextSettings,
});
