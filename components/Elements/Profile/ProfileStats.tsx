import { FunctionComponent, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { iCheckIn, iUserSettings } from "../../../ts/Interfaces";
import { supabase } from "../../../utils/supabaseClient";
import Avatar from "../Avatar";
import { useUserContext } from "../../../state/UserContext";
import LoadingCircle from "../LoadingCircle";

interface ProfileStatsProps {
  checkIns: iCheckIn[] | any;
  checkInsLoading: boolean;
  userProfile?: iUserSettings | undefined;
}

const ProfileStats: FunctionComponent<ProfileStatsProps> = ({
  checkIns,
  checkInsLoading,
  userProfile,
}) => {
  const [totalNights, setTotalNights] = useState<number>(0);
  const [totalHaunts, setTotalHaunts] = useState<number>(0);
  const [ratingAvg, setRatingAvg] = useState<number>(0);
  const { website, username, avatarUrl } = useUserContext();
  const [avatarImage, setAvatarImage] = useState<string | undefined>("");

  const { data } = useQuery(
    ["userAvatar", userProfile?.username ? userProfile.username : username],
    () =>
      downloadImage(
        userProfile?.avatar_url ? userProfile.avatar_url : avatarUrl
      ),
    {
      onSuccess: (data) => {
        setAvatarImage(data);
      },
      enabled: !!userProfile?.avatar_url,
    }
  );

  async function downloadImage(path: string | null) {
    if (!path) {
      return;
    }
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

  useEffect(() => {
    const nightCount: string[] = [];
    const hauntCount: string[] = [];
    let tempRatingAvg = 0;
    if (checkIns) {
      for (let index = 0; index < checkIns.length; index++) {
        const element = checkIns[index];
        const elementDate = new Date(element.created_at!).toLocaleDateString(
          "en-US"
        );
        tempRatingAvg = tempRatingAvg + element.rating!;
        setRatingAvg(tempRatingAvg);
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
  }, [checkIns]);

  return (
    <div className="border-2 border-darkGray-100 rounded-lg p-4">
      {checkInsLoading ? (
        <LoadingCircle />
      ) : (
        <>
          <div className="border-b-2 border-darkGray-100 mb-4 flex">
            <Avatar
              url={avatarImage}
              username={userProfile ? userProfile.username : username}
              className="text-2xl h-16 w-16"
            />
            <div className="flex flex-col pl-4">
              <p className="text-3xl inline-block text-white font-bold">
                {userProfile ? userProfile.username : username}
              </p>
              <p className="text-md inline-block text-gray-500 ">
                {userProfile ? userProfile.website : website}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-4">
            <div className="text-white bg-darkGray-100 col-span-2 py-2 text-center items-center border-r-2 border-b-2 border-darkGray-300">
              <h3 className="text-3xl font-bold">{totalHaunts}</h3>
              <h3 className="text-sm">TOTAL HOUSES</h3>
            </div>
            <div className="text-white bg-darkGray-100 col-span-2 py-2 text-center items-center border-b-2 border-darkGray-300">
              <h3 className="text-3xl font-bold">{checkIns?.length}</h3>
              <h3 className="text-sm">TOTAL RUNS</h3>
            </div>
            <div className="text-white bg-darkGray-100 col-span-2 py-2 text-center items-center border-r-2 border-darkGray-300">
              <h3 className="text-3xl  font-bold">
                {checkIns ? (ratingAvg / checkIns?.length).toFixed(2) : ""}
              </h3>
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
