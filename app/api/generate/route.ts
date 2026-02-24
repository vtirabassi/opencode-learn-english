import { NextResponse } from "next/server";

type RequestBody = {
  word: string;
  tone?: "neutral" | "formal" | "informal";
  variations?: number;
  includeTranslation?: boolean;
};

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

const buildPrompt = ({ word, tone, variations, includeTranslation }: RequestBody) => {
  const count = Math.min(Math.max(variations ?? 2, 1), 5);
  return [
    `You are an English tutor. Create ${count} B1/B2 sentences using the word "${word}".`,
    `Tone: ${tone ?? "neutral"}. Sentences must be natural and concise.`,
    `Return JSON only as an array of objects with fields: sentence, tone, translation${
      includeTranslation ? "" : " (translation can be null)"
    }.`,
    "If translation is provided, write it in Brazilian Portuguese. Use the word exactly as provided.",
  ].join("\n");
};

const parseJson = (content: string) => {
  try {
    return JSON.parse(content);
  } catch {
    return null;
  }
};

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Missing OPENAI_API_KEY" },
      { status: 500 },
    );
  }

  const body = (await request.json()) as RequestBody;
  if (!body.word?.trim()) {
    return NextResponse.json({ error: "Word is required" }, { status: 400 });
  }

  const requestPayload = {
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant that responds with valid JSON only.",
      },
      {
        role: "user",
        content: buildPrompt(body),
      },
    ],
    temperature: 0.7,
  };

  const response = await fetch(OPENAI_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestPayload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    return NextResponse.json({ error: errorText }, { status: response.status });
  }

  const payload = await response.json();
  const content = payload.choices?.[0]?.message?.content ?? "";
  const parsed = parseJson(content);

  if (!parsed) {
    return NextResponse.json(
      { error: "Failed to parse OpenAI response", raw: content },
      { status: 502 },
    );
  }

  return NextResponse.json({ examples: parsed });
}
