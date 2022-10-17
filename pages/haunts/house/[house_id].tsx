import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { FunctionComponent, useEffect, useState } from "react";
import LoadingCircle from "../../../components/Elements/LoadingCircle";
import Layout from "../../../components/Layout/Layout";
import {
  getCheckinsByHouse,
  getHauntedHouse,
} from "../../../utils/HelperFunctions";
import Image from "next/image";
import TruncatedCheckinFeed from "../../../components/Modules/CheckInFeeds.tsx/TruncatedCheckinFeed";
import { iCheckIn } from "../../../ts/Interfaces";

interface HauntsProps {}

const Haunts: FunctionComponent<HauntsProps> = () => {
  const router = useRouter();
  const { house_id } = router.query;
  const { data: houseData, isLoading: houseDataIsLoading } = useQuery(
    ["haunted-house", house_id],
    () => getHauntedHouse(house_id),
    {
      enabled: !!house_id,
    }
  );

  const { data: houseCheckInData, isLoading: houseCheckInDataIsLoading } =
    useQuery(
      ["haunted-house-checkins", house_id],
      () => getCheckinsByHouse(house_id),
      {
        enabled: !!house_id,
      }
    );

  return (
    <Layout title="Haunts">
      {houseDataIsLoading ? (
        <LoadingCircle />
      ) : (
        <>
          <div className="text-white">
            <div className="relative w-full h-64 max-h-64 bg-darkGray-100">
              <Image
                src={`/images/${houseData && houseData[0].image}`}
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div className="my-4">
              <h1 className="text-3xl mb-4 font-bold">
                {houseData && houseData[0].name}
              </h1>
              <p>{houseData && houseData[0].description}</p>
            </div>
          </div>
          <div className="md:flex">
            <div className="md:max-w-3xl md:w-4/5">
              {houseCheckInData && (
                <TruncatedCheckinFeed
                  houseCheckin
                  checkInFeedData={houseCheckInData}
                  dataLoading={houseCheckInDataIsLoading}
                />
              )}
            </div>
            <div className="px-4 hidden md:block w-full max-w-md ">
              <HouseStats checkIns={houseCheckInData} />
            </div>
          </div>
        </>
      )}
    </Layout>
  );
};

interface HouseStatsProps {
  checkIns: iCheckIn[] | undefined;
}

const HouseStats: FunctionComponent<HouseStatsProps> = ({ checkIns }) => {
  const [ratingAvg, setRatingAvg] = useState<number>(0);

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
      }
    }
  }, [checkIns]);
  return (
    <div className="grid grid-cols-4">
      <div className="text-white bg-darkGray-100 col-span-2 py-2 text-center items-center border-r-2 border-b-2 border-darkGray-300">
        <h3 className="text-3xl font-bold">
          {checkIns ? (ratingAvg / checkIns?.length).toFixed(2) : ""}
        </h3>
        <h3 className="text-sm">AVG RATING</h3>
      </div>
      <div className="text-white bg-darkGray-100 col-span-2 py-2 text-center items-center border-b-2 border-darkGray-300">
        <h3 className="text-3xl font-bold">{checkIns?.length}</h3>
        <h3 className="text-sm">TOTAL CHECKINS</h3>
      </div>
    </div>
  );
};

export default Haunts;
