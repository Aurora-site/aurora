import { useStore } from "@nanostores/react";
import { ApiService } from "../../api/client";
import "../../api/config";
import { queryClient } from "../../stores/query";
import { useGeolocation } from "../../utils/geo_utils";
import { useQuery } from "@tanstack/react-query";

export const AuroraNow = () => {
  const state = useGeolocation();
  const client = useStore(queryClient);
  const { data: auroraProbabilityData } = useQuery(
    {
      queryKey: ["auroraProbability"],
      queryFn: async () => {
        if (!state.latitude || !state.longitude) {
          throw new Error("Geo pos not allowed");
        }
        const res =
          await ApiService.apiAuroraNooaProbabilityApiV1AuroraNooaProbabilityPost(
            {
              lat: state.latitude,
              lon: state.longitude,
            },
          );
        return res;
      },
    },
    client,
  );

  return (
    <div>
      <div className="flex items-center gap-2">
        <p>В Вашей геолокации вероятность в ближайший час:</p>
        <div className="rounded-full bg-green-500 px-3 text-2xl font-bold">
          {auroraProbabilityData?.probability.toFixed(0) || "?"}%
        </div>
      </div>
    </div>
  );
};
