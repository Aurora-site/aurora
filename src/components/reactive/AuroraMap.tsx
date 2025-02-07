// @ts-nocheck
import { useEffect, useRef } from "react";
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

function getColorFromWeight(weight) {
  const t = Math.min(Math.max(weight, 0), 1);
  const gradient = [
    { stop: 0.1, color: [226, 255, 227, 1] },
    { stop: 0.2, color: [138, 245, 111, 1] },
    { stop: 0.4, color: [255, 255, 29, 1] },
    { stop: 0.6, color: [250, 137, 24, 1] },
    { stop: 1, color: [255, 67, 67, 1] },
  ];

  let lower = gradient[0],
    upper = gradient[gradient.length - 1];

  for (let i = 0; i < gradient.length - 1; i++) {
    if (t >= gradient[i].stop && t <= gradient[i + 1].stop) {
      lower = gradient[i];
      upper = gradient[i + 1];
      break;
    }
  }

  const range = upper.stop - lower.stop;
  const tNorm = range === 0 ? 0 : (t - lower.stop) / range;
  const color = lower.color.map((c, index) =>
    Math.round(c + (upper.color[index] - c) * tNorm),
  );

  return `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${color[3] * 0.02})`;
}

export function AuroraMap() {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const client = useStore(queryClient);

  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
      const tileLayer = new TileLayer({ source: new OSM() });
      const view = new View({
        center: fromLonLat([30, 70]),
        zoom: 3,
        minZoom: 3,
        maxZoom: 4.5,
        extent: transformExtent([-180, -85, 200, 85], "EPSG:4326", "EPSG:3857"),
      });

      mapRef.current = new Map({
        target: mapContainerRef.current,
        layers: [tileLayer],
        view: view,
      });
    }
  }, []);

  const { data: auroraMapData, isLoading } = useQuery(
    {
      queryKey: ["aurora-openlayers-map"],
      queryFn: async () => {
        const res = await ApiService.apiAuroraMapApiV1AuroraMapGet();
        return res.coordinates
          .filter((x) => x[2] > 5)
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
        });
        feature.setStyle(null);
        feature.set("weight", point[2]);
        vectorSource.addFeature(feature);
      });

      const vectorLayer = new VectorLayer({
        source: vectorSource,
        style: (feature) => {
          const weight = feature.get("weight");
          const color = getColorFromWeight(weight);
          const zoom = mapRef.current.getView().getZoom() || 2;
          const coordinate = feature.getGeometry().getCoordinates();
          const [lon, lat] = toLonLat(coordinate);
          const radius =
            zoom ** 1.1 * 1 * (1 + (3 * Math.abs(lat) ** 1.3) / 90);
          const alpha = 0.02 + (zoom - 2) * 0.002;

          return new Style({
            image: new CircleStyle({
              radius: radius * 1.65,
              fill: new Fill({
                color: color.replace(/\d+\.?\d*\)$/, `${alpha})`),
              }),
            }),
          });
        },
        renderMode: "image", // Использует Canvas, вместо векторного рендеринга
      });

      mapRef.current.addLayer(vectorLayer);
      mapRef.current
        .getView()
        .on("change:resolution", () => vectorLayer.changed());
    }
  }, [auroraMapData, isLoading]);

  return (
    <div className="aurora-map-container">
      <div ref={mapContainerRef} className="h-full w-full pt-[25px]"></div>

      {/* Легенда */}
      <div className="legend">
        <h4>Вероятность сияния</h4>
        {[
          { color: "rgba(226, 255, 227, 1)", label: "0% - 10%" },
          { color: "rgba(138, 245, 111, 1)", label: "10% - 20%" },
          { color: "rgba(255, 255, 29, 1)", label: "20% - 40%" },
          { color: "rgba(250, 137, 24, 1)", label: "40% - 60%" },
          { color: "rgba(255, 67, 67, 1)", label: "60% - 100%" },
        ].map(({ color, label }) => (
          <div key={label} className="legend-item">
            <div
              className="legend-color"
              style={{ backgroundColor: color }}
            ></div>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
