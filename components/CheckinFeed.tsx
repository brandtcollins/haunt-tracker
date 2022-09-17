import { User } from "@supabase/supabase-js";
import { FunctionComponent, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useHauntedHouses } from "../ts/hooks/useHauntedHouses";
import { iCheckIn, iHauntedHouse } from "../ts/Interfaces";
import { getHauntedHouses } from "../utils/HelperFunctions";
import { supabase } from "../utils/supabaseClient";
import Image from "next/image";

interface CheckinFeedProps {}

const CheckinFeed: FunctionComponent<CheckinFeedProps> = () => {
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
    setCheckIns(checkInArray);
  }, [checkInArray]);

  useEffect(() => {
    getCheckins();
    getProfile();
  }, []);

  return (
    <div>
      {checkIns?.map((checkIn) => {
        const bgImage = checkIn.haunted_house_name.replace(/\s/g, "");
        const checkedInHouse: iHauntedHouse | undefined =
          hauntedHouseList?.find(
            (house) => house.haunted_house_id === checkIn.haunted_house_id
          );
        return (
          <div
            key={checkIn.checkin_id}
            className="relative flex flex-col overflow-hidden rounded-md bg-white shadow my-4 max-w-2xl"
          >
            <div className="relative w-full h-64 max-h-64 bg-slate-400">
              <Image
                src={`/images/${checkedInHouse?.image}`}
                alt="Picture of the haunted house artwork"
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div className="p-4 py-8 z-50 w-fill bg-white">
              <div className="">
                <p className="text-lg">
                  <span className="font-bold">{username}</span> just ran
                  <span className="font-bold">
                    {" "}
                    {checkIn.haunted_house_name}{" "}
                  </span>
                  and gave the run a
                  <span className="font-bold">
                    {" "}
                    {checkIn.rating / 2} out of 5
                  </span>
                </p>
              </div>
              <div className="flex">
                <p className="pr-4">
                  Estimated Wait Time: {checkIn.estimated_wait_time}
                </p>
                <p>Actual Wait Time: {checkIn.actual_wait_time}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CheckinFeed;
