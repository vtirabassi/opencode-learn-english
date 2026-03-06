import type {
  RemoteNote,
  RemoteReviewItem,
  RemoteSettings,
  RemoteWord,
} from "@/lib/userDataContracts";
import { requestJson, requestNoContent } from "@/services/apiClient";

const getJson = <T>(path: string): Promise<T> => requestJson<T>(path, { method: "GET" });

const putJson = <T>(path: string, payload: T) =>
  requestNoContent(path, { method: "PUT", body: payload });

export const getSettings = () => getJson<RemoteSettings>("/api/v1/settings");
export const saveSettings = (settings: RemoteSettings) => putJson("/api/v1/settings", settings);

export const getWords = () => getJson<RemoteWord[]>("/api/v1/words");
export const saveWords = (words: RemoteWord[]) => putJson("/api/v1/words", words);

export const getNote = () => getJson<RemoteNote>("/api/v1/notes");
export const saveNote = (note: RemoteNote) => putJson("/api/v1/notes", note);

export const getReviews = () => getJson<RemoteReviewItem[]>("/api/v1/reviews");
export const saveReviews = (reviews: RemoteReviewItem[]) => putJson("/api/v1/reviews", reviews);
