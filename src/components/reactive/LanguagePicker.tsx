import { flagUrls } from "../../i18n/ui";

export const LanguagePicker = () => {
  return (
    <div className="flex-coloumn items-center space-y-[20px] pt-[4px] lg:space-y-[8px]">
      {Object.entries(flagUrls).map(([lang]) => (
        <a
          key={lang}
          href={`/${lang}/`}
          className="flex items-center justify-center lg:justify-end"
        >
          <img src={flagUrls[lang]} alt={lang} width="30" />
        </a>
      ))}
    </div>
  );
};
