import type { ExampleTone } from "@/lib/types";
import { requestJson } from "@/services/apiClient";

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
  const payload = await requestJson<GenerateExamplesResponse>("/api/v1/examples/generate", {
    method: "POST",
    body: input,
  });
  return payload.examples ?? [];
};
