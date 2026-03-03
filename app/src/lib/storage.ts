import type { AppData, Settings, StudyNote } from "@/lib/types";

export const defaultSettings: Settings = {
  locale: "en-US",
  dailyGoalMinutes: 15,
  showTranslationsByDefault: false,
};

const nowIso = () => new Date().toISOString();

export const defaultStudyNote: StudyNote = {
  title: "Study Journal",
  markdown: "",
  updatedAt: nowIso(),
};

export const defaultAppData: AppData = {
  words: [],
  settings: defaultSettings,
  note: defaultStudyNote,
};
