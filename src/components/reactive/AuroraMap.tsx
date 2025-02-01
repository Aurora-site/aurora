import React, { useEffect, useRef } from "react";
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
import "ol/ol.css";

// Функция для вычисления цвета с прозрачностью 50%
function getColorFromWeight(weight) {
  const t = Math.min(Math.max(weight, 0), 1);
  const gradient = [
    { stop: 0.1, color: [226, 255, 227, 1] }, // бело-зелёный
    { stop: 0.2, color: [138, 245, 111, 1] }, // Зелёный
    { stop: 0.4, color: [255, 255, 29, 1] }, // Жёлтый
    { stop: 0.6, color: [250, 137, 24, 1] }, // Оранжевый
    { stop: 1, color: [255, 67, 67, 1] }, // Красный
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
  const tNorm = range === 0 ? 0 : (t - lower.stop) / range; // Защита от деления на 0

  const color = lower.color.map((c, index) =>
    Math.round(c + (upper.color[index] - c) * tNorm),
  );

  // Делаем прозрачность 50% от вычисленной
  const alpha = color[3] * 0.1;

  return `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha})`;
}

export function AuroraMap() {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const client = useStore(queryClient);

  const { data: auroraMapData, isLoading } = useQuery(
    {
      queryKey: ["aurora-openlayers-map"],
      queryFn: async () => {
        const res = await ApiService.apiAuroraMapApiV1AuroraMapGet();
        // Фильтруем и нормируем значение "weight" (нормировка зависит от ваших данных)
        return res.coordinates
          .filter((x) => x[2] > 10)
          .map((x) => [x[1], x[0] > 180 ? x[0] - 360 : x[0], x[2] / 100]); // нормировка значения weight
      },
    },
    client,
  );

  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current && !isLoading) {
      const vectorSource = new VectorSource();

      // Добавляем фичи с сохранением значения вероятности
      auroraMapData.forEach((point) => {
        const feature = new Feature({
          geometry: new Point(fromLonLat([point[1], point[0]])),
        });
        feature.set("weight", point[2]); // значение должно быть от 0 до 1
        vectorSource.addFeature(feature);
      });

      // Создаём векторный слой с функцией стиля, которая учитывает зум и широту точки
      const vectorLayer = new VectorLayer({
        source: vectorSource,
        style: (feature) => {
          const weight = feature.get("weight");
          const color = getColorFromWeight(weight);
          // Получаем текущий зум карты
          const zoom = mapRef.current.getView().getZoom() || 2;

          // Получаем координаты фичи в проекции карты и преобразуем в lon/lat
          const coordinate = feature.getGeometry().getCoordinates();
          const [lon, lat] = toLonLat(coordinate);

          // Можно задать корректировку радиуса в зависимости от широты.
          // Например, чем дальше от экватора (больше |lat|), тем больше радиус.
          // Здесь радиус вычисляется как базовый размер, зависящий от зума,
          // умноженный на коэффициент (1 + |lat|/90), где 90 — максимальное значение широты.
          const radius = zoom * 1.5 * (1 + (3 * Math.abs(lat) ** 1.2) / 90);

          return new Style({
            image: new CircleStyle({
              radius,
              fill: new Fill({ color }),
            }),
          });
        },
      });

      const tileLayer = new TileLayer({
        source: new OSM(),
      });
      const view = new View({
        center: fromLonLat([30, 70]),
        zoom: 3,
        minZoom: 3,
        maxZoom: 4.5,
        extent: transformExtent([-180, -85, 180, 85], "EPSG:4326", "EPSG:3857"),
      });

      mapRef.current = new Map({
        target: mapContainerRef.current,
        layers: [tileLayer, vectorLayer],
        view: view,
      });

      // Обновляем стили при изменении зума
      mapRef.current.getView().on("change:resolution", () => {
        vectorLayer.changed();
      });
    }
  }, [auroraMapData, isLoading]);

  return (
    <div
      ref={mapContainerRef}
      style={{ width: "100%", height: "500px", paddingTop: "25px" }}
    ></div>
  );
}
