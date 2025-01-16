import { ApiService } from "../../api/client";
import "../../api/config";

export const AuroraNow = () => {
  return (
    <div>
      <div>Сияние прямо сейчас</div>
      <div className="">
        Здесь вы можете наблюдать за динамическим отображением сияния в реальном
        времени
      </div>
      <div
        className=""
        onClick={async () => {
          console.log("Show dropdown");
          const a = await ApiService.apiAuroraMapApiV1AuroraMapGet();
          console.log(a);
        }}
      >
        Мурманск
      </div>
      <div>
        <div>В Вашей геолокации вероятность в ближайший час</div>
        <div className="text-lg">20</div>
      </div>
    </div>
  );
};
