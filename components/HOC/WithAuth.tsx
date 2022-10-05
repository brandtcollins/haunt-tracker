import { ReactJSXElement } from "@emotion/react/types/jsx-namespace";
import { FunctionComponent } from "react";
import { useUserContext } from "../../state/UserContext";
import Auth from "../Auth";
import LoadingCircle from "../Elements/LoadingCircle";

interface WithAuthProps {
  children: any;
}

const WithAuth: FunctionComponent<WithAuthProps> = ({ children }) => {
  const { session, sessionLoaded } = useUserContext();

  if (!session && sessionLoaded) {
    return <Auth />;
  }

  return children;
};

export default WithAuth;
