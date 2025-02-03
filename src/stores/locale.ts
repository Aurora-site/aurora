import { persistentAtom } from "@nanostores/persistent";
import type { ui } from "../i18n/ui";

export const localeAtom = persistentAtom<keyof typeof ui>(
  "locale:",
  window.navigator.language.startsWith("ru") ? "ru" : "en",
);
