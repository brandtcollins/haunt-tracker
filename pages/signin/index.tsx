import { FunctionComponent } from "react";
import Image from "next/image";
import SignInForm from "../../components/Elements/Forms/Auth/SignInForm";
import Auth from "../../components/Auth";

interface SignInProps {}

const SignIn: FunctionComponent<SignInProps> = () => {
  return <Auth />;
};

export default SignIn;
