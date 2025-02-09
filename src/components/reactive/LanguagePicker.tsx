import { useEffect } from "react";
import { ui } from "../../i18n/ui";
import { getLangFromHref, getLocalizedUrl } from "../../i18n/utils";
import { localeAtom } from "../../stores/locale";

export const LanguagePicker = () => {
  useEffect(() => {
    localeAtom.set(getLangFromHref(window.location.href));
  }, []); // Выполнится только один раз при монтировании компонента

  return (
    <div className="flex-coloumn items-center space-y-[20px] pt-[4px] lg:space-y-[8px]">
      {(Object.keys(ui) as (keyof typeof ui)[]).map((lang) => (
        <a
          key={lang}
          href={getLocalizedUrl(lang, window.location.pathname)} // Ссылка для перехода на выбранный язык
          className="flex items-center justify-center lg:justify-end"
          title={lang}
        >
          <img src={ui[lang].icon} alt={lang} width="30" />
        </a>
      ))}
    </div>
  );
};
