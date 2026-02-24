"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/Button";
import { HighlightedSentence } from "@/components/HighlightedSentence";
import { getDuePracticeItems } from "@/lib/spacedRepetition";
import { useAppStoreContext } from "@/store/AppStoreProvider";
import { useTranslations } from "@/store/useTranslations";
import { speak } from "@/services/tts";

export default function PracticePage() {
  const { data, updateExampleReview } = useAppStoreContext();
  const { t, locale } = useTranslations();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTranslationOverride, setShowTranslationOverride] =
    useState<boolean | null>(null);

  const items = useMemo(
    () => getDuePracticeItems(data.words, 12),
    [data.words],
  );

  const activeIndex = Math.min(currentIndex, Math.max(items.length - 1, 0));
  const current = items.length > 0 ? items[activeIndex] : undefined;
  const showTranslation =
    showTranslationOverride ?? data.settings.showTranslationsByDefault;

  const handleRating = (rating: "known" | "almost" | "not") => {
    if (!current) return;
    updateExampleReview(current.wordId, current.example.id, rating);
    const nextItems = items.filter((item) => item.example.id !== current.example.id);
    const nextIndex = Math.min(activeIndex, Math.max(nextItems.length - 1, 0));
    setShowTranslationOverride(null);
    setCurrentIndex(nextIndex);
  };

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-12">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            {t("practiceSubtitle")}
          </p>
          <h2 className="text-3xl font-semibold text-slate-900">{t("practiceTitle")}</h2>
        </div>

        {current ? (
          <section className="grid gap-6 rounded-3xl border border-slate-200/70 bg-[color:var(--surface)] p-8 shadow-[0_30px_60px_-40px_rgba(30,30,30,0.4)]">
            <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-slate-500">
              <span>
                 {t("practiceProgress")}: {activeIndex + 1}/{items.length}
              </span>
              <span>
                {t("practiceNextReview")}: {" "}
                {new Date(current.example.review.nextReviewAt).toLocaleDateString(
                  locale,
                )}
              </span>
              <span>
                {t("practiceSource")}: {" "}
                {current.example.source === "ai" ? t("sourceAi") : t("sourceManual")}
              </span>
            </div>
            <div className="rounded-2xl border border-amber-200/80 bg-amber-50/60 p-6 text-lg text-slate-800">
              <HighlightedSentence
                sentence={current.example.sentence}
                word={current.wordTerm}
              />
            </div>
            {showTranslation && (current.example.translation || current.wordTranslation) && (
              <div className="rounded-2xl border border-slate-200/80 bg-white px-6 py-4 text-sm text-slate-600">
                {current.example.translation || current.wordTranslation}
              </div>
            )}
            <div className="flex flex-wrap gap-3">
              <Button
                variant="secondary"
                onClick={() =>
                  setShowTranslationOverride(
                    (prev) => !(prev ?? data.settings.showTranslationsByDefault),
                  )
                }
              >
                {showTranslation ? t("practiceHide") : t("practiceReveal")}
              </Button>
              <Button
                variant="ghost"
                onClick={() => speak(current.wordTerm, locale)}
              >
                {t("practiceListenWord")}
              </Button>
              <Button
                variant="ghost"
                onClick={() => speak(current.example.sentence, locale)}
              >
                {t("practiceListenSentence")}
              </Button>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => handleRating("known")}>{t("practiceKnown")}</Button>
              <Button variant="secondary" onClick={() => handleRating("almost")}>
                {t("practiceAlmost")}
              </Button>
              <Button variant="ghost" onClick={() => handleRating("not")}>
                {t("practiceNot")}
              </Button>
            </div>
          </section>
        ) : (
          <section className="rounded-3xl border border-slate-200/70 bg-[color:var(--surface)] p-10 text-center shadow-[0_30px_60px_-40px_rgba(30,30,30,0.4)]">
            <h3 className="text-2xl font-semibold text-slate-900">
              {t("practiceDoneTitle")}
            </h3>
            <p className="mt-3 text-slate-600">{t("practiceDoneSubtitle")}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Link href="/words">
                <Button>{t("ctaAddWord")}</Button>
              </Link>
              <Link href="/">
                <Button variant="secondary">{t("ctaPractice")}</Button>
              </Link>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
