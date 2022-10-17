import { FunctionComponent, useEffect, useState } from "react";
import { iCheckIn } from "../../../ts/Interfaces";
import TruncatedCheckinCard from "./TruncatedCheckinCard";

interface iTruncatedCheckinFeedProps {
  checkInFeedData: iCheckIn[] | any[];
  dataLoading: boolean;
  houseCheckin: boolean;
}

const TruncatedCheckinFeed: FunctionComponent<iTruncatedCheckinFeedProps> = ({
  checkInFeedData,
  dataLoading,
  houseCheckin,
}) => {
  const [checkinNumber, setCheckinNumber] = useState<number>(-3);
  const [disableViewMore, setDisableViewMore] = useState<boolean>(false);

  const handleViewMore = () => {
    if (checkInFeedData) {
      if (checkInFeedData.length > checkinNumber * -1) {
        setCheckinNumber(checkinNumber - 3);
      }
    }
  };

  return (
    <div>
      <div className="mt-6 flow-root">
        <ul role="list" className="-my-5 divide-y divide-darkGray-100">
          {checkInFeedData
            ?.slice(checkinNumber)
            .reverse()
            .map((checkIn: iCheckIn) => {
              return (
                <TruncatedCheckinCard
                  checkIn={checkIn}
                  key={checkIn.checkin_id}
                />
              );
            })}
        </ul>
      </div>
      <div className="mt-6 flex justify-center">
        {checkInFeedData?.length! > checkinNumber * -1 && (
          <button
            onClick={() => handleViewMore()}
            className="inline-flex w-1/4 justify-center rounded-xl border border-transparent bg-emerald-500 p-2 font-medium text-white shadow-sm hover:bg-emerald-700"
          >
            View More
          </button>
        )}
      </div>
    </div>
  );
};

export default TruncatedCheckinFeed;

// function handleDeleteCheckin(checkIn: iCheckIn): void {
//   throw new Error("Function not implemented.");
// }
