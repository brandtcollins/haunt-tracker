import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import { Dialog } from "@headlessui/react";
import {
  createContext,
  FunctionComponent,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import LoadingCircle from "../components/Elements/LoadingCircle";

interface ModalContextProps {
  open: boolean;
  setOpen: any;
  modalPanel: ReactJSXElement;
  setModalPanel: any;
}

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalContext = createContext<ModalContextProps>(
  {} as ModalContextProps
);
export const useModalContext = () => useContext(ModalContext);

const ModalProvider: FunctionComponent<ModalProviderProps> = ({ children }) => {
  const [open, setOpen] = useState<boolean>(false);

  let initModalPanel = (
    <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
      <LoadingCircle />
    </Dialog.Panel>
  );

  const [modalPanel, setModalPanel] = useState<ReactJSXElement>(initModalPanel);

  return (
    <ModalContext.Provider value={{ open, setOpen, modalPanel, setModalPanel }}>
      {children}
    </ModalContext.Provider>
  );
};

export default ModalProvider;
