// @ts-nocheck
import { useEffect, useRef, useState } from "react";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { fromLonLat } from "ol/proj";
import { Style, Circle as CircleStyle, Fill, Text, Stroke } from "ol/style";
import { useStore } from "@nanostores/react";
import { cityAtom } from "../../stores/citiy";

export function CitySelectMap({ map }) {
  const city = useStore(cityAtom); // Получаем выбранный город
  const cityLayerRef = useRef<VectorLayer<
    VectorSource<Feature<Point>>,
    Feature<Point>
  > | null>(null);
  const userLayerRef = useRef(null);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    if (map) {
      // Проверяем, существует ли слой города
      let cityLayer = cityLayerRef.current;

      // Если слоя еще нет, создаем его
      if (!cityLayer) {
        const citySource = new VectorSource<Feature<Point>>();

        // Создаем начальную feature для города
        const feature = new Feature({
          geometry: new Point(fromLonLat([city.long, city.lat])),
          name: city.name,
        });
        citySource.addFeature(feature);

        // Создаем слой с городом
        cityLayer = new VectorLayer({
          source: citySource,
          style: (feature) =>
            new Style({
              image: new CircleStyle({
                radius: 3,
                fill: new Fill({ color: "black" }),
              }),
              text: new Text({
                text: feature.get("name"),
                font: "12px 'Montserrat', sans-serif",
                fill: new Fill({ color: "black" }),
                offsetY: -10,
              }),
            }),
        });

        cityLayer.setZIndex(3);
        cityLayer.set("name", "cityLayer");
        map.addLayer(cityLayer);

        // Сохраняем ссылку на слой для дальнейших изменений
        cityLayerRef.current = cityLayer;
      } else {
        // Если слой уже существует, обновляем данные
        const citySource = cityLayer.getSource();
        const features = citySource.getFeatures();

        // Находим существующую feature и обновляем её
        if (features.length > 0) {
          const feature = features[0];
          feature.setGeometry(new Point(fromLonLat([city.long, city.lat])));
          feature.set("name", city.name);
        }
      }
    }
  }, [map, city]); // Обновляем слой, когда меняется выбранный город

  useEffect(() => {
    if (map) {
      let userLayer = userLayerRef.current;

      if (!userLayer) {
        const userSource = new VectorSource();
        userLayer = new VectorLayer({
          source: userSource,
          style: new Style({
            image: new CircleStyle({
              radius: 6,
              fill: new Fill({ color: "blue" }),
            }),
          }),
        });

        userLayer.setZIndex(4);
        userLayer.set("name", "userLayer");
        map.addLayer(userLayer);

        userLayerRef.current = userLayer;
      }

      // Получаем координаты пользователя
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([longitude, latitude]);

          const userSource = userLayer.getSource();
          userSource.clear(); // Убираем старую точку

          const userFeature = new Feature({
            geometry: new Point(fromLonLat([longitude, latitude])),
          });

          userSource.addFeature(userFeature);
        },
        (error) => {
          console.error("Ошибка получения геолокации:", error);
        },
      );
    }
  }, [map]);

  return null;
}
