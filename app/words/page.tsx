"use client";

import { useEffect, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/Button";
import { HighlightedSentence } from "@/components/HighlightedSentence";
import { useAppStoreContext } from "@/store/AppStoreProvider";
import { useTranslations } from "@/store/useTranslations";
import type { ExampleTone } from "@/lib/types";

type AiExample = {
  sentence: string;
  translation?: string | null;
  tone?: ExampleTone;
};

export default function WordsPage() {
  const { data, addWord } = useAppStoreContext();
  const { t } = useTranslations();
  const [mode, setMode] = useState<"manual" | "ai">("manual");
  const [term, setTerm] = useState("");
  const [translation, setTranslation] = useState("");
  const [partOfSpeech, setPartOfSpeech] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [exampleSentence, setExampleSentence] = useState("");
  const [exampleTranslation, setExampleTranslation] = useState("");
  const defaultTone: ExampleTone = "neutral";
  const [aiVariations, setAiVariations] = useState(2);
  const [aiIncludeTranslation, setAiIncludeTranslation] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiExamples, setAiExamples] = useState<AiExample[]>([]);
  const [saveNotice, setSaveNotice] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  const difficultyLabel = (value?: string) => {
    if (value === "easy") return t("difficultyEasy");
    if (value === "medium") return t("difficultyMedium");
    if (value === "hard") return t("difficultyHard");
    return value ?? "";
  };

  const handleModeChange = (nextMode: "manual" | "ai") => {
    setMode(nextMode);
    setAiError(null);
    if (nextMode === "manual") {
      setAiExamples([]);
    }
  };

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const resetForm = () => {
    setTerm("");
    setTranslation("");
    setPartOfSpeech("");
    setDifficulty("");
    setExampleSentence("");
    setExampleTranslation("");
    setAiExamples([]);
  };

  const canSave = term.trim().length > 0 && exampleSentence.trim().length > 0;

  const handleSaveWord = () => {
    if (!term.trim()) return;
    if (!exampleSentence.trim()) {
      setSaveError(t("exampleRequired"));
      return;
    }
    const example = exampleSentence.trim()
      ? {
          sentence: exampleSentence,
          translation: exampleTranslation || undefined,
          tone: defaultTone,
          source: "manual" as const,
        }
      : undefined;

    addWord(
      {
        term,
        translation,
        partOfSpeech,
        difficulty,
      },
      example,
    );
    setSaveError(null);
    setSaveNotice(t("wordSaved"));
    setTimeout(() => setSaveNotice(null), 2500);
    resetForm();
  };

  const handleGenerate = async () => {
    if (!term.trim()) return;
    setAiLoading(true);
    setAiError(null);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          word: term.trim(),
          tone: defaultTone,
          variations: aiVariations,
          includeTranslation: aiIncludeTranslation,
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Failed to generate examples.");
      }

      const payload = await response.json();
      setAiExamples(payload.examples ?? []);
    } catch (error) {
      setAiError(error instanceof Error ? error.message : "Unexpected error");
    } finally {
      setAiLoading(false);
    }
  };

  const handleUseExample = (example: AiExample) => {
    if (!term.trim()) return;
    addWord(
      {
        term,
        translation,
        partOfSpeech,
        difficulty,
      },
      {
        sentence: example.sentence,
        translation: example.translation || undefined,
        tone: example.tone ?? defaultTone,
        source: "ai" as const,
      },
    );
    setSaveError(null);
    setSaveNotice(t("wordSaved"));
    setTimeout(() => setSaveNotice(null), 2500);
  };

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-12">
        {saveNotice && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 shadow-[0_12px_25px_-20px_rgba(16,120,78,0.5)]">
            {saveNotice}
          </div>
        )}
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            {t("wordsSubtitle")}
          </p>
          <h2 className="text-3xl font-semibold text-slate-900">{t("wordsTitle")}</h2>
        </div>

        <section className="grid gap-6 rounded-3xl border border-slate-200/70 bg-[color:var(--surface)] p-8 shadow-[0_30px_60px_-40px_rgba(30,30,30,0.4)]">
          <div className="flex flex-wrap gap-4">
            <Button
              variant={mode === "manual" ? "primary" : "secondary"}
              onClick={() => handleModeChange("manual")}
            >
              {t("sourceManual")}
            </Button>
            <Button
              variant={mode === "ai" ? "primary" : "secondary"}
              onClick={() => handleModeChange("ai")}
            >
              {t("generateWithAi")}
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-semibold text-slate-700">
              {t("wordField")}
              <input
                value={term}
                onChange={(event) => {
                  setTerm(event.target.value);
                  setSaveError(null);
                }}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
                placeholder="impact"
              />
            </label>
            <label className="text-sm font-semibold text-slate-700">
              {t("translationField")}
              <input
                value={translation}
                onChange={(event) => setTranslation(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
                placeholder="impacto"
              />
            </label>
            <label className="text-sm font-semibold text-slate-700">
              {t("partOfSpeechField")}
              <input
                value={partOfSpeech}
                onChange={(event) => setPartOfSpeech(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
                placeholder="verb, noun"
              />
            </label>
            <label className="text-sm font-semibold text-slate-700">
              {t("difficultyField")}
              <select
                value={difficulty}
                onChange={(event) => setDifficulty(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
              >
                <option value="">-</option>
                <option value="easy">{t("difficultyEasy")}</option>
                <option value="medium">{t("difficultyMedium")}</option>
                <option value="hard">{t("difficultyHard")}</option>
              </select>
            </label>
          </div>

          {mode === "manual" ? (
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm font-semibold text-slate-700 md:col-span-2">
                {t("exampleField")}
                <textarea
                  value={exampleSentence}
                  onChange={(event) => {
                    setExampleSentence(event.target.value);
                    setSaveError(null);
                  }}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
                  rows={3}
                />
              </label>
              <label className="text-sm font-semibold text-slate-700 md:col-span-2">
                {t("exampleTranslationField")}
                <textarea
                  value={exampleTranslation}
                  onChange={(event) => setExampleTranslation(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
                  rows={3}
                />
              </label>
              <div className="md:col-span-2">
                <Button onClick={handleSaveWord} disabled={!canSave}>
                  {t("saveWordButton")}
                </Button>
                {saveError && (
                  <p className="mt-3 text-xs font-semibold text-rose-600">{saveError}</p>
                )}
              </div>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm font-semibold text-slate-700">
                {t("aiVariations")}
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={aiVariations}
                  onChange={(event) => setAiVariations(Number(event.target.value))}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
                />
              </label>
              <label className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={aiIncludeTranslation}
                  onChange={(event) => setAiIncludeTranslation(event.target.checked)}
                />
                {t("aiIncludeTranslation")}
              </label>
              <div className="md:col-span-2 flex flex-wrap gap-3">
                <Button onClick={handleGenerate} disabled={aiLoading}>
                  {aiLoading ? "..." : t("aiGenerateButton")}
                </Button>
                <Button variant="secondary" onClick={handleSaveWord} disabled={!canSave}>
                  {t("saveWordButton")}
                </Button>
              </div>
              {aiError && <p className="text-sm text-rose-600">{aiError}</p>}
              {saveError && (
                <p className="text-sm font-semibold text-rose-600">{saveError}</p>
              )}
            </div>
          )}

          {aiExamples.length > 0 && (
            <div className="grid gap-4">
              <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
                {t("aiGeneratedTitle")}
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                {aiExamples.map((example, index) => (
                  <div
                    key={`${example.sentence}-${index}`}
                    className="rounded-2xl border border-amber-200/70 bg-amber-50/60 p-5 text-sm text-slate-700"
                  >
                    <HighlightedSentence sentence={example.sentence} word={term} />
                    {example.translation && (
                      <p className="mt-3 text-xs text-slate-500">
                        {example.translation}
                      </p>
                    )}
                    <div className="mt-4">
                      <Button variant="secondary" onClick={() => handleUseExample(example)}>
                        {t("aiUseExample")}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        <section className="grid gap-6">
          <h3 className="text-2xl font-semibold text-slate-900">{t("wordListTitle")}</h3>
          {!isHydrated ? (
            <p className="text-slate-600">{t("loadingWords")}</p>
          ) : data.words.length === 0 ? (
            <p className="text-slate-600">{t("emptyWords")}</p>
          ) : (
            <div className="grid gap-5">
              {data.words.map((word) => (
                <div
                  key={word.id}
                  className="rounded-3xl border border-slate-200/70 bg-[color:var(--surface)] p-6 shadow-[0_20px_50px_-40px_rgba(30,30,30,0.4)]"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h4 className="text-xl font-semibold text-slate-900">{word.term}</h4>
                      <p className="text-sm text-slate-500">
                        {word.translation || ""} {word.partOfSpeech ? `• ${word.partOfSpeech}` : ""}
                      </p>
                    </div>
                    {word.difficulty && (
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                        {difficultyLabel(word.difficulty)}
                      </span>
                    )}
                  </div>
                  {word.examples.length > 0 ? (
                    <div className="mt-4 grid gap-3">
                      {word.examples.map((example) => (
                        <div key={example.id} className="rounded-2xl border border-slate-100 bg-white px-4 py-3 text-sm text-slate-600">
                          <HighlightedSentence sentence={example.sentence} word={word.term} />
                          {example.translation && (
                            <p className="mt-2 text-xs text-slate-400">{example.translation}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-3 text-sm text-slate-400">{t("emptyWords")}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
