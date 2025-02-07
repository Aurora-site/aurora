export const defaultLang = "ru";

export const ui = {
  ru: {
    icon: "https://flagcdn.com/w40/ru.png",
    "layout.title": "Северное сияние",
    "description.title": "Северное сияние",
    "description.how": "Карта и реальная вероятность",
    "aurora.probability": "В выбранной геолокации вероятность в ближайший час",
  },
  en: {
    icon: "https://flagcdn.com/w40/us.png",
    "layout.title": "Southern Lights",
    "description.title": "Southern Lights",
    "description.how": "How to see?",
    "aurora.probability":
      "In your location, the probability of aurora in the next hour:",
  },
  cn: {
    icon: "https://flagcdn.com/w40/cn.png",
    "description.title": "极光",
    "aurora.probability": "在您的位置，下一小时的极光概率：",
  },
} as const;
