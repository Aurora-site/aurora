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
import { useGeolocation } from "../../utils/geo_utils.ts";

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

  const location = useGeolocation();

  function handleUseMyLocation() {
    setOpen(false);

    if (location.error) {
      // Обработка ошибок
      if (location.error.code === location.error.PERMISSION_DENIED) {
        alert(
          "К сожалению, настройки браузера не разрешают нам показать вероятность сияния по вашей геопозиции",
        );
      } else {
        alert("Ошибка получения местоположения!");
      }
      return;
    }

    if (location.latitude !== null && location.longitude !== null) {
      // Передаем координаты
      cityAtom.set({
        name: t("user.Geo"),
        lat: location.latitude,
        long: location.longitude,
      });
    } else {
      alert(
        "К сожалению, настройки браузера не разрешают нам показать вероятность сияния по вашей геопозиции",
      );
    }
  }

  return (
    <div className="">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger onClick={() => setSerachQuery("")} asChild>
          <div className="flex cursor-pointer items-center gap-3 py-5 font-[SongerGrotesqueBold] text-[16px] sm:text-[20px]">
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
              className="mt-[20px] mb-0 flex cursor-pointer items-center justify-between gap-1 text-white"
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
