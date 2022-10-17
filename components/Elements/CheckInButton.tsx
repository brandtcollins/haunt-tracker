import Link from "next/link";
import { FunctionComponent } from "react";
import { VscAdd } from "react-icons/vsc";
import { useModalContext } from "../../state/ModalContext";
import { useUserContext } from "../../state/UserContext";

interface CheckInButtonProps {
  mobileOnly: boolean;
}

const CheckInButton: FunctionComponent<CheckInButtonProps> = ({
  mobileOnly,
}) => {
  const { open } = useModalContext();
  const { username } = useUserContext();

  return (
    <>
      <div
        className={`${
          open && "hidden"
        } md:hidden h-24 w-full bottom-0 left-0 z-50 fixed flex justify-end items-center`}
      >
        <div className="mr-12">
          <Link href={`/user/${username}/checkin`}>
            <button
              type="button"
              className="inline-flex w-full justify-center rounded-full border border-transparent bg-emerald-500 p-4 text-4xl font-medium text-white shadow-sm hover:bg-emerald-700"
            >
              <VscAdd />
            </button>
          </Link>
        </div>
      </div>
      {!mobileOnly && (
        <div className="hidden md:block mb-4">
          <Link href={`/user/${username}/checkin`}>
            <button
              type="button"
              className=" inline-flex w-full justify-center rounded-md border border-transparent bg-emerald-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-emerald-700 sm:text-sm"
            >
              Add Haunted House Run
            </button>
          </Link>
        </div>
      )}
    </>
  );
};

export default CheckInButton;
