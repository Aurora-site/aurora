import { persistentAtom } from "@nanostores/persistent";
import type { City } from "../api/client/models/City";

interface CityValue extends Omit<City, "id"> {}

export const cityAtom = persistentAtom<CityValue>(
  "city:",
  { name: "Мурманск", lat: 69, long: 33.1 },
  {
    encode: JSON.stringify,
    decode: JSON.parse,
  },
);
