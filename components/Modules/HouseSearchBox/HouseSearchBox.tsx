import { useEffect, useState } from "react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Combobox } from "@headlessui/react";
import { useHauntedHouses } from "../../../ts/hooks/useHauntedHouses";
import { iHauntedHouse } from "../../../ts/Interfaces";
interface iPeople {
  id: number;
  name: string;
}

const people = [
  { id: 1, name: "Leslie Alexander" },
  { id: 2, name: "Eslie Alexander" },
  { id: 3, name: "Slie Alexander" },
  { id: 4, name: "Lie Alexander" },
];

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function HouseSearchBox() {
  const [query, setQuery] = useState("");
  const [selectedHouse, setSelectedHouse] = useState();
  const { data: hauntedHouseList } = useHauntedHouses();

  useEffect(() => {
    console.log(selectedHouse);
  }, [selectedHouse]);

  const filteredHauntedHouses =
    hauntedHouseList &&
    hauntedHouseList?.filter((hauntedHouse: iHauntedHouse) => {
      return hauntedHouse.name.toLowerCase().includes(query.toLowerCase());
    });

  return (
    <Combobox as="div" value={selectedHouse} onChange={setSelectedHouse}>
      <Combobox.Label className="block text-sm font-medium text-gray-700">
        Select Haunted House
      </Combobox.Label>
      <div className="relative mt-1">
        <Combobox.Input
          className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 sm:text-sm"
          onChange={(event) => setQuery(event.target.value)}
          displayValue={(hauntedHouse: iHauntedHouse) => {
            return hauntedHouse ? hauntedHouse.name : "Search for a house";
          }}
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <ChevronUpDownIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </Combobox.Button>

        {filteredHauntedHouses && filteredHauntedHouses.length > 0 && (
          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredHauntedHouses.map((hauntedHouse: iHauntedHouse) => (
              <Combobox.Option
                key={hauntedHouse.haunted_house_id}
                value={hauntedHouse}
                className={({ active }) =>
                  classNames(
                    "relative cursor-default select-none py-2 pl-3 pr-9",
                    active ? "bg-emerald-600 text-white" : "text-gray-900"
                  )
                }
              >
                {({ active, selected }) => (
                  <>
                    <span
                      className={classNames(
                        "block truncate",
                        selected && "font-semibold"
                      )}
                    >
                      {hauntedHouse.name}
                    </span>

                    {selected && (
                      <span
                        className={classNames(
                          "absolute inset-y-0 right-0 flex items-center pr-4",
                          active ? "text-white" : "text-emerald-600"
                        )}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}
      </div>
    </Combobox>
  );
}
