import { Input, Select, Image, Box } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { FunctionComponent, useEffect, useState } from "react";
import { iHauntedHouse } from "../ts/Interfaces";
import { supabase } from "../utils/supabaseClient";
import StarSlider from "./StarSlider";

interface CheckInProps {}

const getHauntedHouses = async () => {
  const { data, error } = await supabase.from("haunted-houses").select();
  if (error) {
    throw error;
  }
  return data;
};
const CheckIn: FunctionComponent<CheckInProps> = () => {
  const [selectedHouse, setSelectedHouse] = useState<string>("");
  const [selectedHouseObject, setSelectedHouseObject] =
    useState<iHauntedHouse>();

  const { data: hauntedHouseList } = useQuery<iHauntedHouse[]>(
    ["haunted-houses"],
    getHauntedHouses
  );

  useEffect(() => {
    setSelectedHouseObject(
      hauntedHouseList?.find(
        (house) => house.haunted_house_id === selectedHouse
      )
    );
  }, [selectedHouse]);

  return (
    <Box maxW="2xl" w="100%" p={4}>
      <Image
        src={
          selectedHouseObject
            ? `/images/${selectedHouseObject?.image}`
            : "/images/select-house.png"
        }
        alt={selectedHouseObject?.name}
      />
      <p>
        <b>What haunted house did you run?</b>
      </p>
      <Select
        placeholder="Select haunted house"
        onChange={(event) => setSelectedHouse(event.target.value)}
      >
        {hauntedHouseList?.map((house) => (
          <option value={house.haunted_house_id} key={house.haunted_house_id}>
            {house.name}
          </option>
        ))}
      </Select>
      <StarSlider />
    </Box>
  );
};

export default CheckIn;
