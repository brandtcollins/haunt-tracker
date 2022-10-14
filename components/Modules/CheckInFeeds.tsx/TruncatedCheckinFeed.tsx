import { FunctionComponent, useEffect, useState } from "react";
import { iCheckIn } from "../../../ts/Interfaces";
import TruncatedCheckinCard from "./TruncatedCheckinCard";

interface iTruncatedCheckinFeedProps {
  checkInFeedData?: iCheckIn[] | any[];
  dataLoading?: boolean;
  houseCheckin?: boolean;
}

const TruncatedCheckinFeed: FunctionComponent<iTruncatedCheckinFeedProps> = ({
  checkInFeedData,
  dataLoading,
  houseCheckin,
}) => {
  const [checkinNumber, setCheckinNumber] = useState<number>(-2);
  const [disableViewMore, setDisableViewMore] = useState<boolean>(false);

  const handleViewMore = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (checkInFeedData) {
      if (checkInFeedData.length > checkinNumber * -1) {
        setCheckinNumber(checkinNumber - 3);
      }
    }
  };

  return (
    <div>
      <div className="mt-6 flow-root">
        <ul role="list" className="-my-5 divide-y divide-gray-200">
          {checkInFeedData
            ?.slice(checkinNumber)
            .reverse()
            .map((checkIn: iCheckIn) => {
              return <TruncatedCheckinCard checkIn={checkIn} />;
            })}
        </ul>
      </div>
      <div className="mt-6">
        {checkInFeedData?.length! > checkinNumber * -1 && (
          <a
            onClick={(e) => handleViewMore(e)}
            href="#"
            className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            View More
          </a>
        )}
      </div>
    </div>
  );
};

export default TruncatedCheckinFeed;

// function handleDeleteCheckin(checkIn: iCheckIn): void {
//   throw new Error("Function not implemented.");
// }
