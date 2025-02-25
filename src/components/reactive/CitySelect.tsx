import { ChevronDown, Search, X, MapPin } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../shadcn/ui/dialog";
import { useEffect, useState } from "react";
import { queryClient } from "../../stores/query";
import { useStore } from "@nanostores/react";
import { useQuery } from "@tanstack/react-query";
import { ApiService } from "../../api/client";
import { cityAtom } from "../../stores/citiy";
import { useLocale } from "../../i18n/utils";
import { localeAtom } from "../../stores/locale";

export const CitySelect = () => {
  const t = useLocale(localeAtom);
  const [open, setOpen] = useState(false);
  const city = useStore(cityAtom);
  const [serachQuery, setSerachQuery] = useState(city.name || "");
  const client = useStore(queryClient);
  const { data: probabilityCities } = useQuery(
    {
      queryKey: ["probability-cities"],
      queryFn: async () => {
        const res = await ApiService.apiAllCitiesApiV1AllCitiesGet();
        return res;
      },
    },
    client,
  );
  function handleSearch() {
    const selectedCity = probabilityCities?.find((v) => v.name === serachQuery);
    if (selectedCity) {
      cityAtom.set(selectedCity);
      setOpen(false);
    }
  }
  useEffect(() => {
    const c = probabilityCities?.find((v) => v.name == serachQuery);
    if (c) {
      cityAtom.set(c);
    }
  }, [serachQuery]);

  function handleUseMyLocation() {
    setOpen(false);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          cityAtom.set({ name: t("user.Geo"), lat: latitude, long: longitude });
        },
        (error) => {
          // Обработка ошибок при получении геопозиции
          if (error.code === error.PERMISSION_DENIED) {
            // Если доступ к геопозиции был отклонен, выводим сообщение
            alert(
              "К сожалению, настройки браузера не разрешают нам показать вероятность сияния по вашей геопозиции",
            );
          } else {
            // Если произошла другая ошибка, показываем общую ошибку
            console.error("Ошибка при получении местоположения:", error);
            alert("Ошибка получения местоположения!");
          }

          setOpen(false);
        },
      );
    } else {
      // Если геолокация не поддерживается браузером
      alert("Геолокация не поддерживается в вашем браузере");
      setOpen(false); // Закрываем диалоговое окно, если геолокация не поддерживается
    }
  }

  return (
    <div className="">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger onClick={() => setSerachQuery("")} asChild>
          <div className="flex cursor-pointer items-center gap-4 py-5 font-[SongerGrotesqueBold] text-[20px]">
            <p className="font-[Montserrat] text-[16px] no-underline">
              {t("CitySelect.CityChoice")}
            </p>{" "}
            <p className="underline">{city.name || "Мурманск"}</p>
            <ChevronDown className="h-4 w-4" />
          </div>
        </DialogTrigger>
        <DialogContent className="flex flex-col">
          <DialogHeader>
            <DialogTitle className="giga-text text-center text-white">
              {t("CitySelect.Geo")}
            </DialogTitle>
            <DialogDescription className="text-lg">
              {t("CitySelect.Choice")}
            </DialogDescription>
          </DialogHeader>
          <div className="py-5">
            <div className="mb-5 flex items-center gap-3 rounded-2xl bg-slate-300 px-5 py-2 text-black">
              <Search />
              <input
                placeholder="Мурманск"
                className="w-full focus:outline-none"
                value={serachQuery}
                onChange={(e) => setSerachQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <X
                onClick={() => setSerachQuery("")}
                className="h-4 w-4 cursor-pointer"
              />
            </div>
            <button
              onClick={handleUseMyLocation}
              className="mt-[20px] mb-0 flex cursor-pointer items-center justify-between gap-2 text-white"
            >
              <MapPin className="h-5 w-5" /> {t("user.Geo")}
            </button>
          </div>
          <div className="grid grid-cols-2 gap-y-2 xl:w-[50%]">
            {probabilityCities
              ?.filter((v) =>
                v.name.toLowerCase().includes(serachQuery.toLowerCase()),
              )
              .map((c, i) => (
                <div
                  key={i.toString()}
                  onClick={() => {
                    setSerachQuery(c.name);
                    setOpen(false);
                  }}
                  className="cursor-pointer"
                >
                  {c.name}
                </div>
              ))}
          </div>
          {/* <button
            onClick={handleSearch}
            className="mt-auto mb-0 flex cursor-pointer self-center rounded-full bg-slate-300 px-5 py-2 text-black"
          >
            Ok
          </button> */}
        </DialogContent>
      </Dialog>
    </div>
  );
};
