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
}

export const CommonKpChart: FC<CommonKpChart> = ({ data: transformedData }) => {
  return (
    <ResponsiveContainer height={464}>
      <BarChart data={transformedData} margin={{ bottom: 50 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 12 }}
          angle={-45}
          textAnchor="end"
          // tickMargin={}
        />
        <YAxis domain={[0, 9]} />
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
  );
};
