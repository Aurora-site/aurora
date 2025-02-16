import { useStore } from "@nanostores/react";
import { ApiService } from "../../api/client";
import "../../api/config";
import { queryClient } from "../../stores/query";
import { useQuery } from "@tanstack/react-query";
import { CitySelect } from "./CitySelect";
import { cityAtom } from "../../stores/citiy";
import { useEffect } from "react";
import { localeAtom } from "../../stores/locale";
import { useLocale } from "../../i18n/utils";
import { cn } from "../../utils/cn";

export const AuroraNow = () => {
  const t = useLocale(localeAtom);
  const client = useStore(queryClient);
  const city = useStore(cityAtom);
  const { data: auroraProbability, refetch: refetchProbability } = useQuery(
    {
      queryKey: ["auroraProbability"],
      queryFn: async () => {
        if (!city.lat || !city.long) {
          throw new Error("Geo pos not awalilable");
        }
        const res =
          await ApiService.apiAuroraNooaProbabilityApiV1AuroraNooaProbabilityPost(
            {
              lat: city.lat,
              lon: city.long,
            },
          );
        return res.probability;
      },
    },
    client,
  );
  useEffect(() => {
    refetchProbability();
  }, [city]);

  // Определяем цвет фона в зависимости от вероятности
  const getColor = (prob?: number) => {
    if (prob === undefined) return "bg-gray-400"; // Серый, если данных нет
    if (prob < 10) return "bg-green-100"; // Низкая вероятность
    if (prob < 20) return "bg-green-500"; // Низкая вероятность
    if (prob < 40) return "bg-yellow-500"; // Низкая вероятность
    if (prob < 60) return "bg-orange-500"; // Высокая вероятность
    if (prob < 100) return "bg-red-500"; // Очень высокая вероятность
    return "bg-gray-400";
  };

  return (
    <div>
      <CitySelect />
      <div className="flex items-center gap-2">
        <p>{t("aurora.probability")}</p>
        <div
          className={cn(
            `content-center rounded-full px-3 text-[16px] font-bold text-black`,
            getColor(auroraProbability),
          )}
        >
          {auroraProbability ? `${auroraProbability.toFixed(0)}%` : "😶‍🌫️"}
        </div>
      </div>
    </div>
  );
};
