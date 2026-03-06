"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { defaultAppData, defaultSettings } from "@/lib/storage";
import { mergeWordsWithReviews, splitWordsAndReviews } from "@/lib/userDataMapper";
import { getCurrentUser, login, logout, register, type AuthUser } from "@/services/authApi";
import { UnauthorizedApiError } from "@/services/apiClient";
import { getAccessToken } from "@/services/authSession";
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
  const [authStatus, setAuthStatus] = useState<
    "loading" | "authenticated" | "unauthenticated"
  >("loading");
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);

  const loadRemoteData = useCallback(async () => {
    const [settings, words, note, reviews] = await Promise.all([
      getSettings(),
      getWords(),
      getNote(),
      getReviews(),
    ]);

    setData({
      settings: {
        ...defaultSettings,
        ...settings,
      },
      words: mergeWordsWithReviews(words, reviews),
      note,
    });
  }, []);

  useEffect(() => {
    let mounted = true;

    const bootstrap = async () => {
      try {
        const token = getAccessToken();
        if (!token) {
          if (mounted) {
            setAuthStatus("unauthenticated");
            setReady(true);
          }
          return;
        }

        const user = await getCurrentUser();
        if (!mounted) return;

        setAuthUser(user);
        setAuthStatus("authenticated");
        await loadRemoteData();
      } catch (error) {
        if (!mounted) return;

        if (error instanceof UnauthorizedApiError) {
          setData(defaultAppData);
          setAuthUser(null);
          setAuthStatus("unauthenticated");
        } else {
          console.error("Failed to load remote user data.", error);
        }
      } finally {
        if (mounted) {
          setReady(true);
        }
      }
    };

    void bootstrap();

    return () => {
      mounted = false;
    };
  }, [loadRemoteData]);

  useEffect(() => {
    if (!ready || authStatus !== "authenticated") return;

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
        if (error instanceof UnauthorizedApiError) {
          setAuthUser(null);
          setAuthStatus("unauthenticated");
          setData(defaultAppData);
          return;
        }
        console.error("Failed to persist remote user data.", error);
      }
    };

    void syncRemoteData();
  }, [authStatus, data, ready]);

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

  const updateWord = useCallback(
    (
      wordId: string,
      changes: Partial<Pick<Word, "term" | "translation" | "partOfSpeech" | "difficulty">>,
      exampleChanges?: { id: string; sentence: string; translation?: string }[],
    ) => {
      setData((prev) => ({
        ...prev,
        words: prev.words.map((word) => {
          if (word.id !== wordId) return word;
          let updated = { ...word, ...changes };
          if (exampleChanges) {
            updated = {
              ...updated,
              examples: updated.examples.map((ex) => {
                const change = exampleChanges.find((c) => c.id === ex.id);
                if (!change) return ex;
                return {
                  ...ex,
                  sentence: change.sentence,
                  translation: change.translation,
                };
              }),
            };
          }
          return updated;
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

  const registerWithEmail = useCallback(
    async (email: string, password: string) => {
      const user = await register({ email, password });
      setAuthUser(user);
      setAuthStatus("authenticated");
      await loadRemoteData();
      setReady(true);
    },
    [loadRemoteData],
  );

  const loginWithEmail = useCallback(
    async (email: string, password: string) => {
      const user = await login({ email, password });
      setAuthUser(user);
      setAuthStatus("authenticated");
      await loadRemoteData();
      setReady(true);
    },
    [loadRemoteData],
  );

  const logoutUser = useCallback(async () => {
    await logout();
    setAuthUser(null);
    setAuthStatus("unauthenticated");
    setData(defaultAppData);
    setReady(true);
  }, []);

  const value = useMemo(
    () => ({
      data,
      ready,
      authStatus,
      authUser,
      setLocale,
      setDailyGoalMinutes,
      setShowTranslationsByDefault,
      addWord,
      addExampleToWord,
      updateWord,
      updateExampleReview,
      updateStudyNote,
      loginWithEmail,
      registerWithEmail,
      logoutUser,
      reset: () => setData({ ...defaultAppData, settings: defaultSettings }),
    }),
    [
      data,
      ready,
      authStatus,
      authUser,
      setLocale,
      setDailyGoalMinutes,
      setShowTranslationsByDefault,
      addWord,
      addExampleToWord,
      updateWord,
      updateExampleReview,
      updateStudyNote,
      loginWithEmail,
      registerWithEmail,
      logoutUser,
    ],
  );

  return value;
};
