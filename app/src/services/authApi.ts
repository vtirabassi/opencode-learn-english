import { requestJson, requestNoContent } from "@/services/apiClient";
import { clearAccessToken, setAccessToken } from "@/services/authSession";

export type AuthUser = {
  userId: string;
  email: string;
};

type AuthResponse = {
  accessToken: string;
  user: AuthUser;
};

type AuthRequest = {
  email: string;
  password: string;
};

const postAuth = async (path: string, payload: AuthRequest) => {
  const response = await requestJson<AuthResponse>(path, {
    method: "POST",
    body: payload,
    requireAuth: false,
  });

  setAccessToken(response.accessToken);
  return response.user;
};

export const register = (payload: AuthRequest) => postAuth("/api/v1/auth/register", payload);

export const login = (payload: AuthRequest) => postAuth("/api/v1/auth/login", payload);

export const logout = async () => {
  try {
    await requestNoContent("/api/v1/auth/logout", {
      method: "POST",
      requireAuth: true,
    });
  } catch {
    // ignore logout network issues and clear local session regardless
  } finally {
    clearAccessToken();
  }
};

export const getCurrentUser = () =>
  requestJson<AuthUser>("/api/v1/auth/me", {
    method: "GET",
    requireAuth: true,
  });
