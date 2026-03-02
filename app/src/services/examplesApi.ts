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

const normalizeBaseUrl = (baseUrl?: string) => {
  if (!baseUrl) return "";
  return baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
};

const buildGenerateEndpoint = () => {
  const baseUrl = normalizeBaseUrl(process.env.NEXT_PUBLIC_API_BASE_URL);
  return baseUrl
    ? `${baseUrl}/api/v1/examples/generate`
    : "/api/v1/examples/generate";
};

export const generateExamples = async (input: GenerateExamplesInput) => {
  const response = await fetch(buildGenerateEndpoint(), {
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
