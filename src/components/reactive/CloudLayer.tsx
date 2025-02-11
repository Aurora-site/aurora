// import { useEffect } from "react";
// import TileLayer from "ol/layer/Tile";
// import XYZ from "ol/source/XYZ";

// interface CloudLayerProps {
//   map: Map;
// }

// export function CloudLayer({ map }: CloudLayerProps) {
//   useEffect(() => {
//     if (!map) return;

//     // Проверяем, есть ли уже слой облачности
//     const existingLayer = map.getLayers().getArray().find(layer => layer.get("cloudLayer"));
//     if (existingLayer) return;

//     const cloudLayer = new TileLayer({
//       source: new XYZ({
//         url: `https://tile.openweathermap.org/map/clouds/{z}/{x}/{y}.png?appid=465006493dabc8b093c1923a5e06a9ee`,
//         attributions: '&copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>',
//       }),
//       opacity: 0.9,
//     });

//     cloudLayer.set("cloudLayer", true);
//     map.addLayer(cloudLayer);
//   }, [map]);

//   return null;
// }
import { useEffect, useState } from "react";
import Map from "ol/Map";
import TileLayer from "ol/layer/Tile";
import XYZ from "ol/source/XYZ";

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
          url: `https://tile.openweathermap.org/map/clouds/{z}/{x}/{y}.png?appid=9c1245d7a03fd077c96bc10fa072abec`,
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
      cloudLayer.setVisible(!isVisible);
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
