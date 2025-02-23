import { useEffect } from "react";
import { ui } from "../../i18n/ui";
import { getLangFromHref, getLocalizedUrl } from "../../i18n/utils";
import { localeAtom } from "../../stores/locale";

export const LanguagePicker = () => {
  useEffect(() => {
    localeAtom.set(getLangFromHref(window.location.href));
  }, []); // Выполнится только один раз при монтировании компонента

  return (
    <div className="flex content-center space-x-[10px] pt-[33px]">
      {(Object.keys(ui) as (keyof typeof ui)[]).map((lang) => (
        <a
          key={lang}
          href={getLocalizedUrl(lang, window.location.pathname)} // Ссылка для перехода на выбранный язык
          className="flex items-center justify-center"
          title={lang}
        >
          <img src={ui[lang].icon} alt={lang} width={30} height={30} />
        </a>
      ))}
    </div>
  );
};
