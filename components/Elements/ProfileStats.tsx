import { FunctionComponent, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useHauntedHouses } from "../../ts/hooks/useHauntedHouses";
import { iCheckIn } from "../../ts/Interfaces";
import { supabase } from "../../utils/supabaseClient";
import { User } from "@supabase/supabase-js";
import Avatar from "./Avatar";

interface ProfileStatsProps {}

const ProfileStats: FunctionComponent<ProfileStatsProps> = () => {
  const [checkIns, setCheckIns] = useState<iCheckIn[]>();
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(null);
  const [website, setWebsite] = useState<string | null>(null);
  const [avatar_url, setAvatarUrl] = useState<string | null>(null);
  const { data: hauntedHouseList } = useHauntedHouses();

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
    setUser(session?.user);
    return session.user;
  }

  async function getProfile() {
    try {
      setLoading(true);
      const user = await getCurrentUser();

      let { data, error, status } = await supabase
        .from("profiles")
        .select(`username, website, avatar_url`)
        .eq("user_id", user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setWebsite(data.website);
        data.avatar_url && setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function getCheckins() {
    try {
      const user = await getCurrentUser();

      let { data, error, status } = await supabase
        .from("check-ins")
        .select("*")
        .eq("user_id", user.id);

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
  }

  const { data: checkInArray } = useQuery(["check-ins"], getCheckins);

  useEffect(() => {
    getCheckins();
    getProfile();
  }, []);

  return (
    <div className="border-b-2 border-darkGray-100">
      <div>
        <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gray-500">
          <span className="text-xl font-medium leading-none text-white">
            BC
          </span>
        </span>
        <span className="text-3xl text-white font-bold pl-4">{username}</span>
      </div>
      <div className="text-white ">Total Checkins: {checkInArray?.length}</div>
    </div>
  );
};

export default ProfileStats;
