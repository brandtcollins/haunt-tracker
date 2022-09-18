import { Dispatch, Fragment, FunctionComponent, SetStateAction } from "react";
import { Dialog, Transition } from "@headlessui/react";
import HouseCheckinForm from "./Forms/HouseCheckinForm";

interface CheckInModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

// const CheckInModal: FunctionComponent<CheckInModalProps> = () => {
//   const queryClient = useQueryClient();
//   const { isOpen, onOpen, onClose } = useDisclosure();
//   const [currentUser, setCurrentUser] = useState<any>();
//   const [selectedHouse, setSelectedHouse] = useState<string>("");
//   const [sliderValue, setSliderValue] = useState<number>(5);
//   const [selectedHouseObject, setSelectedHouseObject] =
//     useState<iHauntedHouse>();

// const { data: hauntedHouseList } = useQuery<iHauntedHouse[]>(
//   ["haunted-houses"],
//   getHauntedHouses
// );

// const postCheckin = async () => {
//   let checkInData = {
//     haunted_house_id: selectedHouseObject?.haunted_house_id,
//     rating: sliderValue,
//     user_id: currentUser,
//     haunted_house_name: selectedHouseObject?.name,
//   };
//   const { data, error } = await supabase
//     .from("check-ins")
//     .upsert([checkInData]);
//   if (error) {
//     throw error;
//   }
//   return data;
// };

// const mutation = useMutation(postCheckin, {
//   onSuccess: () => queryClient.invalidateQueries("check-ins"),
// });

// async function getCurrentUser() {
//   const {
//     data: { session },
//     error,
//   } = await supabase.auth.getSession();

//   if (error) {
//     throw error;
//   }

//   if (!session?.user) {
//     throw new Error("User not logged in");
//   }

//   setCurrentUser(session.user.id);
// }

// useEffect(() => {
//   setSelectedHouseObject(
//     hauntedHouseList?.find(
//       (house) => house.haunted_house_id === selectedHouse
//     )
//   );
// }, [selectedHouse]);

// useEffect(() => {
//   getCurrentUser();
// }, []);

//   return (
//     <>
//       <button className="font-bold" onClick={onOpen}>
//         Check In
//       </button>

//       <Modal isOpen={isOpen} onClose={onClose}>
//         <ModalOverlay />
//         <ModalContent>
//           <ModalHeader>House check in</ModalHeader>
//           <ModalCloseButton />
//           <Box maxW="2xl" w="100%" p="4">
//             <Image
//               src={
//                 selectedHouseObject
//                   ? `/images/${selectedHouseObject?.image}`
//                   : "/images/select-house.png"
//               }
//               alt={selectedHouseObject?.name}
//             />
//             <p>
//               <b>What haunted house did you run?</b>
//             </p>
//             <Select
//               placeholder="Select haunted house"
//               onChange={(event) => setSelectedHouse(event.target.value)}
//             >
// {hauntedHouseList?.map((house) => (
//   <option
//     value={house.haunted_house_id}
//     key={house.haunted_house_id}
//   >
//     {house.name}
//   </option>
// ))}
//             </Select>
//             <StarSlider onChange={setSliderValue} value={sliderValue} />
//           </Box>
//           <ModalFooter>
//             <button onClick={() => mutation.mutate()}>Submit</button>
//           </ModalFooter>
//         </ModalContent>
//       </Modal>
//     </>
//   );
// };

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
          <div className="fixed inset-0 bg-darkGray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-20 overflow-y-auto ">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
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
                      <HouseCheckinForm />
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
