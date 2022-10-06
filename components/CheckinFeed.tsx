//prettier-ignore
import {Dispatch,FunctionComponent,SetStateAction,useEffect,useState,} from "react";
import { User } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";
import { useHauntedHouses } from "../ts/hooks/useHauntedHouses";
import { iCheckIn, iHauntedHouse } from "../ts/Interfaces";
import { supabase } from "../utils/supabaseClient";
import { VscAdd } from "react-icons/vsc";
import CheckInCard from "./Modules/CheckInCard";
import Link from "next/link";
import { useModalContext } from "../state/ModalContext";
import LoadingCircle from "./Elements/LoadingCircle";
import { useUserContext } from "../state/UserContext";

interface CheckinFeedProps {
  checkInFeedData?: iCheckIn[] | any[];
  dataLoading?: boolean;
  houseCheckin?: boolean;
}

const CheckinFeed: FunctionComponent<CheckinFeedProps> = ({
  checkInFeedData,
  dataLoading,
  houseCheckin,
}) => {
  const { open } = useModalContext();
  const { username } = useUserContext();

  const emptyFeed = (
    <div className="border-2 py-24 border-darkGray-100 relative flex flex-col overflow-hidden rounded-md mb-4 text-white items-center">
      {houseCheckin ? (
        <>
          <p className="font-bold text-3xl text-center px-24 mb-8">
            Hmmm...it doesn&apos;t look like anyone has ran this house yet.
          </p>
          <p className="text-center px-10 hidden md:block">
            Click the green button to and be the first!
          </p>
        </>
      ) : (
        <>
          <p className="font-bold text-3xl text-center px-24 mb-8">
            Hey! It looks like you haven&apos;t ran a house, yet.
          </p>
          <p className="text-center px-10 hidden md:block">
            Click the green button and get started.
          </p>
        </>
      )}
      <p className="text-center px-10 md:hidden">
        Click the green{" "}
        <span className="text-emerald-500 font-bold text-lg">+</span> button
        below to get started.
      </p>
    </div>
  );

  if (dataLoading || !checkInFeedData) {
    return <LoadingCircle />;
  }

  return (
    <div>
      {checkInFeedData
        ?.slice(0)
        .reverse()
        .map((checkIn, index) => (
          <CheckInCard key={index} checkIn={checkIn} username={username} />
        ))}
      {checkInFeedData?.length === 0 && emptyFeed}
    </div>
  );
};

export default CheckinFeed;
