const ACCESS_TOKEN_KEY = "learn-english.access-token";

let inMemoryToken: string | null = null;

const canUseStorage = () => typeof window !== "undefined";

export const getAccessToken = () => {
  if (inMemoryToken) {
    return inMemoryToken;
  }

  if (!canUseStorage()) {
    return null;
  }

  const token = window.localStorage.getItem(ACCESS_TOKEN_KEY);
  inMemoryToken = token;
  return token;
};

export const setAccessToken = (token: string) => {
  inMemoryToken = token;

  if (canUseStorage()) {
    window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
  }
};

export const clearAccessToken = () => {
  inMemoryToken = null;

  if (canUseStorage()) {
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  }
};
