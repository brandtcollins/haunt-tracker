import { Select } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { FunctionComponent, useEffect } from "react";
import { useHauntedHouses } from "../../ts/hooks/useHauntedHouses";
import { iHauntedHouse } from "../../ts/Interfaces";
import { supabase } from "../../utils/supabaseClient";

interface CheckInProps {}

const getHauntedHouses = async () => {
  const { data, error } = await supabase.from("haunted-houses").select();
  if (error) {
    throw error;
  }
  return data;
};
const CheckIn: FunctionComponent<CheckInProps> = () => {
  const { data: hauntedHouseList } = useQuery<iHauntedHouse[]>(
    ["haunted-houses"],
    getHauntedHouses
  );
  //   const { data: hauntedHouseList } = useHauntedHouses();

  useEffect(() => {
    getHauntedHouses();
  }, []);

  return (
    <div>
      <Select placeholder="Select option">
        {hauntedHouseList?.map((house) => (
          <option value={house.name} key={house.haunted_house_id}>
            {house.name}
          </option>
        ))}
      </Select>
    </div>
  );
};

export default CheckIn;
