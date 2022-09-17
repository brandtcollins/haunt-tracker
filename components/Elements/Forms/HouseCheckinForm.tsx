import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FunctionComponent, useEffect, useState } from "react";
import { iHauntedHouse } from "../../../ts/Interfaces";
import { getHauntedHouses } from "../../../utils/HelperFunctions";
import { supabase } from "../../../utils/supabaseClient";

interface HouseCheckinFormProps {}

const HouseCheckinForm: FunctionComponent<HouseCheckinFormProps> = () => {
  //prettier-ignore
  const { data: hauntedHouseList } = useQuery<iHauntedHouse[]>(["haunted-houses"],getHauntedHouses);
  //prettier-ignore
  const [selectedHouseObject, setSelectedHouseObject] = useState<iHauntedHouse>();
  const [sliderValue, setSliderValue] = useState<number>(5);
  const queryClient = useQueryClient();
  const [currentUser, setCurrentUser] = useState<any>();
  const [selectedHouse, setSelectedHouse] = useState<string>("");

  const postCheckin = async () => {
    let checkInData = {
      haunted_house_id: selectedHouseObject?.haunted_house_id,
      rating: sliderValue,
      user_id: currentUser,
      haunted_house_name: selectedHouseObject?.name,
    };
    const { data, error } = await supabase
      .from("check-ins")
      .upsert([checkInData]);
    if (error) {
      throw error;
    }
    return data;
  };

  const mutation = useMutation(postCheckin, {
    onSuccess: () => queryClient.invalidateQueries("check-ins"),
  });

  async function getCurrentUser() {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      throw error;
    }

    if (!session?.user) {
      throw new Error("User not logged in");
    }

    setCurrentUser(session.user.id);
  }

  useEffect(() => {
    setSelectedHouseObject(
      hauntedHouseList?.find(
        (house) => house.haunted_house_id === selectedHouse
      )
    );
  }, [selectedHouse]);

  useEffect(() => {
    getCurrentUser();
  }, []);

  return (
    <>
      <label
        htmlFor="location"
        className="block text-sm font-medium text-gray-700"
      >
        What house did you just run?
      </label>
      <select
        id="location"
        name="location"
        className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
        defaultValue="Canada"
      >
        {hauntedHouseList?.map((house) => (
          <option value={house.haunted_house_id} key={house.haunted_house_id}>
            {house.name}
          </option>
        ))}
      </select>

      <label
        htmlFor="steps-range"
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
      >
        Run rating: {sliderValue}
      </label>
      <input
        id="steps-range"
        type="range"
        min="0"
        max="5"
        value={sliderValue}
        step="0.25"
        onChange={(e) => setSliderValue(+e.target.value)}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
      />
      <div className="py-4">
        <div className="relative rounded-md border border-gray-300 px-3 py-2 my-2 shadow-sm focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600">
          <label
            htmlFor="name"
            className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900"
          >
            Estimated Wait Time (Optional)
          </label>
          <input
            type="number"
            name="Estimated Wait Time"
            id="estimatedWaitTime"
            className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
            placeholder="Enter time in minutes"
          />
        </div>
      </div>
      <div>
        <div className="relative rounded-md border border-gray-300 px-3 py-2 my-2 shadow-sm focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600">
          <label
            htmlFor="name"
            className="absolute -top-2 left-2 -mt-px inline-block bg-white px-1 text-xs font-medium text-gray-900"
          >
            Actual Wait Time (Optional)
          </label>
          <input
            type="number"
            name="Actual Wait Time"
            id="actualWaitTime"
            className="block w-full border-0 p-0 text-gray-900 placeholder-gray-500 focus:ring-0 sm:text-sm"
            placeholder="Enter time in minutes"
          />
        </div>
        <div className="mt-5 sm:mt-6">
          <button
            type="button"
            className="inline-flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
            onClick={() => mutation.mutate()}
          >
            Submit Checkin
          </button>
        </div>
      </div>
    </>
  );
};

export default HouseCheckinForm;
