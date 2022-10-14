import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { FunctionComponent } from "react";
import LoadingCircle from "../../../components/Elements/LoadingCircle";
import Layout from "../../../components/Layout/Layout";
import {
  getCheckinsByHouse,
  getHauntedHouse,
} from "../../../utils/HelperFunctions";
import Image from "next/image";
import CheckinFeed from "../../../components/Modules/CheckInFeeds.tsx/CheckinFeed";
import TruncatedCheckinFeed from "../../../components/Modules/CheckInFeeds.tsx/TruncatedCheckinFeed";

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
              {/* <CheckinFeed
                houseCheckin
                checkInFeedData={houseCheckInData}
                dataLoading={houseCheckInDataIsLoading}
              /> */}
              <TruncatedCheckinFeed
                houseCheckin
                checkInFeedData={houseCheckInData}
                dataLoading={houseCheckInDataIsLoading}
              />
            </div>
            <div className="px-4 hidden md:block w-full max-w-md ">
              {/* Add house stats card here */}
            </div>
          </div>
        </>
      )}
    </Layout>
  );
};

export default Haunts;
