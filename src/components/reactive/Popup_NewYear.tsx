import { useEffect, useState, useRef } from "react";
import { useLocale } from "../../i18n/utils";
import { localeAtom } from "../../stores/locale";

export default function Popup() {
  const [isVisible, setIsVisible] = useState(false);
  const popupRef = useRef(null);
  const t = useLocale(localeAtom);

  // Показываем попап через 10 секунд
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 10000);

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
        className="popup-content relative z-[10001] max-h-[90%] w-9/10 max-w-[700px] overflow-y-auto rounded-lg bg-[#DBEBE8] p-8"
        ref={popupRef}
      >
        <button
          className="absolute top-2 right-3 cursor-pointer text-4xl text-black"
          onClick={() => setIsVisible(false)}
        >
          &times;
        </button>
        <h2>Скоро Новый год, а это время подарков</h2>
        <p className="text-base text-black">
          К 31 декабря мы разыграем среди подписчиков телеграма 10 годовых
          подписок на любые платные тарифы приложения.
        </p>
        <div className="mt-[30px]">
          <h2>Следи за новостями поларлайтс в телеграм!</h2>
          <p className="text-base text-black">
            В телеграм-канале Поларлайтс размещаются прогнозы, яркие фотографии
            и полезная информация, а также ведётся обратная связь с
            пользователями сервиса и охотниками за сиянием.
          </p>
        </div>
        <div className="mt-[30px]">
          <h2>
            Следите за прогнозом на сайте или прямо в приложении – и не
            пропустите яркое сияние!
          </h2>
        </div>
        <div className="mt-[30px]">
          <h2>
            <a href="https://t.me/polarlightspro" target="_blank">
              Поларлайтс в телеграм
            </a>
          </h2>
        </div>
        <div className="mt-[30px]">
          <h2>
            <a href="https://polarlights.pro/download" target="_blank">
              Приложение с уведомлением
            </a>
          </h2>
        </div>
        <div className="mt-[30px] flex justify-center">
          <img
            className="max-h-[500px] object-contain"
            src="/images/popup_newyear.png"
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
        a {
          color: black;
          text-decoration: underline;
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
