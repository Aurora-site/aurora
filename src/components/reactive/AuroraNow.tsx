import { useStore } from "@nanostores/react";
import { ApiService } from "../../api/client";
import "../../api/config";
import { queryClient } from "../../stores/query";
import { useGeolocation } from "../../utils/geo_utils";
import { useQuery } from "@tanstack/react-query";
import { CitySelect } from "./CitySelect";
import { cityAtom } from "../../stores/citiy";
import { useEffect } from "react";
import { useTranslations } from "../../i18n/utils";
import { localeAtom } from "../../stores/locale";

export const AuroraNow = () => {
  const locale = useStore(localeAtom);
  const t = useTranslations(locale);
  // const state = useGeolocation();
  const client = useStore(queryClient);
  const city = useStore(cityAtom);
  const { data: auroraProbabilityData, refetch: refetchProbability } = useQuery(
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
        return res;
      },
    },
    client,
  );
  useEffect(() => {
    refetchProbability();
  }, [city]);
  return (
    <div>
      <CitySelect />
      <div className="flex items-center gap-2">
        <p>{t("aurora.probability")}</p>
        <div className="rounded-full bg-green-500 px-3 text-2xl font-bold">
          {auroraProbabilityData?.probability.toFixed(0) || "😶‍🌫️"}%
        </div>
      </div>
    </div>
  );
};
