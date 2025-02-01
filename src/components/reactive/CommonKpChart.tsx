import type { FC } from "react";
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
} from "recharts";

interface CommonKpChart {
  data: {
    date: string;
    kp_index: number;
    fill?: string;
  }[];
  xTick?: any;
}

export const CommonKpChart: FC<CommonKpChart> = ({
  data: transformedData,
  xTick,
}) => {
  return (
    <div className="relative overflow-x-scroll lg:overflow-x-hidden">
      <div className={"ml-[-40px] w-[300%] sm:w-[200%] lg:w-[150%] xl:w-full"}>
        <ResponsiveContainer height={464}>
          <BarChart data={transformedData} margin={{ bottom: 50 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={xTick} interval={0} />
            <YAxis domain={[0, 9]} className="fixed" />
            <Tooltip
              contentStyle={{
                borderRadius: "5px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              }}
              formatter={(value) => [value, "Kp index"]}
            />
            <Bar dataKey="kp_index" radius={((i = 6) => [i, i, 0, 0])()} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
