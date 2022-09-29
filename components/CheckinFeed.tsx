//prettier-ignore
import {Dispatch,FunctionComponent,SetStateAction,useEffect,useState,} from "react";
import { User } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";
import { useHauntedHouses } from "../ts/hooks/useHauntedHouses";
import { iCheckIn, iHauntedHouse } from "../ts/Interfaces";
import { supabase } from "../utils/supabaseClient";
import { VscAdd } from "react-icons/vsc";
import CheckInCard from "./Module/CheckInCard";
import Link from "next/link";
import { useModalContext } from "../state/ModalContext";

interface CheckinFeedProps {}

const CheckinFeed: FunctionComponent<CheckinFeedProps> = ({}) => {
  const [checkIns, setCheckIns] = useState<iCheckIn[]>();
  const [user, setUser] = useState<User>();
  const [username, setUsername] = useState<string | null>(null);
  const { open } = useModalContext();
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
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
    }
  }

  async function getCheckins() {
    try {
      const user = await getCurrentUser();

      let { data, error, status } = await supabase
        .from("check-ins")
        .select("*")
        .eq("user_id", user.id)
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
      <div
        className={`${
          open && "hidden"
        } md:hidden h-24 w-full bottom-0 left-0 z-50 fixed flex justify-end items-center`}
      >
        <div className="mr-12">
          <Link href={`/user/${username}/checkin`}>
            <button
              type="button"
              className="inline-flex w-full justify-center rounded-full border border-transparent bg-emerald-500 p-4 text-4xl font-medium text-white shadow-sm hover:bg-emerald-700"
            >
              <VscAdd />
            </button>
          </Link>
        </div>
      </div>
      <div className="hidden md:block">
        <Link href={`/user/${username}/checkin`}>
          <button
            type="button"
            className=" inline-flex w-full justify-center rounded-md border border-transparent bg-emerald-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-emerald-700 sm:text-sm"
          >
            Check into a haunt
          </button>
        </Link>
      </div>
      {checkIns
        ?.slice(0)
        .reverse()
        .map((checkIn, index) => {
          const checkedInHouse: iHauntedHouse | undefined =
            hauntedHouseList?.find(
              (house) => house.haunted_house_id === checkIn.haunted_house_id
            );
          return (
            <CheckInCard
              key={index}
              checkIn={checkIn}
              checkedInHouse={checkedInHouse}
              username={username}
            />
          );
        })}
      {checkIns?.length === 0 && emptyFeed}
    </div>
  );
};

export default CheckinFeed;
