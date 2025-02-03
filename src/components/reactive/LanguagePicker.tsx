import { languages } from "../../i18n/ui";

export const LanguagePicker = () => {
  return (
    <ul>
      {Object.entries(languages).map(([lang, label]) => (
        <li>
          <a href={`/${lang}/`}>{label}</a>
        </li>
      ))}
    </ul>
  );
};
