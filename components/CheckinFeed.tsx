import { User } from "@supabase/supabase-js";
import { FunctionComponent, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useHauntedHouses } from "../ts/hooks/useHauntedHouses";
import { iCheckIn, iHauntedHouse } from "../ts/Interfaces";
import { getHauntedHouses } from "../utils/HelperFunctions";
import { supabase } from "../utils/supabaseClient";

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
      <h2>Recent Activity</h2>
      {checkIns
        ?.map((checkIn) => {
          const checkedInHouse: iHauntedHouse | undefined =
            hauntedHouseList?.find(
              (house) => house.haunted_house_id === checkIn.haunted_house_id
            );
          console.log(checkedInHouse);
          return (
            <div>
              <div>
                <div>
                  <div>
                    {/* <Avatar name={username} src="" mr="4" /> */}
                    <div>
                      <h2>
                        {username} just ran{" "}
                        <h2>{checkIn.haunted_house_name}</h2> and gave the run a{" "}
                        <h2>{checkIn.rating / 2} out of 5</h2>.
                      </h2>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })
        .reverse()}
    </div>
  );
};

export default CheckinFeed;
