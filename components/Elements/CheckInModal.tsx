import { Dispatch, Fragment, FunctionComponent, SetStateAction } from "react";
import { Dialog, Transition } from "@headlessui/react";
import HouseCheckinForm from "./Forms/HouseCheckinForm";

interface CheckInModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const CheckInModal: FunctionComponent<CheckInModalProps> = ({
  open,
  setOpen,
}) => {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-30" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-darkGray-500 bg-opacity-75 transition-opacity z-75" />
        </Transition.Child>

        <div className="fixed inset-0 z-100 overflow-y-auto ">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-darkGray-300 px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-4 sm:w-full sm:max-w-xl sm:p-6">
                <div>
                  <div className="mt-2 sm:mt-5">
                    <Dialog.Title
                      as="h3"
                      className="text-2xl font-medium leading-6 text-white"
                    >
                      Haunt Check In
                    </Dialog.Title>
                    <div className="mt-8">
                      <HouseCheckinForm setOpen={setOpen} />
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default CheckInModal;
