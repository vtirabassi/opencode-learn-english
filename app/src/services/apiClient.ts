import { buildApiUrl } from "@/lib/apiBaseUrl";
import { clearAccessToken, getAccessToken } from "@/services/authSession";

export class UnauthorizedApiError extends Error {
  constructor(message = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedApiError";
  }
}

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: unknown;
  requireAuth?: boolean;
};

const buildHeaders = (requireAuth: boolean) => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (requireAuth) {
    const token = getAccessToken();
    if (!token) {
      throw new UnauthorizedApiError("Authentication is required.");
    }
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

export const requestJson = async <T>(path: string, options?: RequestOptions): Promise<T> => {
  const requireAuth = options?.requireAuth ?? true;
  const response = await fetch(buildApiUrl(path), {
    method: options?.method ?? "GET",
    headers: buildHeaders(requireAuth),
    body: options?.body !== undefined ? JSON.stringify(options.body) : undefined,
  });

  if (response.status === 401) {
    clearAccessToken();
    throw new UnauthorizedApiError("Session expired. Please log in again.");
  }

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed: ${path}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
};

export const requestNoContent = async (path: string, options?: RequestOptions) => {
  await requestJson<void>(path, options);
};
