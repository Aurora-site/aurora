import { CommonKpChart } from "./CommonKpChart";
import { colorFormat } from "../../utils/graph_utils";
import { ApiService, type NooaAuroraKp27Row } from "../../api/client";
import { useStore } from "@nanostores/react";
import { queryClient } from "../../stores/query";
import { useQuery } from "@tanstack/react-query";

const transformData = (inputData: NooaAuroraKp27Row[]) => {
  return inputData.map((data) => ({
    date: data.date,
    kp_index: data.largest_kp_index,
    fill: colorFormat(data, "largest_kp_index"),
  }));
};

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

  return <CommonKpChart data={data || []} />;
};
