import { useStore } from "@nanostores/react";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { ApiService } from "../../api/client";
import "../../api/config";
import { queryClient } from "../../stores/query";
import { colorFormat } from "../../utils/graph_utils";
import { cn } from "../../utils/cn";

dayjs.extend(utc);
dayjs.extend(customParseFormat);

const REFRESH_MS = 5 * 60 * 1000;

type CityNowLang = "ru" | "en" | "cn";

type Props = {
  /** Широта точки наблюдения */
  lat: number;
  /** Долгота точки наблюдения */
  long: number;
  /** Название города в именительном падеже, например "Мурманск" — используется для предвыбора города на главной странице */
  cityName: string;
  /** Название места в предложном падеже, например "в Мурманске" (для en/cn — уже готовая фраза для вставки в LABELS.title) */
  locationLabel: string;
  /** Язык блока. По умолчанию "ru" — поведение не меняется для существующих страниц. */
  lang?: CityNowLang;
  /** Имя города на английском (именительный падеж), например "Teriberka" — для корректного предвыбора города на главной при переходе с en/cn-страниц */
  nameEn?: string;
  /** Имя города на китайском (именительный падеж), например "捷里别尔卡" */
  nameCn?: string;
};

const LABELS: Record<
  CityNowLang,
  {
    title: (locationLabel: string) => string;
    probability: string;
    kp: string;
    updatedPrefix: string;
    mapLink: string;
  }
> = {
  ru: {
    title: (locationLabel) => `Прогноз ${locationLabel} прямо сейчас`,
    probability: "Вероятность",
    kp: "Kp-индекс",
    updatedPrefix: "Обновлено: ",
    mapLink: "Карта и вероятность по часам →",
  },
  en: {
    title: (locationLabel) => `Aurora forecast ${locationLabel} right now`,
    probability: "Probability",
    kp: "Kp index",
    updatedPrefix: "Updated: ",
    mapLink: "Map and hourly probability →",
  },
  cn: {
    title: (locationLabel) => `${locationLabel}北极光实时预报`,
    probability: "出现概率",
    kp: "Kp指数",
    updatedPrefix: "更新时间：",
    mapLink: "地图与每小时概率 →",
  },
};

const getProbabilityColor = (prob?: number) => {
  if (prob === undefined) return "bg-gray-400";
  if (prob < 10) return "bg-green-100";
  if (prob < 20) return "bg-green-500";
  if (prob < 40) return "bg-yellow-500";
  if (prob < 60) return "bg-orange-500";
  if (prob <= 100) return "bg-red-500";
  return "bg-gray-400";
};

/**
 * NOAA отдаёт прогноз Kp на 3 суток вперёд порциями по 3 часа (UTC).
 * "Текущий" Kp — это значение того 3-часового окна, которое уже началось
 * и ближе всего к настоящему моменту (последнее окно, старт которого <= сейчас).
 */
const getCurrentKp = async (): Promise<number | undefined> => {
  const res = await ApiService.apiAuroraKp3ApiV1AuroraKp3Get();
  const nowMs = dayjs().valueOf();
  let bestMs: number | undefined;
  let bestKp: number | undefined;

  for (const dateEntry of res) {
    for (const value of dateEntry.values) {
      const hour = parseInt(value.time.slice(0, 2), 10);
      const localMs = dayjs
        .utc(`${dateEntry.date} ${hour}`, "MMM DD HH")
        .local()
        .valueOf();

      if (localMs <= nowMs && (bestMs === undefined || localMs > bestMs)) {
        bestMs = localMs;
        bestKp = value.kp_index;
      }
    }
  }

  return bestKp;
};

export const CityAuroraNow = ({
  lat,
  long,
  cityName,
  locationLabel,
  lang = "ru",
  nameEn,
  nameCn,
}: Props) => {
  const client = useStore(queryClient);
  const t = LABELS[lang];

  const { data: probability, isLoading: probLoading } = useQuery(
    {
      queryKey: ["cityAuroraNowProbability", lat, long],
      queryFn: async () => {
        const res =
          await ApiService.apiAuroraNooaProbabilityApiV1AuroraNooaProbabilityPost(
            { lat, lon: long },
          );
        return res.probability;
      },
      refetchInterval: REFRESH_MS,
    },
    client,
  );

  const { data: kp, isLoading: kpLoading } = useQuery(
    {
      queryKey: ["cityAuroraNowKp"],
      queryFn: getCurrentKp,
      refetchInterval: REFRESH_MS,
    },
    client,
  );

  const updatedAt = dayjs().format("DD.MM.YYYY HH:mm");
  const kpColor =
    kp !== undefined ? colorFormat({ kp_index: kp }, "kp_index") : "#9CA3AF";
  const mapHref = lang === "ru" ? "/#map" : `/${lang}/#map`;

  const handleGoToMap = () => {
    try {
      const localizedName =
        lang === "en"
          ? nameEn || cityName
          : lang === "cn"
            ? nameCn || cityName
            : cityName;
      localStorage.setItem(
        "city:",
        JSON.stringify({
          name: localizedName,
          name_ru: cityName,
          name_en: nameEn || cityName,
          name_cn: nameCn || cityName,
          lat,
          long,
        }),
      );
    } catch {
      // localStorage может быть недоступен (приватный режим и т.п.) —
      // в этом случае просто переходим на карту без предвыбора города.
    }
  };

  return (
    <div className="my-4 flex flex-col gap-2.5 rounded-xl bg-white/[0.06] p-4 text-left md:bg-transparent">
      <div className="text-[13px] font-semibold text-white/70 md:text-[16px]">
        {t.title(locationLabel)}
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <span className="w-[100px] text-[13px] text-white/60 md:w-[140px] md:text-[16px]">
            {t.probability}
          </span>
          <span
            className={cn(
              "rounded-full px-3 py-0.5 text-[20px] font-bold text-black",
              getProbabilityColor(probability),
            )}
          >
            {probability !== undefined
              ? `${probability.toFixed(0)}%`
              : probLoading
                ? "…"
                : "—"}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="w-[100px] text-[13px] text-white/60 md:w-[140px] md:text-[16px]">
            {t.kp}
          </span>
          <span
            className="rounded-full px-3 py-0.5 text-[20px] font-bold text-black"
            style={{ backgroundColor: kpColor }}
          >
            {kp !== undefined ? kp : kpLoading ? "…" : "—"}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-0.5 text-[11px] text-white/40">
        <span>
          {t.updatedPrefix}
          {updatedAt}
        </span>
        <a
          href={mapHref}
          onClick={handleGoToMap}
          className="text-[11px] text-white/70 underline underline-offset-2 md:text-[16px]"
        >
          {t.mapLink}
        </a>
      </div>
    </div>
  );
};
