import { useStore } from "@nanostores/react";
import { ui, defaultLang } from "./ui";
import type { WritableAtom } from "nanostores";

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split("/");
  if (lang in ui) return lang as keyof typeof ui;
  return defaultLang;
}

export function getLangFromHref(href: string) {
  for (const i of href.split("/")) {
    if (i in ui) return i as keyof typeof ui;
  }
  return defaultLang;
}

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: keyof (typeof ui)[typeof defaultLang]) {
    // @ts-ignore-line
    return ui[lang][key] || ui[defaultLang][key];
  };
}

// plaseholder type for astro object cus its not available in runtime
type Astro = { currentLocale?: string };

export function useAstroLocale(a: Astro) {
  const l = a.currentLocale as keyof typeof ui;
  if (l in ui) return l as keyof typeof ui;
  return defaultLang;
}

export function useLocale(localeAtom: WritableAtom) {
  const locale = useStore(localeAtom);
  return useTranslations(locale);
}

export function useAstroTranslations(a: Astro) {
  return useTranslations(useAstroLocale(a));
}
