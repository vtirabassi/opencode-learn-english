"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  defaultAppData,
  defaultSettings,
  loadAppData,
  saveAppData,
} from "@/lib/storage";
import { createInitialReview, updateReviewState } from "@/lib/spacedRepetition";
import type {
  AppData,
  Example,
  ExampleSource,
  ExampleTone,
  Locale,
  ReviewRating,
  Settings,
  Word,
} from "@/lib/types";

type NewWordInput = {
  term: string;
  translation?: string;
  partOfSpeech?: string;
  difficulty?: string;
};

type NewExampleInput = {
  sentence: string;
  translation?: string;
  tone: ExampleTone;
  source: ExampleSource;
};

const createId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2, 11);

const buildExample = (input: NewExampleInput): Example => {
  const now = new Date();
  return {
    id: createId(),
    sentence: input.sentence.trim(),
    translation: input.translation?.trim() || undefined,
    tone: input.tone,
    source: input.source,
    review: createInitialReview(now),
  };
};

export const useAppStore = () => {
  const [data, setData] = useState<AppData>(() =>
    typeof window === "undefined" ? defaultAppData : loadAppData(),
  );
  const [ready] = useState(() => typeof window !== "undefined");

  useEffect(() => {
    if (!ready) return;
    saveAppData(data);
  }, [data, ready]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handler = (event: StorageEvent) => {
      if (event.key === "opencode.learnEnglish.v1") {
        setData(loadAppData());
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const setSettings = useCallback((next: Settings) => {
    setData((prev) => ({ ...prev, settings: next }));
  }, []);

  const setLocale = useCallback(
    (locale: Locale) => {
      setSettings({ ...data.settings, locale });
    },
    [data.settings, setSettings],
  );

  const setDailyGoalMinutes = useCallback(
    (minutes: number) => {
      setSettings({ ...data.settings, dailyGoalMinutes: minutes });
    },
    [data.settings, setSettings],
  );

  const setShowTranslationsByDefault = useCallback(
    (value: boolean) => {
      setSettings({ ...data.settings, showTranslationsByDefault: value });
    },
    [data.settings, setSettings],
  );

  const addWord = useCallback(
    (wordInput: NewWordInput, exampleInput?: NewExampleInput) => {
      const term = wordInput.term.trim();
      if (!term) return;
      setData((prev) => {
        const existingIndex = prev.words.findIndex(
          (item) => item.term.toLowerCase() === term.toLowerCase(),
        );
        const example = exampleInput ? buildExample(exampleInput) : undefined;

        if (existingIndex >= 0) {
          const updated = [...prev.words];
          const existing = updated[existingIndex];
          updated[existingIndex] = {
            ...existing,
            translation: wordInput.translation || existing.translation,
            partOfSpeech: wordInput.partOfSpeech || existing.partOfSpeech,
            difficulty: wordInput.difficulty || existing.difficulty,
            examples: example ? [...existing.examples, example] : existing.examples,
          };
          return { ...prev, words: updated };
        }

        const newWord: Word = {
          id: createId(),
          term,
          translation: wordInput.translation?.trim() || undefined,
          partOfSpeech: wordInput.partOfSpeech?.trim() || undefined,
          difficulty: wordInput.difficulty?.trim() || undefined,
          createdAt: new Date().toISOString(),
          examples: example ? [example] : [],
        };
        return { ...prev, words: [newWord, ...prev.words] };
      });
    },
    [],
  );

  const addExampleToWord = useCallback((wordId: string, input: NewExampleInput) => {
    setData((prev) => ({
      ...prev,
      words: prev.words.map((word) =>
        word.id === wordId
          ? { ...word, examples: [...word.examples, buildExample(input)] }
          : word,
      ),
    }));
  }, []);

  const updateExampleReview = useCallback(
    (wordId: string, exampleId: string, rating: ReviewRating) => {
      setData((prev) => ({
        ...prev,
        words: prev.words.map((word) => {
          if (word.id !== wordId) return word;
          return {
            ...word,
            examples: word.examples.map((example) =>
              example.id === exampleId
                ? {
                    ...example,
                    review: updateReviewState(example.review, rating, new Date()),
                  }
                : example,
            ),
          };
        }),
      }));
    },
    [],
  );

  const value = useMemo(
    () => ({
      data,
      ready,
      setLocale,
      setDailyGoalMinutes,
      setShowTranslationsByDefault,
      addWord,
      addExampleToWord,
      updateExampleReview,
      reset: () => setData({ ...defaultAppData, settings: defaultSettings }),
    }),
    [
      data,
      ready,
      setLocale,
      setDailyGoalMinutes,
      setShowTranslationsByDefault,
      addWord,
      addExampleToWord,
      updateExampleReview,
    ],
  );

  return value;
};
