import type { AppData, Settings } from "@/lib/types";

export const defaultSettings: Settings = {
  locale: "en-US",
  dailyGoalMinutes: 15,
  showTranslationsByDefault: false,
};

export const defaultAppData: AppData = {
  words: [],
  settings: defaultSettings,
  notes: [],
};
