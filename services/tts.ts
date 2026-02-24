import type { Locale } from "@/lib/types";

export const isSpeechSupported = () =>
  typeof window !== "undefined" && "speechSynthesis" in window;

export const speak = (text: string, locale: Locale) => {
  if (!isSpeechSupported()) return false;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = locale;
  utterance.rate = 0.95;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
  return true;
};
