"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { useAppStoreContext } from "@/store/AppStoreProvider";

type Mode = "login" | "register";

export default function AuthPage() {
  const router = useRouter();
  const { loginWithEmail, registerWithEmail } = useAppStoreContext();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (mode === "login") {
        await loginWithEmail(email.trim(), password);
      } else {
        await registerWithEmail(email.trim(), password);
      }
      router.replace("/");
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[color:var(--background)] px-6 py-12">
      <main className="mx-auto w-full max-w-md rounded-3xl border border-slate-200/70 bg-[color:var(--surface)] p-8 shadow-[0_30px_60px_-40px_rgba(30,30,30,0.4)]">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Account</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">OpenCode Learn English</h1>
        <p className="mt-3 text-sm text-slate-600">
          Sign in to access your personal learning database.
        </p>

        <div className="mt-6 flex gap-3">
          <Button variant={mode === "login" ? "primary" : "secondary"} onClick={() => setMode("login")}>
            Login
          </Button>
          <Button
            variant={mode === "register" ? "primary" : "secondary"}
            onClick={() => setMode("register")}
          >
            Create account
          </Button>
        </div>

        <label className="mt-6 block text-sm font-semibold text-slate-700">
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
            placeholder="you@email.com"
          />
        </label>

        <label className="mt-4 block text-sm font-semibold text-slate-700">
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3"
            placeholder="At least 8 characters"
          />
        </label>

        {error && (
          <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        <div className="mt-6">
          <Button onClick={submit} disabled={loading}>
            {loading ? "Please wait..." : mode === "login" ? "Login" : "Create account"}
          </Button>
        </div>
      </main>
    </div>
  );
}
