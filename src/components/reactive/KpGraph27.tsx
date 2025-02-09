import { CommonKpChart } from "./CommonKpChart";
import { colorFormat } from "../../utils/graph_utils";
import { ApiService, type NooaAuroraKp27Row } from "../../api/client";
import { useStore } from "@nanostores/react";
import { queryClient } from "../../stores/query";
import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";

const transformData = (inputData: NooaAuroraKp27Row[]) => {
  return inputData.map((data) => ({
    date: parseDate(data.date),
    kp_index: data.largest_kp_index,
    fill: colorFormat(data, "largest_kp_index"),
  }));
};

function parseDate(date: string) {
  const a = dayjs(date);

  return `${a.format("DD.MM")} ${a
    .toDate()
    .toLocaleDateString(window.navigator.language, { weekday: "short" })}`;
}

function CustomizedXTick({
  x,
  y,
  payload,
}: {
  x: number;
  y: number;
  payload: any;
}) {
  const [date, wd] = payload.value.split(" ");
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        x={0}
        y={0}
        dy={16}
        className="text-[12px] font-semibold md:text-sm"
        fill="white"
      >
        <tspan textAnchor="middle" x="0" className="capitalize">
          {wd}
        </tspan>
        <tspan textAnchor="middle" x="0" dy="20">
          {date}
        </tspan>
      </text>
    </g>
  );
}

export const KpGraph27 = () => {
  const client = useStore(queryClient);
  const { data } = useQuery(
    {
      queryKey: ["kp-graph-27"],
      queryFn: async () => {
        const res = await ApiService.apiAuroraKpMapApiV1AuroraKp27Get();
        return transformData(res);
      },
    },
    client,
  );

  return (
    <CommonKpChart
      data={data || []}
      xTick={<CustomizedXTick x={0} y={0} payload={undefined} />}
    />
  );
};
