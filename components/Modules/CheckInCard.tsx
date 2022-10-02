import { CgBolt } from "react-icons/cg";
import Image from "next/image";
import { FunctionComponent, useRef, useState } from "react";
import { iCheckIn, iHauntedHouse } from "../../ts/Interfaces";
import Link from "next/link";
import { useModalContext } from "../../state/ModalContext";
import { DeleteCheckinModal } from "../Elements/Modal/ModalContent";
import StarRating from "../Elements/StarRating/StarRating";
import { useUserContext } from "../../state/UserContext";
import Avatar from "../Elements/Avatar";
import { supabase } from "../../utils/supabaseClient";
import { useQuery } from "@tanstack/react-query";

interface CheckInCardProps {
  checkIn: iCheckIn;
  checkedInHouse: iHauntedHouse | undefined;
  username: string | null;
}

const CheckInCard: FunctionComponent<CheckInCardProps> = ({
  checkIn,
  username,
  checkedInHouse,
}) => {
  const { setOpen, setModalPanel } = useModalContext();
  const { userId } = useUserContext();
  let checkInDate;
  let checkInRatingNum = 3.5;

  const { data: avatarUrl } = useQuery(
    ["userAvatar", checkIn.user?.username],
    () =>
      downloadImage(checkIn.user?.avatar_url ? checkIn.user?.avatar_url : ""),
    {
      enabled: !!checkIn.user?.avatar_url,
    }
  );

  async function downloadImage(path: string) {
    try {
      const { data, error } = await supabase.storage
        .from("avatars")
        .download(path);
      if (error) {
        throw error;
      }
      const url = URL.createObjectURL(data);
      return url;
    } catch (error: any) {
      console.log("Error downloading image: ", error.message);
    }
  }

  if (checkIn.created_at) {
    checkInDate = new Date(checkIn.created_at);
  }

  const handleDeleteCheckin = (checkIn: iCheckIn) => {
    setOpen(true);
    setModalPanel(<DeleteCheckinModal checkIn={checkIn} />);
  };

  return (
    <div
      key={checkIn.checkin_id}
      className="border-2 border-darkGray-100 relative flex flex-col overflow-hidden rounded-md my-4"
    >
      <div className="relative w-full h-64 max-h-64 bg-darkGray-100">
        <Image
          src={`/images/${checkedInHouse?.image}`}
          alt="Picture of the haunted house artwork"
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className="p-4 z-10 w-fill bg-darkGray-300">
        <div className="">
          <div className="flex flex-col text-lg text-white">
            <div className="flex items-center">
              <Avatar
                url={avatarUrl}
                username={checkIn.user?.username}
                className="mr-2 hidden sm:block"
              />
              <div>
                <p>
                  <Link href={`/user/${checkIn.user?.username}/`} passHref>
                    <a className="font-bold text-emerald-500">
                      {checkIn.user?.username}
                    </a>
                  </Link>{" "}
                  just ran
                  <span className="font-bold text-emerald-500">
                    {" "}
                    {checkedInHouse?.name}
                  </span>
                </p>
                <p className="text-sm text-slate-500">
                  {" "}
                  {checkInDate?.toLocaleString("en-us", {
                    weekday: "long",
                  })}{" "}
                  {checkInDate?.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </div>
          <div className="py-2">
            <StarRating rating={checkIn.rating} />
          </div>
          <div className="flex text-white py-2 items-center">
            <p
              className={`${
                !checkIn.estimated_wait_time && "hidden"
              } pr-4 text-center`}
            >
              <span className="hidden md:inline-block mr-2">
                Estimated Wait Time:
              </span>
              <span className="md:hidden">Est. Wait </span>
              <span className="font-bold text-emerald-500">
                {checkIn.estimated_wait_time}
              </span>
            </p>
            <p
              className={`${!checkIn.actual_wait_time && "hidden"} text-center`}
            >
              <span className="hidden md:inline-block mr-2">
                Actual Wait Time:
              </span>
              <span className="md:hidden">Actual Wait </span>
              {checkIn.express ? (
                <span className="inline-flex items-center rounded-full bg-emerald-500 px-2 py-0.5 text-md font-medium text-white mr-4">
                  <CgBolt className="text-white" />
                  <span className="px-1">{checkIn.actual_wait_time}</span>
                </span>
              ) : (
                <span className="font-bold text-emerald-500">
                  {checkIn.actual_wait_time}
                </span>
              )}
            </p>
          </div>
          <div className="text-white pb-4">
            <p>{checkIn.note}</p>
          </div>
        </div>
        {userId === checkIn.user_id && (
          <div className="pt-4 flex justify-between border-t-2  border-darkGray-100 ">
            <Link
              href={`/user/${username}/checkin/${checkIn.checkin_id}/edit`}
              passHref
            >
              <a className="text-sm text-slate-500">Edit Checkin</a>
            </Link>
            <p
              className="text-sm text-slate-500 hover:cursor-pointer"
              // onClick={() => mutation.mutate(checkIn)}
              onClick={() => handleDeleteCheckin(checkIn)}
            >
              Delete Checkin
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckInCard;
