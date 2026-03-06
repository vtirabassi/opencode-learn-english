"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAppStoreContext } from "@/store/AppStoreProvider";

export const AuthGate = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { ready, authStatus } = useAppStoreContext();

  const isAuthPage = pathname.startsWith("/auth");

  useEffect(() => {
    if (!ready) return;

    if (authStatus === "unauthenticated" && !isAuthPage) {
      router.replace("/auth");
      return;
    }

    if (authStatus === "authenticated" && isAuthPage) {
      router.replace("/");
    }
  }, [authStatus, isAuthPage, ready, router]);

  if (!ready || authStatus === "loading") {
    return (
      <div className="min-h-screen bg-[color:var(--background)] px-6 py-12 text-sm text-slate-600">
        Loading...
      </div>
    );
  }

  if (authStatus === "unauthenticated" && !isAuthPage) {
    return null;
  }

  if (authStatus === "authenticated" && isAuthPage) {
    return null;
  }

  return <>{children}</>;
};
