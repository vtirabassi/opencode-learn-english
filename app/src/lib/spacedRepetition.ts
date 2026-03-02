import type { Example, ReviewRating, ReviewState, Word } from "@/lib/types";

const STAGES_IN_DAYS = [1, 3, 7, 14, 30];

const addDays = (date: Date, days: number) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

export const createInitialReview = (now: Date): ReviewState => ({
  stage: 0,
  lastReviewedAt: undefined,
  nextReviewAt: now.toISOString(),
  ease: 2.2,
  streak: 0,
});

export const updateReviewState = (
  state: ReviewState,
  rating: ReviewRating,
  now: Date,
): ReviewState => {
  if (rating === "known") {
    const nextStage = Math.min(state.stage + 1, STAGES_IN_DAYS.length - 1);
    return {
      ...state,
      stage: nextStage,
      lastReviewedAt: now.toISOString(),
      nextReviewAt: addDays(now, STAGES_IN_DAYS[nextStage]).toISOString(),
      ease: Math.min(state.ease + 0.08, 2.8),
      streak: state.streak + 1,
    };
  }

  if (rating === "almost") {
    const nextStage = Math.max(state.stage - 1, 0);
    return {
      ...state,
      stage: nextStage,
      lastReviewedAt: now.toISOString(),
      nextReviewAt: addDays(now, STAGES_IN_DAYS[nextStage]).toISOString(),
      ease: Math.max(state.ease - 0.08, 1.4),
      streak: 0,
    };
  }

  return {
    ...state,
    stage: 0,
    lastReviewedAt: now.toISOString(),
    nextReviewAt: addDays(now, STAGES_IN_DAYS[0]).toISOString(),
    ease: Math.max(state.ease - 0.2, 1.2),
    streak: 0,
  };
};

export type PracticeItem = {
  wordId: string;
  wordTerm: string;
  wordTranslation?: string;
  example: Example;
};

export const getDuePracticeItems = (
  words: Word[],
  limit = 12,
  now = new Date(),
): PracticeItem[] => {
  const due = words.flatMap((word) =>
    word.examples
      .filter((example) => new Date(example.review.nextReviewAt) <= now)
      .map((example) => ({
        wordId: word.id,
        wordTerm: word.term,
        wordTranslation: word.translation,
        example,
      })),
  );

  const upcoming = words.flatMap((word) =>
    word.examples.map((example) => ({
      wordId: word.id,
      wordTerm: word.term,
      wordTranslation: word.translation,
      example,
    })),
  );

  const sortedUpcoming = upcoming.sort(
    (a, b) =>
      new Date(a.example.review.nextReviewAt).getTime() -
      new Date(b.example.review.nextReviewAt).getTime(),
  );

  const pool = due.length > 0 ? due : sortedUpcoming;
  return pool.slice(0, limit);
};
