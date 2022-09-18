import { supabase } from "./supabaseClient";

export const getHauntedHouses = async () => {
  const { data, error } = await supabase.from("haunted-houses").select();
  if (error) {
    throw error;
  }
  return data;
};

export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
};
