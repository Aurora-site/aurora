import { useStore } from "@nanostores/react";
import { ui, defaultLang } from "./ui";
import type { WritableAtom } from "nanostores";
import { getRelativeLocaleUrl } from "astro:i18n";

export type Lang = keyof typeof ui;

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split("/");
  if (lang in ui) return lang as Lang;
  return defaultLang;
}

export function getLangFromHref(href: string) {
  for (const i of href.split("/")) {
    if (i in ui) return i as Lang;
  }
  return defaultLang;
}

export function useTranslations(lang: Lang) {
  return function t(key: keyof (typeof ui)[typeof defaultLang]) {
    return ui[lang][key] || ui[defaultLang][key];
  };
}

// plaseholder type for astro object cus its not available in runtime
type Astro = { currentLocale?: string };

export function useAstroLocale(a: Astro) {
  const l = a.currentLocale as Lang;
  if (l in ui) return l as Lang;
  return defaultLang;
}

export function useLocale(localeAtom: WritableAtom) {
  const locale = useStore(localeAtom);
  return useTranslations(locale);
}

export function useAstroTranslations(a: Astro) {
  return useTranslations(useAstroLocale(a));
}

// Функция, которая добавляет текущий язык в путь URL
export function getLocalizedUrl(lang: Lang, path: string) {
  const p = path.split("/").filter(Boolean); // Убираем пустые элементы
  const lPath = p.length >= 2 ? p.slice(-1)[0] : undefined;
  return getRelativeLocaleUrl(lang, lPath);
}
