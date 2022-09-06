import {
  Button,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { FunctionComponent } from "react";
import CheckIn from "./Checkin";

interface CheckInModalProps {}

const CheckInModal: FunctionComponent<CheckInModalProps> = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button onClick={onOpen}>Check In</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>House check in</ModalHeader>
          <ModalCloseButton />
          <CheckIn />
        </ModalContent>
      </Modal>
    </>
  );
};

export default CheckInModal;
