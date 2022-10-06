import { useEffect, useState } from "react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Combobox } from "@headlessui/react";
import { useHauntedHouses } from "../../../ts/hooks/useHauntedHouses";
import { iHauntedHouse } from "../../../ts/Interfaces";
import { useHaunts } from "../../../ts/hooks/useHaunts";
import { CgSearch } from "react-icons/cg";
import { useRouter } from "next/router";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function HouseSearchBox() {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const [selectedHouse, setSelectedHouse] = useState<iHauntedHouse>();
  const { data: hauntedHouseList, isLoading: hauntedHousesAreLoading } =
    useHauntedHouses();
  const { data: hauntList, isLoading: hauntsAreLoading } = useHaunts();

  const filteredHauntedHouses =
    hauntedHouseList &&
    hauntedHouseList?.filter((hauntedHouse: iHauntedHouse) => {
      return hauntedHouse.name.toLowerCase().includes(query.toLowerCase());
    });

  useEffect(() => {
    if (selectedHouse) {
      router.push(`/haunts/house/${selectedHouse.haunted_house_id}`);
    }
  }, [selectedHouse]);

  return (
    <Combobox as="div" value={selectedHouse} onChange={setSelectedHouse}>
      {/* <Combobox.Label className="block text-sm font-medium text-gray-700">
        Select Haunted House
      </Combobox.Label> */}
      <div className="relative">
        <Combobox.Input
          className="mt-1 h-12 block w-full rounded-md bg-darkGray-100 text-white border-darkGray-100 py-2 pl-3 pr-10 text-base focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 sm:text-sm"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search for a house or haunted attraction"
          displayValue={(hauntedHouse: iHauntedHouse) => {
            return hauntedHouse && hauntedHouse.name;
          }}
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none">
          <CgSearch className="h-5 w-5 text-gray-500 mr-1" aria-hidden="true" />
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
