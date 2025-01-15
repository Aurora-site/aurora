import React from "react";

export const AuroraNow = () => {
  return (
    <div>
      <div>Сияние прямо сейчас</div>
      <div className="">
        Здесь вы можете наблюдать за динамическим отображением сияния в реальном
        времени
      </div>
      <div className="" onClick={() => console.log("Show dropdown")}>
        Мурманск
      </div>
      <div>
        <div>В Вашей геолокации вероятность в ближайший час</div>
        <div className="text-lg">20</div>
      </div>
    </div>
  );
};
