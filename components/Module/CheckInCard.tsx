import { CgBolt } from "react-icons/cg";
import Image from "next/image";
import { FunctionComponent } from "react";
import { iCheckIn, iHauntedHouse } from "../../ts/Interfaces";

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
  let checkInDate;
  if (checkIn.created_at) {
    checkInDate = new Date(checkIn.created_at);
  }
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
      <div className="p-4 py-8 z-10 w-fill bg-darkGray-300">
        <div className="border-b-2 border-darkGray-100 ">
          <div className="flex flex-col text-lg text-white">
            <p className="">
              <span className="font-bold text-emerald-500">{username}</span>{" "}
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
          <div className="py-2">
            <p>
              <span className="font-bold text-emerald-500">
                {checkIn.rating} out of 5
              </span>
            </p>
          </div>
          <div className="flex text-white py-2 items-center">
            <p className="pr-4 text-center">
              <span className="hidden md:inline-block">
                Estimated Wait Time:
              </span>
              <span className="md:hidden">Est. Wait </span>
              <span className="font-bold text-emerald-500">
                {" "}
                {checkIn.estimated_wait_time}
              </span>
            </p>
            <p className="text-center">
              <span className="hidden md:inline-block">Actual Wait Time:</span>
              <span className="md:hidden">Actual Wait </span>{" "}
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
    </div>
  );
};

export default CheckInCard;
