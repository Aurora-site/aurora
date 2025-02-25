// @ts-nocheck
import { useEffect, useRef, useState } from "react";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { fromLonLat } from "ol/proj";
import { Style, Circle as CircleStyle, Fill, Text } from "ol/style";
import { useStore } from "@nanostores/react";
import { cityAtom } from "../../stores/citiy";
import { useGeolocation } from "../../utils/geo_utils";

export function CitySelectMap({ map }) {
  const city = useStore(cityAtom); // Получаем выбранный город
  const cityLayerRef = useRef<VectorLayer<
    VectorSource<Feature<Point>>,
    Feature<Point>
  > | null>(null);
  const userLayerRef = useRef(null);
  const location = useGeolocation({ enableHighAccuracy: true });

  useEffect(() => {
    if (map) {
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
                offsetY: -12,
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
    if (
      map &&
      !location.loading &&
      location.latitude !== null &&
      location.longitude !== null
    ) {
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

      const userSource = userLayer.getSource();
      userSource.clear();

      const userFeature = new Feature({
        geometry: new Point(
          fromLonLat([location.longitude, location.latitude]),
        ),
      });

      userSource.addFeature(userFeature);
    }
  }, [map, location.latitude, location.longitude, location.loading]);

  return null;
}
