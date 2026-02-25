export const LOCALES = ["en-US", "pt-BR"] as const;

export type Locale = (typeof LOCALES)[number];

export type ReviewRating = "known" | "almost" | "not";

export type ExampleTone = "neutral" | "formal" | "informal";

export type ExampleSource = "manual" | "ai";

export type ReviewState = {
  stage: number;
  lastReviewedAt?: string;
  nextReviewAt: string;
  ease: number;
  streak: number;
};

export type Example = {
  id: string;
  sentence: string;
  translation?: string;
  tone: ExampleTone;
  source: ExampleSource;
  review: ReviewState;
};

export type Word = {
  id: string;
  term: string;
  translation?: string;
  partOfSpeech?: string;
  difficulty?: string;
  createdAt: string;
  examples: Example[];
};

export type Settings = {
  locale: Locale;
  dailyGoalMinutes: number;
  showTranslationsByDefault: boolean;
};

export type StudyNote = {
  title: string;
  markdown: string;
  updatedAt: string;
};

export type AppData = {
  words: Word[];
  settings: Settings;
  note: StudyNote;
};
