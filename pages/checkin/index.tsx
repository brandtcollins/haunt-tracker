import { Select } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { FunctionComponent, useEffect } from "react";
import { supabase } from "../../utils/supabaseClient";

interface CheckInProps {}

const CheckIn: FunctionComponent<CheckInProps> = () => {
  const getHauntedHouses = async () => {
    const { data, error } = await supabase.from("haunted-houses").select();
    if (error) {
      throw error;
    }

    console.log(data);

    return data;
  };
  const { data: hauntedHouseList } = useQuery(["todos"], getHauntedHouses);

  useEffect(() => {
    getHauntedHouses();
  }, []);

  return (
    <div>
      <Select placeholder="Select option">
        <option value="option1">Option 1</option>
      </Select>
    </div>
  );
};

export default CheckIn;
