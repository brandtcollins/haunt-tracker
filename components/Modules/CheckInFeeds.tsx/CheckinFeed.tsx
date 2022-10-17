//prettier-ignore
import {FunctionComponent} from "react";
import { iCheckIn } from "../../../ts/Interfaces";
import CheckInCard from "./CheckInCard";
import { useModalContext } from "../../../state/ModalContext";
import LoadingCircle from "../../Elements/LoadingCircle";
import { useUserContext } from "../../../state/UserContext";

interface CheckinFeedProps {
  checkInFeedData: iCheckIn[] | any[];
  dataLoading: boolean;
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
            Go check it out and log your run to be the first!
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
