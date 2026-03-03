import { createInitialReview } from "@/lib/spacedRepetition";
import type { Word } from "@/lib/types";
import type {
  RemoteReviewItem,
  RemoteReviewState,
  RemoteWord,
} from "@/lib/userDataContracts";

const reviewKey = (wordId: string, exampleId: string) => `${wordId}:${exampleId}`;

const normalizeReview = (review: RemoteReviewState | undefined) => {
  if (!review) {
    return createInitialReview(new Date());
  }

  return {
    stage: review.stage,
    lastReviewedAt: review.lastReviewedAt,
    nextReviewAt: review.nextReviewAt,
    ease: review.ease,
    streak: review.streak,
  };
};

export const mergeWordsWithReviews = (
  words: RemoteWord[],
  reviews: RemoteReviewItem[],
): Word[] => {
  const reviewMap = new Map(reviews.map((item) => [reviewKey(item.wordId, item.exampleId), item.review]));

  return words.map((word) => ({
    ...word,
    examples: word.examples.map((example) => ({
      ...example,
      review: normalizeReview(reviewMap.get(reviewKey(word.id, example.id))),
    })),
  }));
};

export const splitWordsAndReviews = (words: Word[]) => {
  const remoteWords: RemoteWord[] = words.map((word) => ({
    id: word.id,
    term: word.term,
    translation: word.translation,
    partOfSpeech: word.partOfSpeech,
    difficulty: word.difficulty,
    createdAt: word.createdAt,
    examples: word.examples.map((example) => ({
      id: example.id,
      sentence: example.sentence,
      translation: example.translation,
      tone: example.tone,
      source: example.source,
    })),
  }));

  const reviews: RemoteReviewItem[] = words.flatMap((word) =>
    word.examples.map((example) => ({
      wordId: word.id,
      exampleId: example.id,
      review: {
        stage: example.review.stage,
        lastReviewedAt: example.review.lastReviewedAt,
        nextReviewAt: example.review.nextReviewAt,
        ease: example.review.ease,
        streak: example.review.streak,
      },
    })),
  );

  return {
    words: remoteWords,
    reviews,
  };
};
