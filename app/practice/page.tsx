"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/Button";
import { HighlightedSentence } from "@/components/HighlightedSentence";
import { getDuePracticeItems } from "@/lib/spacedRepetition";
import { useAppStoreContext } from "@/store/AppStoreProvider";
import { useTranslations } from "@/store/useTranslations";
import { speak } from "@/services/tts";

const formatRemainingTime = (totalSeconds: number) => {
  const safeSeconds = Math.max(totalSeconds, 0);
  const minutes = Math.floor(safeSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (safeSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
};

export default function PracticePage() {
  const { data, updateExampleReview } = useAppStoreContext();
  const { t, locale } = useTranslations();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showTranslationOverride, setShowTranslationOverride] =
    useState<boolean | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(
    data.settings.dailyGoalMinutes * 60,
  );
  const [isTimerRunning, setIsTimerRunning] = useState(true);

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

  useEffect(() => {
    const timeout = setTimeout(() => setIsHydrated(true), 0);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!isHydrated || !isTimerRunning || remainingSeconds <= 0) return;
    const interval = window.setInterval(() => {
      setRemainingSeconds((prev) => Math.max(prev - 1, 0));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [isHydrated, isTimerRunning, remainingSeconds]);

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

        {!isHydrated ? (
          <section className="rounded-3xl border border-slate-200/70 bg-[color:var(--surface)] p-8 shadow-[0_30px_60px_-40px_rgba(30,30,30,0.4)]">
            <p className="text-sm text-slate-600">{t("loadingData")}</p>
          </section>
        ) : current ? (
          <section className="grid gap-6 rounded-3xl border border-slate-200/70 bg-[color:var(--surface)] p-8 shadow-[0_30px_60px_-40px_rgba(30,30,30,0.4)]">
            <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white px-5 py-4">
              <span className="text-sm font-medium text-slate-600">{t("practiceTimer")}</span>
              <div className="ml-auto flex flex-wrap items-center gap-3">
                <Button
                  className="border border-red-300 bg-red-100 text-slate-900 hover:border-red-400 hover:bg-red-200 hover:text-slate-900"
                  variant="secondary"
                  disabled={!isTimerRunning || remainingSeconds <= 0}
                  onClick={() => setIsTimerRunning(false)}
                >
                  {t("practiceTimerStop")}
                </Button>
                <Button
                  className="border-green-300 bg-green-100 text-slate-900 hover:border-green-400 hover:bg-green-200 hover:text-slate-900"
                  variant="secondary"
                  disabled={isTimerRunning || remainingSeconds <= 0}
                  onClick={() => setIsTimerRunning(true)}
                >
                  {t("practiceTimerResume")}
                </Button>
                <div className="text-right">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    {remainingSeconds === 0
                      ? t("practiceTimeUp")
                      : isTimerRunning
                        ? t("practiceTimeLeft")
                        : t("practiceTimerPaused")}
                  </p>
                  <p className="text-2xl font-semibold text-slate-900">
                    {formatRemainingTime(remainingSeconds)}
                  </p>
                </div>
              </div>
            </div>
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
