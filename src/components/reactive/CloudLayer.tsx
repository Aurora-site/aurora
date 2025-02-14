import { useEffect, useState } from "react";
import Map from "ol/Map";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";
import { API_URL } from "astro:env/client";

interface CloudLayerProps {
  map: Map;
}

export function CloudLayer({ map }: CloudLayerProps) {
  const [cloudLayer, setCloudLayer] = useState<TileLayer<XYZ> | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!map) return;

    const existingLayer = map
      .getLayers()
      .getArray()
      .find((layer) => layer.get("cloudLayer")) as TileLayer<XYZ> | undefined;

    if (existingLayer) {
      setCloudLayer(existingLayer);
    } else {
      const newLayer = new TileLayer({
        source: new XYZ({
          url: `${API_URL}/api/v1/cloud-map/{z}/{x}/{y}`,
          attributions:
            '&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>',
        }),
        opacity: 0.9,
      });

      newLayer.set("cloudLayer", true);
      newLayer.setZIndex(2);
      map.addLayer(newLayer);
      setCloudLayer(newLayer);
    }
  }, [map]);

  const toggleLayer = () => {
    if (cloudLayer) {
      if (isVisible) {
        cloudLayer.setSource(
          new XYZ({
            url: "",
            attributions:
              '&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>',
          }),
        );
      } else {
        cloudLayer.setSource(
          new XYZ({
            url: `${API_URL}/api/v1/cloud-map/{z}/{x}/{y}`,
            attributions:
              '&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>',
          }),
        );
      }
      setIsVisible(!isVisible);
    }
  };

  return (
    <button
      onClick={toggleLayer}
      className="absolute top-[25px] right-0 z-50 rounded-lg bg-gray-400 px-4 py-1 text-white shadow-md transition hover:bg-[#218838]"
    >
      {isVisible ? "Отключить облачность" : "Включить облачность"}
    </button>
  );
}
