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
    <div className="border-2 border-darkGray-100 rounded-lg p-4">
      <div className="border-b-2 border-darkGray-100 pb-4 mb-4">
        <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gray-500">
          <Avatar username={username} className="text-2xl" />
        </span>
        <span className="text-3xl text-white font-bold pl-4">{username}</span>
      </div>
      <div className="grid grid-cols-4">
        <div className="text-white bg-darkGray-100 col-span-2 py-2 text-center items-center border-r-2 border-b-2 border-darkGray-300">
          <h3 className="text-3xl text-darkGray-100 font-bold">X</h3>
          <h3 className="text-sm">TOTAL PARKS</h3>
        </div>
        <div className="text-white bg-darkGray-100 col-span-2 py-2 text-center items-center border-b-2 border-darkGray-300">
          <h3 className="text-3xl font-bold">{checkInArray?.length}</h3>
          <h3 className="text-sm">TOTAL RUNS</h3>
        </div>
        <div className="text-white bg-darkGray-100 col-span-2 py-2 text-center items-center border-r-2 border-darkGray-300">
          <h3 className="text-3xl text-darkGray-100 font-bold">X</h3>
          <h3 className="text-sm">AVG RATING</h3>
        </div>
        <div className="text-white bg-darkGray-100 col-span-2 py-2 text-center items-center">
          <h3 className="text-3xl text-darkGray-100 font-bold">X</h3>
          <h3 className="text-sm">TOTAL NIGHTS</h3>
        </div>
      </div>
    </div>
  );
};

export default ProfileStats;
