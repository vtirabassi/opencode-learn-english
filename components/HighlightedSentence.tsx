import { escapeRegExp } from "@/lib/text";

type HighlightedSentenceProps = {
  sentence: string;
  word: string;
};

export const HighlightedSentence = ({ sentence, word }: HighlightedSentenceProps) => {
  if (!word) return <>{sentence}</>;
  const regex = new RegExp(`(${escapeRegExp(word)})`, "ig");
  const parts = sentence.split(regex);

  return (
    <>
      {parts.map((part, index) =>
        index % 2 === 1 ? (
          <mark
            key={`${part}-${index}`}
            className="rounded-md bg-amber-200/70 px-1 py-0.5 font-semibold text-slate-900"
          >
            {part}
          </mark>
        ) : (
          <span key={`${part}-${index}`}>{part}</span>
        ),
      )}
    </>
  );
};
