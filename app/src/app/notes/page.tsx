"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/Button";
import { MarkdownPreview } from "@/components/MarkdownPreview";
import { useAppStoreContext } from "@/store/AppStoreProvider";
import { createId } from "@/store/useAppStore";
import { saveNotes } from "@/services/userDataApi";
import { useTranslations } from "@/store/useTranslations";
import type { StudyNote } from "@/lib/types";

type EditorMode = "write" | "preview" | "split";

export default function NotesPage() {
  const { data, ready, setNotes } = useAppStoreContext();
  const { locale, t } = useTranslations();

  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editMarkdown, setEditMarkdown] = useState("");
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [mode, setMode] = useState<EditorMode>("split");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const selectedNote = useMemo(
    () => data.notes.find((n) => n.id === selectedNoteId) ?? null,
    [data.notes, selectedNoteId],
  );

  const selectNote = useCallback(
    (note: StudyNote) => {
      if (isDirty && !window.confirm(t("notesUnsavedWarning"))) return;
      setSelectedNoteId(note.id);
      setEditTitle(note.title);
      setEditMarkdown(note.markdown);
      setIsDirty(false);
    },
    [isDirty, t],
  );

  const handleBackToList = useCallback(() => {
    if (isDirty && !window.confirm(t("notesUnsavedWarning"))) return;
    setSelectedNoteId(null);
    setIsDirty(false);
  }, [isDirty, t]);

  const handleTitleChange = (nextTitle: string) => {
    setEditTitle(nextTitle);
    setIsDirty(true);
  };

  const handleMarkdownChange = (nextMarkdown: string) => {
    setEditMarkdown(nextMarkdown);
    setIsDirty(true);
  };

  const handleSave = async () => {
    if (!selectedNoteId) return;
    setIsSaving(true);
    try {
      const updatedNotes = data.notes.map((n) =>
        n.id === selectedNoteId
          ? { ...n, title: editTitle, markdown: editMarkdown, updatedAt: new Date().toISOString() }
          : n,
      );
      await saveNotes(updatedNotes);
      setNotes(updatedNotes);
      setIsDirty(false);
    } catch (error) {
      console.error("Failed to save notes", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateNote = async () => {
    if (isDirty && !window.confirm(t("notesUnsavedWarning"))) return;
    const newNote: StudyNote = {
      id: createId(),
      title: "",
      markdown: "",
      updatedAt: new Date().toISOString(),
    };
    const updatedNotes = [newNote, ...data.notes];
    setIsSaving(true);
    try {
      await saveNotes(updatedNotes);
      setNotes(updatedNotes);
      setSelectedNoteId(newNote.id);
      setEditTitle("");
      setEditMarkdown("");
      setIsDirty(false);
    } catch (error) {
      console.error("Failed to create note", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteNote = async () => {
    if (!selectedNoteId) return;
    if (!window.confirm(t("notesDeleteConfirm"))) return;
    const updatedNotes = data.notes.filter((n) => n.id !== selectedNoteId);
    setIsSaving(true);
    try {
      await saveNotes(updatedNotes);
      setNotes(updatedNotes);
      setSelectedNoteId(null);
      setEditTitle("");
      setEditMarkdown("");
      setIsDirty(false);
    } catch (error) {
      console.error("Failed to delete note", error);
    } finally {
      setIsSaving(false);
    }
  };

  const applyWrap = (left: string, right: string, fallback: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = editMarkdown.slice(start, end);
    const content = selectedText || fallback;
    const nextMarkdown =
      editMarkdown.slice(0, start) + left + content + right + editMarkdown.slice(end);

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
    const selectedText = editMarkdown.slice(start, end);
    const content = selectedText || fallback;
    const lines = content.split("\n");
    const nextContent = lines.map((line) => `${prefix}${line}`).join("\n");
    const nextMarkdown = editMarkdown.slice(0, start) + nextContent + editMarkdown.slice(end);

    handleMarkdownChange(nextMarkdown);
    window.setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start, start + nextContent.length);
    }, 0);
  };

  // Warn before closing tab with unsaved changes
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  const updatedAtLabel = useMemo(() => {
    if (!selectedNote) return "";
    const updatedAt = new Date(selectedNote.updatedAt);
    if (Number.isNaN(updatedAt.getTime())) return "";

    return new Intl.DateTimeFormat(locale, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(updatedAt);
  }, [selectedNote, locale]);

  const toolbarButtonClass =
    "h-9 min-w-9 rounded-lg border border-transparent px-2 text-lg font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-white";

  const showWrite = mode === "write" || mode === "split";
  const showPreview = mode === "preview" || mode === "split";

  if (!ready) {
    return (
      <div className="min-h-screen">
        <AppHeader />
        <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-12">
          <p className="text-sm text-slate-500">{t("loadingData")}</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-12">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">{t("notesSubtitle")}</p>
          <h2 className="text-3xl font-semibold text-slate-900">{t("notesTitle")}</h2>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          {/* ---- Notes list sidebar ---- */}
          <aside
            className={`flex flex-col gap-3 ${selectedNoteId ? "hidden lg:flex" : "flex"}`}
          >
            <Button onClick={handleCreateNote} disabled={isSaving}>
              + {t("notesNewNote")}
            </Button>

            {data.notes.length === 0 && (
              <p className="py-8 text-center text-sm text-slate-400">{t("notesEmptyList")}</p>
            )}

            <ul className="flex flex-col gap-1">
              {data.notes.map((note) => {
                const isActive = note.id === selectedNoteId;
                return (
                  <li key={note.id}>
                    <button
                      type="button"
                      onClick={() => selectNote(note)}
                      className={`w-full rounded-xl px-4 py-3 text-left text-sm transition ${
                        isActive
                          ? "bg-slate-900 font-semibold text-white"
                          : "text-slate-700 hover:bg-slate-100"
                      }`}
                    >
                      <span className="block truncate">
                        {note.title || t("notesNewNote")}
                      </span>
                      <span className={`block truncate text-xs ${isActive ? "text-slate-300" : "text-slate-400"}`}>
                        {new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(
                          new Date(note.updatedAt),
                        )}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>

          {/* ---- Editor panel ---- */}
          <section
            className={`${selectedNoteId ? "block" : "hidden lg:block"}`}
          >
            {!selectedNoteId && (
              <div className="flex min-h-[400px] items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-[color:var(--surface)]">
                <p className="text-sm text-slate-400">{t("notesSelectNote")}</p>
              </div>
            )}

            {selectedNoteId && (
              <div className="grid gap-6 rounded-3xl border border-slate-200/70 bg-[color:var(--surface)] p-8 shadow-[0_30px_60px_-40px_rgba(30,30,30,0.4)]">
                {/* Mobile back button */}
                <button
                  type="button"
                  onClick={handleBackToList}
                  className="flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-800 lg:hidden"
                >
                  &larr; {t("notesBackToList")}
                </button>

                <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
                  <label className="text-sm font-semibold text-slate-700">
                    {t("notesTitleField")}
                    <input
                      value={editTitle}
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
                          &ldquo;
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
                        value={editMarkdown}
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
                        <MarkdownPreview markdown={editMarkdown} emptyLabel={t("notesPreviewEmpty")} />
                      </div>
                    </section>
                  )}
                </div>

                {/* Footer: save button + status */}
                <div className="flex flex-wrap items-center gap-4">
                  <Button onClick={handleSave} disabled={isSaving || !isDirty}>
                    {isSaving ? t("notesSaving") : t("notesSaveButton")}
                  </Button>
                  <Button variant="ghost" onClick={handleDeleteNote} disabled={isSaving}>
                    {t("notesDeleteNote")}
                  </Button>

                  {isDirty && (
                    <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-amber-600">
                      <span className="inline-block h-2 w-2 rounded-full bg-amber-500" />
                      {t("notesUnsavedChanges")}
                    </span>
                  )}

                  {!isDirty && updatedAtLabel && (
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      {t("notesLastSaved")}: {updatedAtLabel}
                    </p>
                  )}
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
