"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/Button";
import { MarkdownPreview } from "@/components/MarkdownPreview";
import { useAppStoreContext } from "@/store/AppStoreProvider";
import { useTranslations } from "@/store/useTranslations";

type EditorMode = "write" | "preview" | "split";

export default function NotesPage() {
  const { data, ready, updateStudyNote } = useAppStoreContext();
  const { locale, t } = useTranslations();
  const [mode, setMode] = useState<EditorMode>("split");
  const [title, setTitle] = useState(() => data.note.title);
  const [markdown, setMarkdown] = useState(() => data.note.markdown);
  const saveTimeoutRef = useRef<number | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const scheduleSave = (nextTitle: string, nextMarkdown: string) => {
    if (saveTimeoutRef.current) {
      window.clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = window.setTimeout(() => {
      updateStudyNote({ title: nextTitle, markdown: nextMarkdown });
      saveTimeoutRef.current = null;
    }, 250);
  };

  const handleTitleChange = (nextTitle: string) => {
    setTitle(nextTitle);
    scheduleSave(nextTitle, markdown);
  };

  const handleMarkdownChange = (nextMarkdown: string) => {
    setMarkdown(nextMarkdown);
    scheduleSave(title, nextMarkdown);
  };

  const applyWrap = (left: string, right: string, fallback: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = markdown.slice(start, end);
    const content = selectedText || fallback;
    const nextMarkdown =
      markdown.slice(0, start) + left + content + right + markdown.slice(end);

    handleMarkdownChange(nextMarkdown);
    window.setTimeout(() => {
      textarea.focus();
      const selectionOffset = selectedText ? content.length : fallback.length;
      const nextStart = start + left.length;
      textarea.setSelectionRange(nextStart, nextStart + selectionOffset);
    }, 0);
  };

  const applyLinePrefix = (prefix: string, fallback: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = markdown.slice(start, end);
    const content = selectedText || fallback;
    const lines = content.split("\n");
    const nextContent = lines.map((line) => `${prefix}${line}`).join("\n");
    const nextMarkdown = markdown.slice(0, start) + nextContent + markdown.slice(end);

    handleMarkdownChange(nextMarkdown);
    window.setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start, start + nextContent.length);
    }, 0);
  };

  const toolbarButtonClass =
    "h-9 min-w-9 rounded-lg border border-transparent px-2 text-lg font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-white";

  useEffect(
    () => () => {
      if (saveTimeoutRef.current) {
        window.clearTimeout(saveTimeoutRef.current);
      }
    },
    [],
  );

  const updatedAtLabel = useMemo(() => {
    if (!ready) return "";
    const updatedAt = new Date(data.note.updatedAt);
    if (Number.isNaN(updatedAt.getTime())) return "";

    return new Intl.DateTimeFormat(locale, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(updatedAt);
  }, [data.note.updatedAt, locale, ready]);

  const showWrite = mode === "write" || mode === "split";
  const showPreview = mode === "preview" || mode === "split";

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-12">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{t("notesSubtitle")}</p>
          <h2 className="text-3xl font-semibold text-slate-900">{t("notesTitle")}</h2>
        </div>

        <section className="grid gap-6 rounded-3xl border border-slate-200/70 bg-[color:var(--surface)] p-8 shadow-[0_30px_60px_-40px_rgba(30,30,30,0.4)]">
          <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
            <label className="text-sm font-semibold text-slate-700">
              {t("notesTitleField")}
              <input
                value={title}
                onChange={(event) => handleTitleChange(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
                placeholder={t("notesTitle")}
              />
            </label>
            <div className="flex flex-wrap gap-3">
              <Button
                variant={mode === "write" ? "primary" : "secondary"}
                onClick={() => setMode("write")}
              >
                {t("notesModeWrite")}
              </Button>
              <Button
                variant={mode === "preview" ? "primary" : "secondary"}
                onClick={() => setMode("preview")}
              >
                {t("notesModePreview")}
              </Button>
              <Button
                variant={mode === "split" ? "primary" : "secondary"}
                onClick={() => setMode("split")}
              >
                {t("notesModeSplit")}
              </Button>
            </div>
          </div>

          <div className={`grid gap-4 ${mode === "split" ? "lg:grid-cols-2" : "grid-cols-1"}`}>
            {showWrite && (
              <label className="text-sm font-semibold text-slate-700">
                {t("notesMarkdownField")}
                <div className="mt-2 flex flex-wrap items-center gap-1 rounded-xl border border-slate-200 bg-[color:var(--surface-muted)] p-2">
                  <button
                    aria-label={t("notesToolbarBold")}
                    className={toolbarButtonClass}
                    onClick={() => applyWrap("**", "**", t("notesToolbarBoldSample"))}
                    title={t("notesToolbarBold")}
                    type="button"
                  >
                    B
                  </button>
                  <button
                    aria-label={t("notesToolbarItalic")}
                    className={`${toolbarButtonClass} italic`}
                    onClick={() => applyWrap("*", "*", t("notesToolbarItalicSample"))}
                    title={t("notesToolbarItalic")}
                    type="button"
                  >
                    I
                  </button>
                  <button
                    aria-label={t("notesToolbarLink")}
                    className={toolbarButtonClass}
                    onClick={() =>
                      applyWrap("[", "](https://example.com)", t("notesToolbarLinkSample"))
                    }
                    title={t("notesToolbarLink")}
                    type="button"
                  >
                    🔗
                  </button>
                  <span className="mx-1 h-5 w-px bg-slate-300" />
                  <button
                    aria-label={t("notesToolbarList")}
                    className={toolbarButtonClass}
                    onClick={() => applyLinePrefix("- ", t("notesToolbarListSample"))}
                    title={t("notesToolbarList")}
                    type="button"
                  >
                    ••
                  </button>
                  <button
                    aria-label={t("notesToolbarOrderedList")}
                    className={toolbarButtonClass}
                    onClick={() => applyLinePrefix("1. ", t("notesToolbarListSample"))}
                    title={t("notesToolbarOrderedList")}
                    type="button"
                  >
                    1.
                  </button>
                  <button
                    aria-label={t("notesToolbarHeading")}
                    className={toolbarButtonClass}
                    onClick={() => applyLinePrefix("# ", t("notesToolbarHeadingSample"))}
                    title={t("notesToolbarHeading")}
                    type="button"
                  >
                    H
                  </button>
                  <button
                    aria-label={t("notesToolbarQuote")}
                    className={toolbarButtonClass}
                    onClick={() => applyLinePrefix("> ", t("notesToolbarQuoteSample"))}
                    title={t("notesToolbarQuote")}
                    type="button"
                  >
                    “
                  </button>
                  <span className="mx-1 h-5 w-px bg-slate-300" />
                  <button
                    aria-label={t("notesToolbarCode")}
                    className={`${toolbarButtonClass} font-mono`}
                    onClick={() =>
                      applyWrap("```\n", "\n```", t("notesToolbarCodeBlockSample"))
                    }
                    title={t("notesToolbarCode")}
                    type="button"
                  >
                    {"</>"}
                  </button>
                </div>
                <textarea
                  ref={textareaRef}
                  value={markdown}
                  onChange={(event) => handleMarkdownChange(event.target.value)}
                  rows={16}
                  className="mt-2 min-h-[420px] w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 font-mono text-sm"
                  placeholder={t("notesPlaceholder")}
                />
              </label>
            )}

            {showPreview && (
              <section className="rounded-2xl border border-slate-200 bg-[color:var(--surface-muted)] p-6">
                <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                  {t("notesModePreview")}
                </h3>
                <div className="mt-4">
                  <MarkdownPreview markdown={markdown} emptyLabel={t("notesPreviewEmpty")} />
                </div>
              </section>
            )}
          </div>

          {updatedAtLabel && (
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              {t("notesLastSaved")}: {updatedAtLabel}
            </p>
          )}
        </section>
      </main>
    </div>
  );
}
