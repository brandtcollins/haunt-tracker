import { Dialog } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/20/solid";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FunctionComponent } from "react";
import { useModalContext } from "../../../state/ModalContext";
import { iCheckIn } from "../../../ts/Interfaces";
import { supabase } from "../../../utils/supabaseClient";

interface deleteModalProps {
  checkIn: iCheckIn;
}
const DeleteCheckinModal: FunctionComponent<deleteModalProps> = ({
  checkIn,
}) => {
  const { open, setOpen, setModalPanel } = useModalContext();
  const queryClient = useQueryClient();

  const deleteCheckin = async (values: iCheckIn) => {
    const { data, error } = await supabase
      .from("check-ins")
      .delete()
      .match({ checkin_id: values.checkin_id });
  };
  const mutation = useMutation(deleteCheckin, {
    onSuccess: () => {
      queryClient.refetchQueries(["check-ins"]);
      setOpen(false);
    },
  });
  return (
    <>
      <div>
        <div className="mt-3 text-center sm:mt-5">
          <Dialog.Title
            as="h3"
            className="text-lg font-medium leading-6 text-gray-900"
          >
            Delete check in
          </Dialog.Title>
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              Are you sure you'd like to delete this check in?
            </p>
          </div>
        </div>
      </div>
      <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
        <button
          type="button"
          className="inline-flex w-full justify-center rounded-md border border-transparent bg-emerald-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:col-start-2 sm:text-sm"
          onClick={() => mutation.mutate(checkIn)}
        >
          Delete Checkin
        </button>
        <button
          type="button"
          className="mt-3 inline-flex w-full justify-center rounded-md border border-emerald-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 sm:col-start-1 sm:mt-0 sm:text-sm"
          onClick={() => setOpen(false)}
        >
          Cancel
        </button>
      </div>
    </>
  );
};

export { DeleteCheckinModal };
