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

type Props = {
  /** Широта точки наблюдения */
  lat: number;
  /** Долгота точки наблюдения */
  long: number;
  /** Название города в именительном падеже, например "Мурманск" — используется для предвыбора города на главной странице */
  cityName: string;
  /** Название места в предложном падеже, например "в Мурманске" */
  locationLabel: string;
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
}: Props) => {
  const client = useStore(queryClient);

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

  const updatedAt = dayjs().format("HH:mm");
  const kpColor =
    kp !== undefined ? colorFormat({ kp_index: kp }, "kp_index") : "#9CA3AF";

  const handleGoToMap = () => {
    try {
      localStorage.setItem(
        "city:",
        JSON.stringify({ name: cityName, name_ru: cityName, lat, long }),
      );
    } catch {
      // localStorage может быть недоступен (приватный режим и т.п.) —
      // в этом случае просто переходим на карту без предвыбора города.
    }
  };

  return (
    <div className="my-4 flex flex-col gap-2.5 rounded-xl bg-white/[0.06] p-4 text-left">
      <div className="text-[13px] font-semibold text-white/70">
        Прогноз {locationLabel} прямо сейчас
      </div>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        <div className="flex items-center gap-2">
          <span className="text-[13px] text-white/60">Вероятность</span>
          <span
            className={cn(
              "rounded-full px-2.5 py-0.5 text-[17px] font-bold text-black",
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
        <div className="flex items-center gap-2">
          <span className="text-[13px] text-white/60">Kp-индекс</span>
          <span
            className="rounded-full px-2.5 py-0.5 text-[17px] font-bold text-black"
            style={{ backgroundColor: kpColor }}
          >
            {kp !== undefined ? kp : kpLoading ? "…" : "—"}
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-0.5 text-[11px] text-white/40">
        <span>Обновлено: {updatedAt}</span>
        <a
          href="/#map"
          onClick={handleGoToMap}
          className="text-white/70 underline underline-offset-2"
        >
          Карта и вероятность по часам →
        </a>
      </div>
    </div>
  );
};
