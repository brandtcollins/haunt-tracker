import { User } from "@supabase/supabase-js";
import {
  Dispatch,
  FunctionComponent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { useQuery } from "@tanstack/react-query";
import { useHauntedHouses } from "../ts/hooks/useHauntedHouses";
import { iCheckIn, iHauntedHouse } from "../ts/Interfaces";
import { getHauntedHouses } from "../utils/HelperFunctions";
import { supabase } from "../utils/supabaseClient";
import Image from "next/image";
import { CgBolt } from "react-icons/cg";
import { VscAdd } from "react-icons/vsc";

interface CheckinFeedProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const CheckinFeed: FunctionComponent<CheckinFeedProps> = ({
  open,
  setOpen,
}) => {
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

  const emptyFeed = (
    <div className="border-2 py-24 border-darkGray-100 relative flex flex-col overflow-hidden rounded-md my-4 text-white items-center">
      <p className="font-bold text-3xl text-center px-24 mb-8">
        Hey! It looks like you haven&apos;t ran a house, yet.
      </p>
      <p className="text-center px-10 hidden md:block">
        Click the green button above to get started.
      </p>
      <p className="text-center px-10 md:hidden">
        Click the green{" "}
        <span className="text-emerald-500 font-bold text-lg">+</span> button
        below to get started.
      </p>
    </div>
  );

  return (
    <div>
      <div className="md:hidden h-24 w-full bottom-0 left-0 z-50 fixed flex justify-end items-center">
        <div className="mr-12">
          <button
            onClick={() => setOpen(true)}
            type="button"
            className="inline-flex w-full justify-center rounded-full border border-transparent bg-emerald-500 p-4 text-3xl font-medium text-white shadow-sm hover:bg-emerald-700 sm:text-sm"
          >
            <VscAdd />
          </button>
        </div>
      </div>
      <div className="hidden md:block">
        <button
          onClick={() => setOpen(true)}
          type="button"
          className=" inline-flex w-full justify-center rounded-md border border-transparent bg-emerald-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-emerald-700 sm:text-sm"
        >
          Check into a haunt
        </button>
      </div>
      {checkIns
        ?.slice(0)
        .reverse()
        .map((checkIn) => {
          const checkedInHouse: iHauntedHouse | undefined =
            hauntedHouseList?.find(
              (house) => house.haunted_house_id === checkIn.haunted_house_id
            );
          return (
            <div
              key={checkIn.checkin_id}
              className="border-2 border-darkGray-100 relative flex flex-col overflow-hidden rounded-md my-4"
            >
              <div className="relative w-full h-64 max-h-64 bg-slate-400">
                <Image
                  src={`/images/${checkedInHouse?.image}`}
                  alt="Picture of the haunted house artwork"
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="p-4 py-8 z-10 w-fill bg-darkGray-300">
                <div className="border-b-2 border-darkGray-100">
                  <div className="flex flex-col text-lg text-white">
                    <p className="">
                      <span className="font-bold text-emerald-500">
                        {username}
                      </span>{" "}
                      just ran
                      <span className="font-bold text-emerald-500">
                        {" "}
                        {checkedInHouse?.name}
                      </span>
                    </p>
                    <p>
                      <span className="font-bold text-emerald-500">
                        {" "}
                        {checkIn.rating} out of 5
                      </span>
                    </p>{" "}
                  </div>
                  <div className="flex text-white py-2">
                    {checkIn.express && (
                      <span className="inline-flex items-center rounded-full bg-emerald-500 pl-2 pr-4 py-0.5 text-sm font-medium text-white mr-4">
                        <CgBolt className="text-white mr-1" />
                        EXPRESS
                      </span>
                    )}
                    <p className="pr-4">
                      Estimated Wait Time:{" "}
                      <span className="font-bold text-emerald-500">
                        {checkIn.estimated_wait_time}
                      </span>
                    </p>
                    <p>
                      Actual Wait Time:{" "}
                      <span className="font-bold text-emerald-500">
                        {checkIn.actual_wait_time}
                      </span>
                    </p>
                  </div>
                  <div className="text-white pb-4">
                    <p>{checkIn.note}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      {checkIns?.length === 0 && emptyFeed}
    </div>
  );
};

export default CheckinFeed;
