import React from "react";

interface KpGraphProps {
  kpDays: 3 | 27;
}

export const KpGraph: React.FC<KpGraphProps> = ({ kpDays }) => {
  return (
    <>
      <div className="">Graph for {kpDays} days</div>
    </>
  );
};
