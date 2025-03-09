import { useEffect, useRef, useMemo } from "react";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { fromLonLat } from "ol/proj";
import { Style, Circle as CircleStyle, Fill, Text } from "ol/style";
import { useStore } from "@nanostores/react";
import { cityAtom } from "../../stores/citiy";
import { useGeolocation } from "../../utils/geo_utils";
import Map from "ol/Map";
import { localeAtom } from "../../stores/locale";

export function CitySelectMap({ map }: { map: Map | null }) {
  const city = useStore(cityAtom); // Получаем выбранный город
  const t = useStore(localeAtom); // Получаем текущую локаль
  type CityLayer = VectorLayer<VectorSource<Feature<Point>>, Feature<Point>>;
  const cityLayerRef = useRef<CityLayer>(null);
  const userLayerRef = useRef<VectorLayer>(null);
  const location = useGeolocation({ enableHighAccuracy: true });

  // const getCityName = (city: any, locale: string) => {

  //   if (locale === "en" && city.name_en) return city.name_en;
  //   if (locale === "cn" && city.name_cn) return city.name_cn;
  //   return city.name;
  // };
  const cityName = useMemo(() => {
    if (t === "en" && city.name_en) return city.name_en;
    if (t === "cn" && city.name_cn) return city.name_cn;
    return city.name; // по умолчанию возвращаем название на основном языке
  }, [city, t]);

  useEffect(() => {
    if (!map) return;
    let cityLayer = cityLayerRef.current;

    // Если слоя еще нет, создаем его
    if (!cityLayer) {
      const citySource = new VectorSource<Feature<Point>>();
      // const cityName = getCityName(city, t);

      // Создаем начальную feature для города
      const feature = new Feature({
        geometry: new Point(fromLonLat([city.long, city.lat])),
        name: cityName,
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
      if (!citySource) return;
      const features = citySource.getFeatures();

      // Находим существующую feature и обновляем её
      if (features.length > 0) {
        const feature = features[0];
        feature.setGeometry(new Point(fromLonLat([city.long, city.lat])));
        // const cityName = getCityName(city, t);
        feature.set("name", cityName);
      }
    }
  }, [map, city, t]); // Обновляем слой, когда меняется выбранный город

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
          zIndex: 5,
        });

        map.addLayer(userLayer);
        userLayerRef.current = userLayer;
      }

      const userSource = userLayer.getSource();
      if (userSource === null) return;
      userSource.clear();
      userSource.addFeature(
        new Feature({
          geometry: new Point(
            fromLonLat([location.longitude, location.latitude]),
          ),
        }),
      );
    }
  }, [map, location]);

  return null;
}
