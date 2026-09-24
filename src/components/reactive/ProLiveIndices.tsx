import { useStore } from "@nanostores/react";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { queryClient } from "../../stores/query";
import { localeAtom } from "../../stores/locale";
import { useLocale } from "../../i18n/utils";
import { InfoPopover } from "./InfoPopover";
import { cn } from "../../utils/cn";

dayjs.extend(utc);

const REFRESH_MS = 5 * 60 * 1000;

const fetchJson = async <T,>(url: string): Promise<T> => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`NOAA request failed: ${res.status}`);
  }
  return res.json();
};

interface DstEntry {
  time_tag: string;
  dst: number;
}

const getDst = async () => {
  const data = await fetchJson<DstEntry[]>(
    "https://services.swpc.noaa.gov/products/kyoto-dst.json",
  );
  return data.length ? data[data.length - 1] : null;
};

interface RtswMagEntry {
  time_tag: string;
  active: boolean;
  bt: number | null;
  bz_gsm: number | null;
}

const getMag = async () => {
  const data = await fetchJson<RtswMagEntry[]>(
    "https://services.swpc.noaa.gov/json/rtsw/rtsw_mag_1m.json",
  );
  for (let i = data.length - 1; i >= 0; i--) {
    if (data[i].active) return data[i];
  }
  return data.length ? data[data.length - 1] : null;
};

interface RtswWindEntry {
  time_tag: string;
  active: boolean;
  proton_speed: number | null;
  proton_density: number | null;
}

const getWind = async () => {
  const data = await fetchJson<RtswWindEntry[]>(
    "https://services.swpc.noaa.gov/json/rtsw/rtsw_wind_1m.json",
  );
  for (let i = data.length - 1; i >= 0; i--) {
    if (data[i].active) return data[i];
  }
  return data.length ? data[data.length - 1] : null;
};

interface ScaleSub {
  Scale: string | null;
  Text: string | null;
  Prob?: string | null;
  MinorProb?: string | null;
  MajorProb?: string | null;
}
interface ScaleDay {
  DateStamp: string;
  TimeStamp: string;
  G: ScaleSub;
  S: ScaleSub;
  R: ScaleSub;
}
type ScalesResponse = Record<string, ScaleDay>;

const getScales = async () => {
  return await fetchJson<ScalesResponse>(
    "https://services.swpc.noaa.gov/products/noaa-scales.json",
  );
};

const formatUpdated = (timeTag?: string) => {
  if (!timeTag) return "—";
  return dayjs.utc(timeTag).local().format("DD.MM HH:mm");
};

const scaleColor = (scale: string | null | undefined) => {
  const n = scale ? parseInt(scale, 10) : 0;
  if (!n) return "bg-[#00972D]";
  if (n <= 1) return "bg-[#DBDB01]";
  if (n <= 3) return "bg-[#FF4A13]";
  return "bg-[#E90D0D]";
};

const Card = ({
  label,
  value,
  unit,
  info,
  updated,
}: {
  label: string;
  value: string;
  unit?: string;
  info?: React.ReactNode;
  updated?: string;
}) => (
  <div className="flex flex-col gap-1 rounded-2xl bg-white/[0.06] p-4">
    <div className="flex items-center gap-2 text-[14px] text-white/70">
      <span>{label}</span>
      {info && <InfoPopover message={info} />}
    </div>
    <div className="text-[28px] leading-tight font-bold text-white">
      {value}
      {unit && (
        <span className="ml-1 text-[16px] font-normal text-white/60">
          {unit}
        </span>
      )}
    </div>
    {updated && <div className="text-[12px] text-white/40">{updated}</div>}
  </div>
);

