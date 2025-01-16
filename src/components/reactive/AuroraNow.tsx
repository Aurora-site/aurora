import { useStore } from "@nanostores/react";
import { ApiService } from "../../api/client";
import "../../api/config";
import { queryClient } from "../../stores/query";
import { useGeolocation } from "../../utils/geo_utils";
import { useQuery } from "@tanstack/react-query";

export const AuroraNow = () => {
  const state = useGeolocation();
  const client = useStore(queryClient);
  const { data: auroraMapData } = useQuery(
    {
      queryKey: ["auroraMap"],
      queryFn: async () => {
        const a = await ApiService.apiAuroraMapApiV1AuroraMapGet();
        return a;
      },
    },
    client,
  );
  return (
    <div>
      <div>Сияние прямо сейчас</div>
      <div className="">
        Здесь вы можете наблюдать за динамическим отображением сияния в реальном
        времени
      </div>
      <div
        className=""
        onClick={async () => {
          console.log("Show dropdown");
        }}
      >
        Мурманск {state.latitude} {state.longitude}{" "}
        {auroraMapData?.["Data Format"]}
      </div>
      <div>
        <div>В Вашей геолокации вероятность в ближайший час</div>
        <div className="text-lg">20</div>
      </div>
    </div>
  );
};
