import { ui, defaultLang } from "./ui";
import type { Astro } from "/astro/dist/types/public";

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split("/");
  if (lang in ui) return lang as keyof typeof ui;
  return defaultLang;
}

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: keyof (typeof ui)[typeof defaultLang]) {
    return ui[lang][key] || ui[defaultLang][key];
  };
}

export function useAstroLocale(a: { currentLocale: string }) {
  const l = a.currentLocale;
  if (l in ui) return l as keyof typeof ui;
  return defaultLang;
}

export function useAstroTranslations(a: Astro) {
  return useTranslations(useAstroLocale(a));
}