const ScaleRow = ({
  code,
  label,
  sub,
  info,
}: {
  code: string;
  label: string;
  sub?: ScaleSub;
  info: React.ReactNode;
}) => {
  const scale = sub?.Scale ?? null;
  const prob = sub?.Prob ?? sub?.MajorProb ?? sub?.MinorProb ?? null;
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white/[0.06] p-4">
      <div
        className={cn(
          "flex h-10 w-10 flex-none items-center justify-center rounded-full text-[16px] font-bold text-black",
          scaleColor(scale),
        )}
      >
        {code}
        {scale ?? "0"}
      </div>
      <div className="flex flex-col">
        <div className="flex items-center gap-2 text-white">
          <span className="font-semibold">{label}</span>
          <InfoPopover message={info} />
        </div>
        <div className="text-[14px] text-white/60">
          {scale !== null ? sub?.Text : prob ? `${prob}%` : (sub?.Text ?? "—")}
        </div>
      </div>
    </div>
  );
};

export const ProLiveIndices = () => {
  const t = useLocale(localeAtom);
  const client = useStore(queryClient);

  const { data: dst, isLoading: dstLoading } = useQuery(
    { queryKey: ["pro-dst"], queryFn: getDst, refetchInterval: REFRESH_MS },
    client,
  );
  const { data: mag, isLoading: magLoading } = useQuery(
    { queryKey: ["pro-mag"], queryFn: getMag, refetchInterval: REFRESH_MS },
    client,
  );
  const { data: wind, isLoading: windLoading } = useQuery(
    { queryKey: ["pro-wind"], queryFn: getWind, refetchInterval: REFRESH_MS },
    client,
  );
  const { data: scales, isLoading: scalesLoading } = useQuery(
    {
      queryKey: ["pro-scales"],
      queryFn: getScales,
      refetchInterval: REFRESH_MS,
    },
    client,
  );

  const today = scales?.["0"];
  const isLoading = dstLoading || magLoading || windLoading || scalesLoading;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card
          label={t("pro.dst.label")}
          value={dst ? `${dst.dst}` : isLoading ? "…" : "—"}
          unit="nT"
          info={t("pro.dst.info")}
          updated={dst ? `UTC ${formatUpdated(dst.time_tag)}` : undefined}
        />
        <Card
          label={t("pro.bz.label")}
          value={
            mag?.bz_gsm !== undefined && mag?.bz_gsm !== null
              ? mag.bz_gsm.toFixed(1)
              : isLoading
                ? "…"
                : "—"
          }
          unit="nT"
          info={t("pro.bz.info")}
          updated={mag ? `UTC ${formatUpdated(mag.time_tag)}` : undefined}
        />
        <Card
          label={t("pro.bt.label")}
          value={
            mag?.bt !== undefined && mag?.bt !== null
              ? mag.bt.toFixed(1)
              : isLoading
                ? "…"
                : "—"
          }
          unit="nT"
          info={t("pro.bt.info")}
          updated={mag ? `UTC ${formatUpdated(mag.time_tag)}` : undefined}
        />
        <Card
          label={t("pro.speed.label")}
          value={
            wind?.proton_speed
              ? wind.proton_speed.toFixed(0)
              : isLoading
                ? "…"
                : "—"
          }
          unit="km/s"
          info={t("pro.speed.info")}
          updated={wind ? `UTC ${formatUpdated(wind.time_tag)}` : undefined}
        />
        <Card
          label={t("pro.density.label")}
          value={
            wind?.proton_density
              ? wind.proton_density.toFixed(1)
              : isLoading
                ? "…"
                : "—"
          }
          unit="p/cm³"
          info={t("pro.density.info")}
          updated={wind ? `UTC ${formatUpdated(wind.time_tag)}` : undefined}
        />
      </div>

      <div>
        <h3 className="mb-3 text-[20px] font-semibold text-white">
          {t("pro.scales.title")}
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <ScaleRow
            code="G"
            label={t("pro.scales.g")}
            sub={today?.G}
            info={t("pro.scales.g.info")}
          />
          <ScaleRow
            code="S"
            label={t("pro.scales.s")}
            sub={today?.S}
            info={t("pro.scales.s.info")}
          />
          <ScaleRow
            code="R"
            label={t("pro.scales.r")}
            sub={today?.R}
            info={t("pro.scales.r.info")}
          />
        </div>
        {today && (
          <div className="mt-2 text-[12px] text-white/40">
            {t("pro.scales.updated")} {today.DateStamp} {today.TimeStamp} UTC
          </div>
        )}
      </div>
    </div>
  );
};
