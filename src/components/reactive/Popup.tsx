import { useEffect, useState, useRef } from "react";
import { useLocale } from "../../i18n/utils";
import { localeAtom } from "../../stores/locale";

export default function Popup() {
  const [isVisible, setIsVisible] = useState(false);
  const popupRef = useRef(null);
  const t = useLocale(localeAtom);

  // Показываем попап через 15 секунд
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 15000);

    return () => clearTimeout(timer);
  }, []);

  // Закрытие по клику вне окна
  useEffect(() => {
    function handleClickOutside(event: any) {
      // @ts-ignore
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsVisible(false);
      }
    }

    if (isVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="popup-overlay fixed inset-0 z-[10001] flex items-center justify-center">
      <div
        className="popup-content relative z-[10001] max-h-[90%] w-4/5 max-w-[700px] overflow-y-auto rounded-lg bg-[#ebeded] p-8"
        ref={popupRef}
      >
        <button
          className="absolute top-2 right-3 cursor-pointer text-4xl text-black"
          onClick={() => setIsVisible(false)}
        >
          &times;
        </button>
        <h2>{t("Popup.HeaderWhen")}</h2>
        <p className="text-base text-black">{t("Popup.TextWhen")}</p>
        <div className="mt-[30px]">
          <h2>{t("Popup.HeaderWhy")}</h2>
          <p className="text-base text-black">{t("Popup.TextWhy")}</p>
        </div>
        <div className="mt-[30px] flex justify-center">
          <img
            className="max-h-[500px] object-contain"
            src="/images/aurora-popup.png"
            alt="Северное сияние"
          />
        </div>
      </div>
      <style>{`
       .popup-overlay {
          background-color: rgba(0, 0, 0, 0.5);
        }
        .popup-content h2 {
          font-size: 28px;
          margin: 0;
          color: black;
        }
        .popup-content p {
          font-size: 16px;
        }
          @media (max-width: 768px) {
            .popup-content h2 {
              font-size: 22px;
            }
          }
      `}</style>
    </div>
  );
}
