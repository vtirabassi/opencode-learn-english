"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { defaultAppData, defaultSettings } from "@/lib/storage";
import { mergeWordsWithReviews, splitWordsAndReviews } from "@/lib/userDataMapper";
import {
  getNote,
  getReviews,
  getSettings,
  getWords,
  saveNote,
  saveReviews,
  saveSettings,
  saveWords,
} from "@/services/userDataApi";
import { createInitialReview, updateReviewState } from "@/lib/spacedRepetition";
import type {
  AppData,
  Example,
  ExampleSource,
  ExampleTone,
  Locale,
  ReviewRating,
  Settings,
  StudyNote,
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
  const [data, setData] = useState<AppData>(defaultAppData);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    const loadRemoteData = async () => {
      try {
        const [settings, words, note, reviews] = await Promise.all([
          getSettings(),
          getWords(),
          getNote(),
          getReviews(),
        ]);

        if (!mounted) return;

        setData({
          settings: {
            ...defaultSettings,
            ...settings,
          },
          words: mergeWordsWithReviews(words, reviews),
          note,
        });
      } catch (error) {
        if (mounted) {
          console.error("Failed to load remote user data.", error);
          setData(defaultAppData);
        }
      } finally {
        if (mounted) {
          setReady(true);
        }
      }
    };

    loadRemoteData();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;

    const syncRemoteData = async () => {
      try {
        const split = splitWordsAndReviews(data.words);
        await Promise.all([
          saveSettings(data.settings),
          saveWords(split.words),
          saveNote(data.note),
          saveReviews(split.reviews),
        ]);
      } catch (error) {
        console.error("Failed to persist remote user data.", error);
      }
    };

    void syncRemoteData();
  }, [data, ready]);

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

  const updateStudyNote = useCallback((next: Pick<StudyNote, "title" | "markdown">) => {
    setData((prev) => ({
      ...prev,
      note: {
        ...prev.note,
        title: next.title,
        markdown: next.markdown,
        updatedAt: new Date().toISOString(),
      },
    }));
  }, []);

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
      updateStudyNote,
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
      updateStudyNote,
    ],
  );

  return value;
};
