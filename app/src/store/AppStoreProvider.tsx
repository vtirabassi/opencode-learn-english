"use client";

import { createContext, useContext } from "react";
import { useAppStore } from "@/store/useAppStore";

type AppStore = ReturnType<typeof useAppStore>;

const AppStoreContext = createContext<AppStore | null>(null);

export const AppStoreProvider = ({ children }: { children: React.ReactNode }) => {
  const store = useAppStore();
  return <AppStoreContext.Provider value={store}>{children}</AppStoreContext.Provider>;
};

export const useAppStoreContext = () => {
  const context = useContext(AppStoreContext);
  if (!context) {
    throw new Error("useAppStoreContext must be used within AppStoreProvider");
  }
  return context;
};
