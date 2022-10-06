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

export const getHauntedHouse = async (
  haunted_house_id: string | string[] | undefined
) => {
  try {
    let { data, error, status } = await supabase
      .from("haunted-houses")
      .select("*")
      .eq("haunted_house_id", haunted_house_id);

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

export const getCheckinsByUser = async (userId: string | null) => {
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

export const getCheckinsByHouse = async (
  haunted_house_id: string | string[] | undefined
) => {
  try {
    let { data, error, status } = await supabase
      .from("check-ins")
      .select(
        "*, user: profiles(username, avatar_url), haunted_houses: haunted-houses(*)"
      )
      .eq("haunted_house_id", haunted_house_id)
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

export const getHaunts = async () => {
  try {
    let { data, error, status } = await supabase
      .from("haunts")
      .select("*, themepark_location: themepark_location(*)");

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

export const getUserProfile = async (
  username: string | string[] | undefined
) => {
  try {
    let { data, error, status } = await supabase
      .from("profiles")
      .select("*")
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
