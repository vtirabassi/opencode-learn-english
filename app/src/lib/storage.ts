import type { AppData, Settings, StudyNote } from "@/lib/types";

const STORAGE_KEY = "opencode.learnEnglish.v1";

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

const isBrowser = typeof window !== "undefined";

export const loadAppData = (): AppData => {
  if (!isBrowser) return defaultAppData;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return defaultAppData;
  try {
    const parsed = JSON.parse(raw) as AppData;
    const parsedNote = parsed.note ?? defaultStudyNote;
    return {
      words: parsed.words ?? [],
      settings: {
        ...defaultSettings,
        ...(parsed.settings ?? {}),
      },
      note: {
        title: parsedNote.title ?? defaultStudyNote.title,
        markdown: parsedNote.markdown ?? defaultStudyNote.markdown,
        updatedAt: parsedNote.updatedAt ?? nowIso(),
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
