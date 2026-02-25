import type { ReactNode } from "react";

type MarkdownPreviewProps = {
  markdown: string;
  emptyLabel: string;
};

const INLINE_REGEX = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;

const parseInline = (text: string, keyPrefix: string): ReactNode[] => {
  if (!text) return [];

  const nodes: ReactNode[] = [];
  let cursor = 0;
  let index = 0;

  for (const match of text.matchAll(INLINE_REGEX)) {
    const token = match[0];
    const start = match.index ?? 0;

    if (start > cursor) {
      nodes.push(text.slice(cursor, start));
    }

    if (token.startsWith("**") && token.endsWith("**")) {
      nodes.push(
        <strong key={`${keyPrefix}-strong-${index}`} className="font-semibold text-slate-900">
          {token.slice(2, -2)}
        </strong>,
      );
    } else if (token.startsWith("*") && token.endsWith("*")) {
      nodes.push(
        <em key={`${keyPrefix}-em-${index}`} className="italic">
          {token.slice(1, -1)}
        </em>,
      );
    } else if (token.startsWith("`") && token.endsWith("`")) {
      nodes.push(
        <code
          key={`${keyPrefix}-code-${index}`}
          className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-[0.9em] text-amber-900"
        >
          {token.slice(1, -1)}
        </code>,
      );
    } else {
      const linkMatch = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (linkMatch) {
        const [, label, href] = linkMatch;
        const isSafeHref = href.startsWith("http://") || href.startsWith("https://");

        nodes.push(
          isSafeHref ? (
            <a
              key={`${keyPrefix}-link-${index}`}
              className="underline decoration-amber-500 decoration-2 underline-offset-2"
              href={href}
              rel="noreferrer noopener"
              target="_blank"
            >
              {label}
            </a>
          ) : (
            label
          ),
        );
      } else {
        nodes.push(token);
      }
    }

    cursor = start + token.length;
    index += 1;
  }

  if (cursor < text.length) {
    nodes.push(text.slice(cursor));
  }

  return nodes;
};

const isSpecialLine = (line: string) => {
  const trimmed = line.trim();
  if (!trimmed) return true;
  return (
    /^```/.test(trimmed) ||
    /^#{1,6}\s+/.test(trimmed) ||
    /^>\s?/.test(trimmed) ||
    /^[-*+]\s+/.test(trimmed) ||
    /^\d+\.\s+/.test(trimmed)
  );
};

const parseBlocks = (markdown: string, emptyLabel: string): ReactNode[] => {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const nodes: ReactNode[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];
    const trimmed = line.trim();

    if (!trimmed) {
      index += 1;
      continue;
    }

    if (trimmed.startsWith("```")) {
      index += 1;
      const codeLines: string[] = [];
      while (index < lines.length && !lines[index].trim().startsWith("```")) {
        codeLines.push(lines[index]);
        index += 1;
      }
      if (index < lines.length) {
        index += 1;
      }
      nodes.push(
        <pre
          key={`code-${nodes.length}`}
          className="overflow-x-auto rounded-2xl border border-slate-200 bg-slate-950 p-4 text-sm text-slate-100"
        >
          <code>{codeLines.join("\n")}</code>
        </pre>,
      );
      continue;
    }

    const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const content = headingMatch[2];
      const headingClass =
        level === 1
          ? "text-3xl"
          : level === 2
            ? "text-2xl"
            : level === 3
              ? "text-xl"
              : "text-lg";

      nodes.push(
        <div key={`heading-${nodes.length}`} className={`${headingClass} font-semibold text-slate-900`}>
          {parseInline(content, `heading-${nodes.length}`)}
        </div>,
      );
      index += 1;
      continue;
    }

    if (/^>\s?/.test(trimmed)) {
      const quoteLines: string[] = [];
      while (index < lines.length && /^>\s?/.test(lines[index].trim())) {
        quoteLines.push(lines[index].trim().replace(/^>\s?/, ""));
        index += 1;
      }
      nodes.push(
        <blockquote
          key={`quote-${nodes.length}`}
          className="border-l-4 border-amber-300 bg-amber-50/70 px-4 py-3 text-slate-700"
        >
          {quoteLines.map((quoteLine, quoteIndex) => (
            <p key={`quote-line-${quoteIndex}`}>{parseInline(quoteLine, `quote-${quoteIndex}`)}</p>
          ))}
        </blockquote>,
      );
      continue;
    }

    if (/^[-*+]\s+/.test(trimmed)) {
      const items: string[] = [];
      while (index < lines.length && /^[-*+]\s+/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^[-*+]\s+/, ""));
        index += 1;
      }
      nodes.push(
        <ul key={`ul-${nodes.length}`} className="list-disc space-y-2 pl-6 text-slate-700">
          {items.map((item, itemIndex) => (
            <li key={`ul-item-${itemIndex}`}>{parseInline(item, `ul-item-${itemIndex}`)}</li>
          ))}
        </ul>,
      );
      continue;
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      const items: string[] = [];
      while (index < lines.length && /^\d+\.\s+/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^\d+\.\s+/, ""));
        index += 1;
      }
      nodes.push(
        <ol key={`ol-${nodes.length}`} className="list-decimal space-y-2 pl-6 text-slate-700">
          {items.map((item, itemIndex) => (
            <li key={`ol-item-${itemIndex}`}>{parseInline(item, `ol-item-${itemIndex}`)}</li>
          ))}
        </ol>,
      );
      continue;
    }

    const paragraphLines: string[] = [line];
    index += 1;
    while (index < lines.length && !isSpecialLine(lines[index])) {
      paragraphLines.push(lines[index]);
      index += 1;
    }

    const paragraph = paragraphLines.join(" ").trim();
    if (paragraph) {
      nodes.push(
        <p key={`paragraph-${nodes.length}`} className="leading-7 text-slate-700">
          {parseInline(paragraph, `paragraph-${nodes.length}`)}
        </p>,
      );
    }
  }

  if (nodes.length === 0) {
    return [<p key="empty" className="text-sm text-slate-500">{emptyLabel}</p>];
  }

  return nodes;
};

export const MarkdownPreview = ({ markdown, emptyLabel }: MarkdownPreviewProps) => (
  <article className="space-y-4">{parseBlocks(markdown, emptyLabel)}</article>
);
