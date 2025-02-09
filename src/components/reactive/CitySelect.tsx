import { ChevronDown, Search, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../shadcn/ui/dialog";
import { useEffect, useState } from "react";
import { queryClient } from "../../stores/query";
import { useStore } from "@nanostores/react";
import { useQuery } from "@tanstack/react-query";
import { ApiService } from "../../api/client";
import { cityAtom } from "../../stores/citiy";

export const CitySelect = () => {
  const [open, setOpen] = useState(false);
  const city = useStore(cityAtom);
  const [serachQuery, setSerachQuery] = useState(city.name || "");
  const client = useStore(queryClient);
  const { data: probabilityCities } = useQuery(
    {
      queryKey: ["probability-cities"],
      queryFn: async () => {
        const res = await ApiService.apiAllCitiesApiV1AllCitiesGet();
        return res;
      },
    },
    client,
  );
  function handleSearch() {
    if (probabilityCities?.find((v) => v.name == serachQuery)) {
      setOpen(false);
    }
  }
  useEffect(() => {
    const c = probabilityCities?.find((v) => v.name == serachQuery);
    if (c) {
      cityAtom.set(c);
    }
  }, [serachQuery]);
  return (
    <div className="">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger onClick={() => setSerachQuery("")} asChild>
          <div className="flex cursor-pointer items-center gap-4 py-5 font-[SongerGrotesqueBold] text-[20px] underline">
            {city.name || "Мурманск"}
            <ChevronDown className="h-4 w-4" />
          </div>
        </DialogTrigger>
        <DialogContent className="flex flex-col">
          <DialogHeader>
            <DialogTitle className="giga-text text-center text-white">
              Геолокация
            </DialogTitle>
            <DialogDescription className="text-lg">
              На широте какого города Вы находитесь?
            </DialogDescription>
          </DialogHeader>
          <div className="py-5">
            <div className="mb-5 flex items-center gap-3 rounded-2xl bg-slate-300 px-5 py-2 text-black">
              <Search />
              <input
                placeholder="Мурманск"
                className="w-full focus:outline-none"
                value={serachQuery}
                onChange={(e) => setSerachQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
              <X
                onClick={() => setSerachQuery("")}
                className="h-4 w-4 cursor-pointer"
              />
            </div>
            <div className="grid grid-cols-2 gap-y-2 xl:w-[50%]">
              {probabilityCities
                ?.filter((v) =>
                  v.name.toLowerCase().includes(serachQuery.toLowerCase()),
                )
                .map((c, i) => (
                  <div
                    key={i.toString()}
                    onClick={() => {
                      setSerachQuery(c.name);
                      setOpen(false);
                    }}
                    className="cursor-pointer"
                  >
                    {c.name}
                  </div>
                ))}
            </div>
          </div>
          {/* <button
            onClick={handleSearch}
            className="mt-auto mb-0 flex cursor-pointer self-center rounded-full bg-slate-300 px-5 py-2 text-black"
          >
            Ok
          </button> */}
        </DialogContent>
      </Dialog>
    </div>
  );
};
