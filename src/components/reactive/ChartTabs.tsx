import * as Tabs from "@radix-ui/react-tabs";
import React from "react";
import { KpGraph3 } from "./KpGraph3";
import { KpGraph27 } from "./KpGraph27";

export const ChartTabs = () => {
  const [activeTab, setActiveTab] = React.useState("tab1");
  return (
    <Tabs.Root
      value={activeTab}
      onValueChange={setActiveTab}
      defaultValue="tab1"
    >
      <Tabs.List
        className="flex gap-5 p-5"
        aria-label="Select a tab with kp graph"
      >
        <Tabs.Trigger
          className={`border-b-2 transition-colors duration-200 ease-in-out ${activeTab === "tab1" ? "border-b-black" : ""}`}
          value="tab1"
        >
          За 3 дня
        </Tabs.Trigger>
        <Tabs.Trigger
          className={`border-b-2 transition-colors duration-200 ease-in-out ${activeTab === "tab2" ? "border-b-black" : ""}`}
          value="tab2"
        >
          За 27 дней
        </Tabs.Trigger>
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
