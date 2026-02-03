import { ApiService, type NooaAuroraKp3Col } from "../../api/client";
import "../../api/config";
import { CommonKpChart } from "./CommonKpChart";
import { colorFormat } from "../../utils/graph_utils";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import customParseFormat from "dayjs/plugin/customParseFormat";

export function formatDate(time: string, date: string) {
  dayjs.extend(utc);
  dayjs.extend(customParseFormat);

  const hour = parseInt(time.slice(0, 2), 10);
  const utcDateTime = dayjs.utc(`${date} ${hour}`, "MMM DD HH");
  const local = utcDateTime.local();

  return `${local.format("DD.MM")} ${local.format("HH")}:00`;
}

const transformData = (inputData: NooaAuroraKp3Col[]) => {
  return inputData.flatMap((dateEntry) =>
    dateEntry.values.map((value) => ({
      date: formatDate(value.time, dateEntry.date),
      kp_index: value.kp_index,
      fill: colorFormat(value, "kp_index"),
    })),
  );
};

function CustomizedXTick({
  x,
  y,
  payload,
}: {
  x: number;
  y: number;
  payload: any;
}) {
  const [date, time] = payload.value.split(" ");
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={16}
        className="text-[12px] font-semibold md:text-sm"
        fill="white"
      >
        <tspan textAnchor="middle" x="0">
          {time}
        </tspan>
        <tspan textAnchor="middle" x="0" dy="20">
          {date}
        </tspan>
      </text>
    </g>
  );
}

export const getKp3Data = async () => {
  const res = await ApiService.apiAuroraKp3ApiV1AuroraKp3Get();
  return transformData(res);
};

export const KpGraph3 = ({
  data,
}: {
  data?: {
    date: string;
    kp_index: number;
    fill: string;
  }[];
}) => {
  return (
    <CommonKpChart
      data={data || []}
      xTick={<CustomizedXTick x={0} y={0} payload={undefined} />}
    />
  );
};
