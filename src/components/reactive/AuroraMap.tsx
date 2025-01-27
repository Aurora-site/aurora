import { useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { useStore } from "@nanostores/react";
import { queryClient } from "../../stores/query";
import { useQuery } from "@tanstack/react-query";
import { HeatmapLayer } from "react-leaflet-heatmap-layer-v3";
import { ApiService } from "../../api/client";
import "../../api/config";
import "leaflet/dist/leaflet.css";

export function AuroraMap() {
  const client = useStore(queryClient);
  const { data: auroraMapData, isLoading } = useQuery(
    {
      queryKey: ["aurora-leaflet-map"],
      queryFn: async () => {
        const res = await ApiService.apiAuroraMapApiV1AuroraMapGet();
        setTimeout(() => {
          setref(ref + 1); // force update cuz react-heatmap is cringe
        }, 100);
        const transformedRes = res.coordinates
          .filter((x) => x[2] > 7)
          .map((x) => [x[1], x[0] - 180, x[2]]);
        return transformedRes;
      },
    },
    client,
  );
  const [ref, setref] = useState(0);
  return (
    <div className="py-5">
      <div className="bg-slate-600">
        <MapContainer center={[70, 50]} zoom={2}>
          {!isLoading && (
            <HeatmapLayer
              points={auroraMapData}
              longitudeExtractor={(m: number[]) => m[1]}
              latitudeExtractor={(m: number[]) => m[0]}
              intensityExtractor={(m: number[]) => m[2]}
              radius={8}
              blur={25}
              maxOpacity={1}
              minOpacity={0.1}
            />
          )}
          <TileLayer
            url={"https://tile.openstreetmap.org/{z}/{x}/{y}.png"}
            attribution={
              '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }
          />
        </MapContainer>
      </div>
    </div>
  );
}
