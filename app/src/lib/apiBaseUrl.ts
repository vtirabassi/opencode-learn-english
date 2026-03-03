const DEFAULT_DEV_API_BASE_URL = "http://localhost:7071";

const normalizeBaseUrl = (baseUrl?: string) => {
  if (!baseUrl) return "";
  return baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
};

export const resolveApiBaseUrl = () => {
  const configured = normalizeBaseUrl(process.env.NEXT_PUBLIC_API_BASE_URL);
  if (configured) return configured;

  if (process.env.NODE_ENV === "development") {
    return DEFAULT_DEV_API_BASE_URL;
  }

  throw new Error(
    "Missing NEXT_PUBLIC_API_BASE_URL. Configure app/.env.local with backend URL.",
  );
};

export const buildApiUrl = (path: string) => {
  const baseUrl = resolveApiBaseUrl();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
};
