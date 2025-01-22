import { useQuery } from "@tanstack/react-query";

import { ApiService, type NooaAuroraKp3Col } from "../../api/client";
import "../../api/config";
import { queryClient } from "../../stores/query";
import { useStore } from "@nanostores/react";
import { CommonKpChart } from "./CommonKpChart";
import { colorFormat } from "../../utils/graph_utils";

const transformData = (inputData: NooaAuroraKp3Col[]) => {
  return inputData.flatMap((dateEntry) =>
    dateEntry.values.map((value) => ({
      date: value.time + " " + dateEntry.date,
      kp_index: value.kp_index,
      fill: colorFormat(value, "kp_index"),
    })),
  );
};

export const KpGraph3 = () => {
  const client = useStore(queryClient);
  const { data } = useQuery(
    {
      queryKey: ["kp-graph-3"],
      queryFn: async () => {
        const res = await ApiService.apiAuroraKp3ApiV1AuroraKp3Get();
        return transformData(res);
      },
    },
    client,
  );
  return <CommonKpChart data={data || []} />;
};
