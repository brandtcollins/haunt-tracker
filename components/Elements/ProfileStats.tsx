import { FunctionComponent, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useHauntedHouses } from "../../ts/hooks/useHauntedHouses";
import { iCheckIn } from "../../ts/Interfaces";
import { supabase } from "../../utils/supabaseClient";
import { User } from "@supabase/supabase-js";
import Avatar from "./Avatar";
import { useUserContext } from "../../state/UserContext";
import LoadingCircle from "./LoadingCircle";

interface ProfileStatsProps {}

const ProfileStats: FunctionComponent<ProfileStatsProps> = () => {
  const [checkIns, setCheckIns] = useState<iCheckIn[]>();
  const [user, setUser] = useState<User>();
  const [avatar_url, setAvatarUrl] = useState<string | null>(null);
  const [totalNights, setTotalNights] = useState<number>(0);
  const [totalHaunts, setTotalHaunts] = useState<number>(0);
  const { data: hauntedHouseList } = useHauntedHouses();
  const { isLoading, website, username } = useUserContext();

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

  const { data: checkInArray, isLoading: checkInsLoading } = useQuery(
    ["check-ins"],
    getCheckins
  );

  useEffect(() => {
    const nightCount: string[] = [];
    const hauntCount: string[] = [];
    if (checkInArray) {
      for (let index = 0; index < checkInArray.length; index++) {
        const element = checkInArray[index];
        const elementDate = new Date(element.created_at).toLocaleDateString(
          "en-US"
        );
        if (!nightCount.find((str) => str === elementDate)) {
          nightCount.push(elementDate);
          setTotalNights(nightCount.length);
        }
        if (!hauntCount.find((str) => str === element.haunted_house_id)) {
          hauntCount.push(element.haunted_house_id);
          setTotalHaunts(hauntCount.length);
        }
      }
    }
  }, [checkInArray]);

  useEffect(() => {
    getCheckins();
    // getProfile();
  }, []);

  return (
    <div className="border-2 border-darkGray-100 rounded-lg p-4">
      {isLoading ? (
        <LoadingCircle />
      ) : (
        <>
          <div className="border-b-2 border-darkGray-100 pb-4 mb-4">
            <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gray-500">
              <Avatar username={username} className="text-2xl" />
            </span>
            <span className="text-3xl text-white font-bold pl-4">
              {username}
            </span>
          </div>
          <div className="grid grid-cols-4">
            <div className="text-white bg-darkGray-100 col-span-2 py-2 text-center items-center border-r-2 border-b-2 border-darkGray-300">
              <h3 className="text-3xl font-bold">{totalHaunts}</h3>
              <h3 className="text-sm">TOTAL HAUNTS</h3>
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
              <h3 className="text-3xl font-bold">{totalNights}</h3>
              <h3 className="text-sm">TOTAL NIGHTS</h3>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfileStats;
