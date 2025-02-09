import { useEffect } from "react";
import { ui } from "../../i18n/ui";
import { getLangFromHref } from "../../i18n/utils";
import { localeAtom } from "../../stores/locale";

export const LanguagePicker = () => {
  useEffect(() => {
    // Получаем текущий язык из localStorage или из URL, если в localStorage его нет
    const savedLang = localStorage.getItem("lang");
    const lang =
      savedLang && savedLang in ui
        ? savedLang
        : getLangFromHref(window.location.href);

    // Устанавливаем язык в atom
    localeAtom.set(lang);

    // Сохраняем выбранный язык в localStorage
    localStorage.setItem("lang", lang);
  }, []); // Выполнится только один раз при монтировании компонента

  return (
    <div className="flex-coloumn items-center space-y-[20px] pt-[4px] lg:space-y-[8px]">
      {(Object.keys(ui) as (keyof typeof ui)[]).map((lang) => (
        <a
          key={lang}
          href={`/${lang}/`} // Ссылка для перехода на выбранный язык
          className="flex items-center justify-center lg:justify-end"
          title={lang}
          onClick={(e) => {
            // Останавливаем переход по ссылке
            e.preventDefault();
            // Сохраняем выбранный язык в localStorage и меняем atom
            localStorage.setItem("lang", lang);
            localeAtom.set(lang);
            // Перезагружаем страницу с новым языком
            window.location.href = `/${lang}${window.location.pathname.slice(3)}`;
          }}
        >
          <img src={ui[lang].icon} alt={lang} width="30" />
        </a>
      ))}
    </div>
  );
};
