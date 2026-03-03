import type { Settings, StudyNote } from "@/lib/types";

export type RemoteSettings = Settings;

export type RemoteExample = {
  id: string;
  sentence: string;
  translation?: string;
  tone: "neutral" | "formal" | "informal";
  source: "manual" | "ai";
};

export type RemoteWord = {
  id: string;
  term: string;
  translation?: string;
  partOfSpeech?: string;
  difficulty?: string;
  createdAt: string;
  examples: RemoteExample[];
};

export type RemoteNote = StudyNote;

export type RemoteReviewState = {
  stage: number;
  lastReviewedAt?: string;
  nextReviewAt: string;
  ease: number;
  streak: number;
};

export type RemoteReviewItem = {
  wordId: string;
  exampleId: string;
  review: RemoteReviewState;
};
