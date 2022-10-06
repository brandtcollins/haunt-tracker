import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../utils/supabaseClient";

const getHaunts = async () => {
  const { data, error } = await supabase.from("haunts").select();
  if (error) {
    throw error;
  }
  return data;
};

export const useHaunts = () => {
  return useQuery(["haunts"], getHaunts);
};
