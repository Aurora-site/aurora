import { persistentAtom } from "@nanostores/persistent";
import type { ui } from "../i18n/ui";
import { getLangFromHref } from "../i18n/utils";

export const localeAtom = persistentAtom<keyof typeof ui>(
  "locale:",
  getLangFromHref(window.location.href),
);
