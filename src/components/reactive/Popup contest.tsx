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
    }, 20000);

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
        className="popup-content relative z-[10001] max-h-[90%] w-9/10 max-w-[700px] overflow-y-auto rounded-lg bg-[#D3DEF1] p-8"
        ref={popupRef}
      >
        <button
          className="absolute top-2 right-3 cursor-pointer text-4xl text-black"
          onClick={() => setIsVisible(false)}
        >
          &times;
        </button>
        <div className="text-base text-[12px] text-black">
          Реклама ООО “Тур на Кольский” ERID 2Vtzqw3wj3r
        </div>
        <h2>
          <a href="https://polarlights.pro" target="blank">
            Polarlights
          </a>{" "}
          и{" "}
          <a href="https://vk.com/wall-17185521_15823" target="blank">
            "Тур на Кольский"
          </a>{" "}
          разыгрывают тур с фотоохотой за северным сиянием на Кольском
          полуострове.
        </h2>
        <p className="mt-[16px] text-base text-black">
          Путешествие на Крайний Север: Териберка, этническая культура и охота
          за северным сиянием.
        </p>

        <p className="mt-[16px] text-base text-black">
          Организатор – «Тур на Кольский» (официальный, зарегистрированный
          туроператор)
        </p>
        <p className="text-base text-black">
          Информационный партнёр – Polarlights (сервис по поиску северного
          сияния).
        </p>

        <div className="mt-[25px]">
          <h2>
            <a href="https://vk.com/wall-17185521_15823" target="_blank">
              Перейти в вк и учавствовать в розыгрыше
            </a>
          </h2>
        </div>

        <div className="mt-[37px] flex justify-center">
          <img
            className="max-h-[500px] object-contain"
            src="/images/Tour_contest.png"
            alt="Розыгрыш тура!"
          />
        </div>
      </div>
      <style>{`
       .popup-overlay {
          background-color: rgba(0, 0, 0, 0.5);
        }
        .popup-content h2 {
          font-size: 24px;
          margin: 16px 0 0 0;
          color: black;
          line-height: 1.2;
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
