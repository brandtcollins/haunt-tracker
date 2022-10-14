import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { FunctionComponent, useEffect } from "react";
import { CgBolt } from "react-icons/cg";
import { useUserContext } from "../../../state/UserContext";
import { iCheckIn } from "../../../ts/Interfaces";
import { supabase } from "../../../utils/supabaseClient";
import Avatar from "../../Elements/Avatar";
import StarRating from "../../Elements/StarRating";

interface TruncatedCheckinCardProps {
  checkIn: iCheckIn;
}

const TruncatedCheckinCard: FunctionComponent<TruncatedCheckinCardProps> = ({
  checkIn,
}) => {
  let checkInDate: any;
  const { userId } = useUserContext();

  const { data: avatarUrl } = useQuery(
    ["userAvatar", checkIn.user?.username],
    () =>
      downloadImage(checkIn.user?.avatar_url ? checkIn.user?.avatar_url : ""),
    {
      enabled: !!checkIn.user?.avatar_url,
    }
  );

  if (checkIn.created_at) {
    checkInDate = new Date(checkIn.created_at);
  }

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
  return (
    <li key={checkIn.haunted_house_id} className="">
      <div className="p-4 z-10 w-fill bg-darkGray-300">
        <div className="">
          <div className="flex flex-col text-lg text-white">
            <div className="flex items-center">
              <Avatar
                url={avatarUrl}
                username={checkIn.user?.username}
                className="mr-2 hidden sm:flex text-sm"
              />
              <div>
                <p>
                  <Link href={`/user/${checkIn.user?.username}/`} passHref>
                    <a className="font-bold text-emerald-500">
                      {checkIn.user?.username}
                    </a>
                  </Link>{" "}
                  just ran
                  <Link href={`/haunts/house/${checkIn.haunted_house_id}`}>
                    <a className="font-bold text-emerald-500">
                      {" "}
                      {checkIn.haunted_houses?.name}
                    </a>
                  </Link>
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
      </div>
    </li>
  );
};

export default TruncatedCheckinCard;
