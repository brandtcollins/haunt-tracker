import {
  Box,
  Button,
  Modal,
  ModalCloseButton,
  ModalContent,
  Image,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  useDisclosure,
} from "@chakra-ui/react";
import { QueryClient, useQuery } from "@tanstack/react-query";
import { FunctionComponent, useEffect, useState } from "react";
import { iCheckIn, iHauntedHouse } from "../ts/Interfaces";
import { supabase } from "../utils/supabaseClient";
import StarSlider from "./StarSlider";

interface CheckInModalProps {}
interface CheckInProps {}

const getHauntedHouses = async () => {
  const { data, error } = await supabase.from("haunted-houses").select();
  if (error) {
    throw error;
  }
  return data;
};

const CheckInModal: FunctionComponent<CheckInModalProps> = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [currentUser, setCurrentUser] = useState<any>();
  const [selectedHouse, setSelectedHouse] = useState<string>("");
  const [sliderValue, setSliderValue] = useState<number>(5);
  const [selectedHouseObject, setSelectedHouseObject] =
    useState<iHauntedHouse>();

  const { data: hauntedHouseList } = useQuery<iHauntedHouse[]>(
    ["haunted-houses"],
    getHauntedHouses
  );

  const postCheckin = async () => {
    let checkInData = {
      haunted_house_id: selectedHouseObject?.haunted_house_id,
      rating: sliderValue,
      user_id: currentUser,
      haunted_house_name: selectedHouseObject?.name,
    };
    const { data, error } = await supabase
      .from("check-ins")
      .upsert([checkInData]);
  };

  async function getCurrentUser() {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      throw error;
    }

    if (!session?.user) {
      throw new Error("User not logged in");
    }

    setCurrentUser(session.user.id);
  }

  useEffect(() => {
    setSelectedHouseObject(
      hauntedHouseList?.find(
        (house) => house.haunted_house_id === selectedHouse
      )
    );
  }, [selectedHouse]);

  useEffect(() => {
    getCurrentUser();
  }, []);

  return (
    <>
      <Button colorScheme="blue" onClick={onOpen}>
        Check In
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>House check in</ModalHeader>
          <ModalCloseButton />
          <Box maxW="2xl" w="100%" p="4">
            <Image
              src={
                selectedHouseObject
                  ? `/images/${selectedHouseObject?.image}`
                  : "/images/select-house.png"
              }
              alt={selectedHouseObject?.name}
            />
            <p>
              <b>What haunted house did you run?</b>
            </p>
            <Select
              placeholder="Select haunted house"
              onChange={(event) => setSelectedHouse(event.target.value)}
            >
              {hauntedHouseList?.map((house) => (
                <option
                  value={house.haunted_house_id}
                  key={house.haunted_house_id}
                >
                  {house.name}
                </option>
              ))}
            </Select>
            <StarSlider onChange={setSliderValue} value={sliderValue} />
          </Box>
          <ModalFooter>
            <Button colorScheme="blue" onClick={postCheckin}>
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CheckInModal;
