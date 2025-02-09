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

// Функция, которая добавляет текущий язык в путь URL
export function getLocalizedUrl(path: string, currentLang: keyof typeof ui) {
  const parts = path.split("/").filter(Boolean); // Убираем пустые элементы

  // Если язык не указан, просто возвращаем путь без изменений
  if (!currentLang) {
    return path;
  }

  if (parts[0] in ui) {
    parts[0] = currentLang; // Заменяем существующий язык
  } else {
    parts.unshift(currentLang); // Добавляем язык в начало
  }

  return "/" + parts.join("/");
}

// Функция для смены языка, но с сохранением текущей страницы
export function switchLanguage(newLang: keyof typeof ui, currentUrl: string) {
  const parts = currentUrl.split("/").filter(Boolean);

  if (parts[0] in ui) {
    parts[0] = newLang; // Заменяем язык
  } else {
    parts.unshift(newLang); // Добавляем язык в начало
  }

  return "/" + parts.join("/");
}
