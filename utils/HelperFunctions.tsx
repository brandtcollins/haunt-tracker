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

export const getCheckins = async (userId: string | null) => {
  try {
    let { data, error, status } = await supabase
      .from("check-ins")
      .select(
        "*, user: profiles(username, avatar_url), haunted_houses: haunted-houses(*)"
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: true });

    if (error && status !== 406) {
      throw error;
    }

    if (data) {
      return data;
    }
  } catch (error) {
    if (error instanceof Error) {
      alert(error.message);
    }
  }
};

export const getUserID = async (username: string | string[] | undefined) => {
  try {
    let { data, error, status } = await supabase
      .from("profiles")
      .select("user_id")
      .eq("username", username);

    if (error && status !== 406) {
      throw error;
    }

    if (data) {
      return data;
    }
  } catch (error) {
    if (error instanceof Error) {
      alert(error.message);
    }
  }
};

export const getAllCheckins = async () => {
  try {
    let { data, error, status } = await supabase
      .from("check-ins")
      .select(
        "*, user: profiles(username, avatar_url), haunted_houses: haunted-houses(*)"
      )
      .order("created_at", { ascending: true });

    if (error && status !== 406) {
      throw error;
    }

    if (data) {
      return data;
    }
  } catch (error) {
    if (error instanceof Error) {
      alert(error.message);
    }
  }
};
