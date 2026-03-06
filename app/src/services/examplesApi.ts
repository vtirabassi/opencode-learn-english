import { buildApiUrl } from "@/lib/apiBaseUrl";
import type { ExampleTone } from "@/lib/types";

type GenerateExamplesInput = {
  word: string;
  tone?: ExampleTone;
  variations?: number;
  includeTranslation?: boolean;
};

type GeneratedExample = {
  sentence: string;
  translation?: string | null;
  tone?: ExampleTone;
};

type GenerateExamplesResponse = {
  examples?: GeneratedExample[];
};

export const generateExamples = async (input: GenerateExamplesInput) => {
  const response = await fetch(buildApiUrl("/api/v1/examples/generate"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Failed to generate examples.");
  }

  const payload = (await response.json()) as GenerateExamplesResponse;
  return payload.examples ?? [];
};
