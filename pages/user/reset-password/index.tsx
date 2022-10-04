import { FunctionComponent } from "react";
import Image from "next/image";
import PasswordResetForm from "../../../components/Elements/Forms/Auth/PasswordResetForm";

interface PasswordResetProps {}

const PasswordReset: FunctionComponent<PasswordResetProps> = () => {
  return (
    <>
      <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8 bg-darkGray-500 h-screen">
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
          <Image
            className="mx-auto h-12 w-auto"
            src="/images/haunt-tracker.png"
            alt="Your Company"
            width="60"
            height="60"
          />
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
            Reset your password
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-darkGray-300 py-8 px-4 shadow sm:rounded-lg sm:px-10 text-white">
            <PasswordResetForm />
          </div>
        </div>
      </div>
    </>
  );
};

export default PasswordReset;
