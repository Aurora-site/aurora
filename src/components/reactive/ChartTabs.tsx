import * as Tabs from "@radix-ui/react-tabs";
import React from "react";
import { KpGraph3 } from "./KpGraph3";
import { KpGraph27 } from "./KpGraph27";
import { cn } from "../../utils/cn";
import { useLocale } from "../../i18n/utils";
import { localeAtom } from "../../stores/locale";

const className =
  "w-40 py-1 rounded-full border-0 transition-colors duration-200 ease-in-out z-10000";

export const ChartTabs = () => {
  const [activeTab, setActiveTab] = React.useState("tab1");
  const t = useLocale(localeAtom);
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
              activeTab === "tab1" && "bg-(--color-tab-active) text-white",
            )}
            value="tab1"
          >
            {t("Charts.3days")}
          </Tabs.Trigger>
          <Tabs.Trigger
            className={cn(
              className,
              activeTab === "tab2" && "bg-(--color-tab-active) text-white",
            )}
            value="tab2"
          >
            {t("Charts.27days")}
          </Tabs.Trigger>
        </div>
      </Tabs.List>
      <Tabs.Content value="tab1">
        <KpGraph3 />
      </Tabs.Content>
      <Tabs.Content value="tab2">
        <KpGraph27 />
      </Tabs.Content>
    </Tabs.Root>
  );
};
