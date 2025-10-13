import { ChevronDown, Search, X, MapPin } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../shadcn/ui/dialog";
import { useEffect, useState, useRef } from "react";
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
  const locale = useStore(localeAtom);
  const [open, setOpen] = useState(false);
  const city = useStore(cityAtom);
  const [serachQuery, setSerachQuery] = useState(city.name || "");
  const client = useStore(queryClient);
  const { data: probabilityCities } = useQuery(
    {
      queryKey: ["probability-cities", locale],
      queryFn: async () => {
        const res = await ApiService.apiAllCitiesApiV1AllCitiesGet();
        return res;
      },
    },
    client,
  );

  function getCityName(cityObj: { [x: string]: any; name: any }) {
    return cityObj[`name_${locale}`] || cityObj.name;
  }

  const inputRef = useRef<HTMLInputElement | null>(null);

  function handleSearch() {
    const selectedCity = probabilityCities?.find(
      (v) => getCityName(v).toLowerCase() === serachQuery.toLowerCase(),
    );
    if (selectedCity) {
      cityAtom.set(selectedCity);
      setOpen(false);
    } else {
      if (inputRef.current) {
        inputRef.current.blur();
      }
    }
  }

  useEffect(() => {
    const c = probabilityCities?.find(
      (v) => getCityName(v).toLowerCase() === serachQuery.toLowerCase(),
    );
    if (c) {
      cityAtom.set(c);
    }
  }, [serachQuery, probabilityCities, locale]);

  const location = useGeolocation();

  function handleUseMyLocation() {
    setOpen(false);

    if (location.error) {
      // Обработка ошибок
      if (location.error.code === location.error.PERMISSION_DENIED) {
        alert(t("user.Alert"));
      } else {
        t("user.Error");
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
      alert(t("user.Geo"));
    }
  }

  return (
    <div className="">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger onClick={() => setSerachQuery("")} asChild>
          <div className="flex cursor-pointer items-center gap-2 py-5 font-[SongerGrotesqueBold] text-[16px] sm:text-[20px]">
            <p className="font-[Montserrat] text-[16px] no-underline">
              {t("CitySelect.CityChoice")}
            </p>{" "}
            <p className="underline">{getCityName(city) || "Мурманск"}</p>
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
                ref={inputRef}
                placeholder="Мурманск"
                className="w-full focus:outline-none"
                value={serachQuery}
                onChange={(e) => setSerachQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault(); // Предотвращаем стандартное поведение
                    handleSearch(); // Вызываем поиск
                  }
                }}
              />
              <X
                onClick={() => setSerachQuery("")}
                className="h-4 w-4 cursor-pointer"
              />
            </div>
          </div>

          <div className="grid max-h-[500px] grid-cols-1 gap-y-2 overflow-y-auto sm:grid-cols-2 xl:w-full">
            <button
              onClick={handleUseMyLocation}
              className="mb-0 flex cursor-pointer items-center gap-1 text-white underline underline-offset-3"
            >
              <MapPin className="h-5 w-5" /> {t("user.Geo")}
            </button>
            {probabilityCities
              ?.filter((v) =>
                getCityName(v)
                  .toLowerCase()
                  .includes(serachQuery.toLowerCase()),
              )
              .sort((a, b) => getCityName(a).localeCompare(getCityName(b)))
              .map((c, i) => (
                <div
                  key={i.toString()}
                  onClick={() => {
                    setSerachQuery(getCityName(c));
                    setOpen(false);
                  }}
                  className="cursor-pointer"
                >
                  {getCityName(c)}
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
