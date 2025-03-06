import { useEffect, useRef, useState } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { fromLonLat, toLonLat, transformExtent } from "ol/proj";
import { Style, Circle as CircleStyle, Fill } from "ol/style";
import OSM from "ol/source/OSM";
import { useStore } from "@nanostores/react";
import { queryClient } from "../../stores/query";
import { useQuery } from "@tanstack/react-query";
import { ApiService } from "../../api/client";
import "../../api/config";
import "ol/ol.css";
import "/src/styles/AuroraMap.css";
import { useLocale } from "../../i18n/utils";
import { localeAtom } from "../../stores/locale";
import { CloudLayer } from "./CloudLayer"; // Импортируем слой облачности
import { CitySelectMap } from "./CitySelectMap";
import { API_URL } from "astro:env/client";

export const colorMap = [
  {
    stop: 0.1,
    color: [226, 255, 227, 1],
    rgbaColor: "rgba(226, 255, 227, 1)",
    label: "0% - 10%",
  },
  {
    stop: 0.2,
    color: [138, 245, 111, 1],
    rgbaColor: "rgba(138, 245, 111, 1)",
    label: "10% - 20%",
  },
  {
    stop: 0.4,
    color: [255, 255, 29, 1],
    rgbaColor: "rgba(255, 255, 29, 1)",
    label: "20% - 40%",
  },
  {
    stop: 0.6,
    color: [250, 137, 24, 1],
    rgbaColor: "rgba(250, 137, 24, 1)",
    label: "40% - 60%",
  },
  {
    stop: 1,
    color: [255, 67, 67, 1],
    rgbaColor: "rgba(255, 67, 67, 1)",
    label: "60% - 100%",
  },
] as const;

type Writeable<T> = { -readonly [P in keyof T]: T[P] };

export function getColorFromWeight(weight: number, alpha?: number) {
  const t = Math.min(Math.max(weight, 0), 1);

  let lower = colorMap[0];
  let upper = colorMap[colorMap.length - 1];

  for (let i = 0; i < colorMap.length - 1; i++) {
    if (t >= colorMap[i].stop && t <= colorMap[i + 1].stop) {
      lower = colorMap[i] as Writeable<(typeof colorMap)[0]>;
      upper = colorMap[i + 1];
      break;
    }
  }

  const range = upper.stop - lower.stop;
  const tNorm = range === 0 ? 0 : (t - lower.stop) / range;
  const color = lower.color.map((c, index) =>
    Math.round(c + (upper.color[index] - c) * tNorm),
  );

  return `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha || color[3] * 0.02})`;
}

export function AuroraMap() {
  const mapContainerRef = useRef(null);
  const mapRef = useRef<Map>(null);
  const client = useStore(queryClient);
  const t = useLocale(localeAtom);
  const [isMapReady, setIsMapReady] = useState(false); // Флаг, готова ли карта

  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      mapRef.current = new Map({
        target: mapContainerRef.current,
        layers: [
          new TileLayer({
            source: new OSM({
              url: `${API_URL}/api/v1/proxy/osm-tile-map/{z}/{x}/{y}.png`,
            }),
          }),
        ],
        view: new View({
          center: fromLonLat([30, 70]),
          zoom: 3,
          minZoom: 3,
          maxZoom: 5,
          extent: transformExtent(
            [-180, -85, 200, 85],
            "EPSG:4326",
            "EPSG:3857",
          ),
        }),
      });
      setTimeout(() => setIsMapReady(true), 0);
    }
  }, []);

  const { data: auroraMapData, isLoading } = useQuery(
    {
      queryKey: ["aurora-openlayers-map"],
      queryFn: async () => {
        const res = await ApiService.apiAuroraMapApiV1AuroraMapGet();
        return res.coordinates
          .filter((x) => x[2] > 7)
          .sort((a, b) => b[2] - a[2]) // Сортируем по интенсивности
          .slice(0, 7000) // Ограничиваем количество точек
          .map((x) => [x[1], x[0] > 180 ? x[0] - 360 : x[0], x[2] / 100]);
      },
    },
    client,
  );

  useEffect(() => {
    if (mapRef.current && auroraMapData && !isLoading) {
      const vectorSource = new VectorSource();
      auroraMapData.forEach((point) => {
        const feature = new Feature({
          geometry: new Point(fromLonLat([point[1], point[0]])),
          weight: point[2],
        });
        vectorSource.addFeature(feature);
      });

      const vectorLayer = new VectorLayer({
        source: vectorSource,
        style: (feature) => {
          const weight = feature.get("weight");
          const zoom = mapRef.current?.getView().getZoom() || 2;
          const point = feature?.getGeometry() as unknown as {
            flatCoordinates: number[];
          };
          const coordinate = point.flatCoordinates;
          const [_, lat] = toLonLat(coordinate);
          const radius =
            zoom ** 1.1 * 1 * (1 + (3 * Math.abs(lat) ** 1.3) / 90);
          const alpha = 0.02 + (zoom - 2) * 0.002;
          const color = getColorFromWeight(weight, alpha);

          return new Style({
            image: new CircleStyle({
              radius: radius * 1.65,
              fill: new Fill({
                color: color,
              }),
            }),
          });
        },
      });
      vectorLayer.setZIndex(1);

      mapRef.current.addLayer(vectorLayer);
      mapRef.current
        .getView()
        .on("change:resolution", () => vectorLayer.changed());
    }
  }, [auroraMapData, isLoading]);

  return (
    <div className="relative h-[500px] text-black">
      <div ref={mapContainerRef} className="h-full w-full pt-[25px]"></div>

      {isMapReady && (
        <>
          <CloudLayer map={mapRef.current} />
          <CitySelectMap map={mapRef.current} />
        </>
      )}

      <div className="absolute right-[198px] bottom-[58px] rounded-lg text-[12px]">
        <h4 className="mr-[-10px] text-center text-[12px]">
          {t("MapSection.Tooltip")}
        </h4>
      </div>
      <div className="absolute right-0 bottom-[16px] flex w-[316px] items-center bg-white pt-1 pl-1 text-[10px] opacity-80">
        {colorMap.map(({ rgbaColor, label }) => (
          <div key={label} className="mb-[5px] flex items-center">
            <div
              className="mr-[10px] h-[15px] w-[15px] rounded-sm"
              style={{ backgroundColor: rgbaColor }}
            ></div>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
