import * as Tabs from "@radix-ui/react-tabs";
import { useState } from "react";
import { getKp3Data, KpGraph3 } from "./KpGraph3";
import { getKp27Data, KpGraph27 } from "./KpGraph27";
import { cn } from "../../utils/cn";
import { useLocale } from "../../i18n/utils";
import { localeAtom } from "../../stores/locale";
import { useStore } from "@nanostores/react";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "../../stores/query";

const className =
  "cursor-pointer w-40 py-1 rounded-full border-0 transition-colors duration-200 ease-in-out z-10000";

export const ChartTabs = () => {
  const [activeTab, setActiveTab] = useState("tab1");
  const t = useLocale(localeAtom);
  const client = useStore(queryClient);
  const { data: kp3Data } = useQuery(
    {
      queryKey: ["kp-graph-3"],
      queryFn: getKp3Data,
    },
    client,
  );
  const { data: kp27Data } = useQuery(
    {
      queryKey: ["kp-graph-27"],
      queryFn: getKp27Data,
    },
    client,
  );
  return (
    <Tabs.Root
      value={activeTab}
      onValueChange={setActiveTab}
      defaultValue="tab1"
      className="flex-col"
    >
      <Tabs.List
        className="flex justify-center gap-5 p-5"
        aria-label="Select a tab with kp graph"
      >
        <div className="flex justify-between gap-1 rounded-full border-2">
          <Tabs.Trigger
            className={cn(
              className,
              activeTab === "tab1" && "bg-tab-active text-white",
            )}
            value="tab1"
          >
            {t("Charts.3days")}
          </Tabs.Trigger>
          <Tabs.Trigger
            className={cn(
              className,
              activeTab === "tab2" && "bg-tab-active text-white",
            )}
            value="tab2"
          >
            {t("Charts.27days")}
          </Tabs.Trigger>
        </div>
      </Tabs.List>
      <Tabs.Content value="tab1">
        <KpGraph3 data={kp3Data} />
      </Tabs.Content>
      <Tabs.Content value="tab2">
        <KpGraph27 data={kp27Data} />
      </Tabs.Content>
    </Tabs.Root>
  );
};
