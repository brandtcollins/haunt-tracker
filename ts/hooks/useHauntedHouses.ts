import { useQuery } from "react-query";
import { supabase } from "../../utils/supabaseClient";

const getHauntedHouses = async () => {
  const { data, error } = await supabase.from("haunted-houses").select();
  if (error) {
    throw error;
  }
  return data;
};

export const useHauntedHouses = () => {
  return useQuery(["haunted-houses"], getHauntedHouses);
};
