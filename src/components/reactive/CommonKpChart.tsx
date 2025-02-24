import type React from "react";
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
  xTick?: React.ReactNode;
}
const CustomYAxisBackground = ({
  x,
  y,
  payload,
}: {
  x: number;
  y: number;
  payload: any;
}) => {
  const isLastTick = payload.value === 9;
  const getColor = (value: number) => {
    if (value >= 4) return "#E90D0D"; // Высокий Kp
    if (value >= 2) return "#DBDB01"; // Средний Kp
    return "#00972D"; // Низкий Kp
  };

  return (
    <g>
      {/* Рисуем узкий прямоугольник для каждого диапазона Kp */}
      <rect
        x={x - -3}
        y={isLastTick ? y - 11 : y - 42}
        width={7}
        height={40}
        fill={getColor(payload.value)}
        rx={5}
        ry={5}
        opacity={1}
      />

      <text
        x={x - 7}
        y={isLastTick ? y - 6 : y}
        dy={4}
        fill="white"
        className="text-[12px] font-semibold md:text-sm"
        textAnchor="middle"
      >
        {payload.value}
      </text>
    </g>
  );
};

export const CommonKpChart: FC<CommonKpChart> = ({
  data: transformedData,
  xTick,
}) => {
  return (
    <div className="relative overflow-x-scroll lg:overflow-x-hidden">
      <div
        className={
          "ml-[-40px] w-[300%] text-black sm:w-[200%] lg:w-[150%] xl:w-full"
        }
      >
        <ResponsiveContainer height={464}>
          <BarChart data={transformedData} margin={{ bottom: 50 }}>
            <CartesianGrid strokeDasharray="3 3" />
            {/* @ts-ignore */}
            <XAxis dataKey="date" tick={xTick} interval={0} />
            <YAxis
              domain={[0, 9]}
              tick={<CustomYAxisBackground x={0} y={0} payload={undefined} />} // Используем кастомный компонент
              axisLine={false} // Отключаем стандартную ось
              tickLine={false} // Отключаем линии тиков
              ticks={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "5px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
              }}
              offset={-150}
              formatter={(value) => [value, "Kp index"]}
              cursor={{ fill: "var(--color-stone-700)", opacity: 0.5 }}
            />
            <Bar dataKey="kp_index" radius={((i = 6) => [i, i, 0, 0])()} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
