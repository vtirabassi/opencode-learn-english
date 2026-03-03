import type {
  RemoteNote,
  RemoteReviewItem,
  RemoteSettings,
  RemoteWord,
} from "@/lib/userDataContracts";
import { buildApiUrl } from "@/lib/apiBaseUrl";

const getJson = async <T>(path: string): Promise<T> => {
  const response = await fetch(buildApiUrl(path), {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Failed to fetch ${path}`);
  }

  return (await response.json()) as T;
};

const putJson = async <T>(path: string, payload: T) => {
  const response = await fetch(buildApiUrl(path), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Failed to save ${path}`);
  }
};

export const getSettings = () => getJson<RemoteSettings>("/api/v1/settings");
export const saveSettings = (settings: RemoteSettings) => putJson("/api/v1/settings", settings);

export const getWords = () => getJson<RemoteWord[]>("/api/v1/words");
export const saveWords = (words: RemoteWord[]) => putJson("/api/v1/words", words);

export const getNote = () => getJson<RemoteNote>("/api/v1/notes");
export const saveNote = (note: RemoteNote) => putJson("/api/v1/notes", note);

export const getReviews = () => getJson<RemoteReviewItem[]>("/api/v1/reviews");
export const saveReviews = (reviews: RemoteReviewItem[]) => putJson("/api/v1/reviews", reviews);
