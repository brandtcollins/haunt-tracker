import { useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { Button, Input } from "@chakra-ui/react";
import SignIn from "./Elements/SignIn";
import SignUp from "./Elements/SignUp";
import * as Yup from "yup";
import { Formik, Field, Form, FormikState } from "formik";

interface iMagicLinkSignin {
  email: string;
}

export default function Auth() {
  const [loading, setLoading] = useState(false);
  //prettier-ignore
  const [loginMessage, setLoginMessage] = useState<string | undefined>(undefined);
  //prettier-ignore
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  const initialValues: iMagicLinkSignin = {
    email: "",
  };

  const iMagicLinkSigninSchema = Yup.object().shape({
    email: Yup.string().email().required("Please enter your email."),
  });

  const handleLogin = async (values: any) => {
    setErrorMessage(undefined);
    setLoginMessage(undefined);
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOtp(values);
      if (error) throw error;
      setLoginMessage("Check your email for the login link!");
    } catch (error: any) {
      setErrorMessage(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8 bg-darkGray-500 h-screen">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <img
            className="mx-auto h-12 w-auto"
            src="/images/haunt-tracker.png"
            alt="Your Company"
          />
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
            Sign in to your account
          </h2>
          <div className="mt-6 text-center tracking-tight text-emerald-500">
            {loading && (
              <div className="flex justify-center">
                <div role="status">
                  <svg
                    className="inline mr-2 w-6 h-6 text-emerald-500 animate-spin dark:text-gray-600 fill-white"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <span className="sr-only">Sending email...</span>
                </div>
              </div>
            )}
            <h3>{loginMessage && "Check your email for the login link!"}</h3>
            <h3 className="mx-12">{errorMessage && errorMessage}</h3>
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-darkGray-300 py-8 px-4 shadow sm:rounded-lg sm:px-10 text-white">
            <Formik
              initialValues={initialValues}
              onSubmit={(values) => handleLogin(values)}
              validationSchema={iMagicLinkSigninSchema}
            >
              {({
                errors,
                touched,
                isSubmitting,
              }: FormikState<iMagicLinkSignin>) => (
                <Form>
                  <div>
                    <label htmlFor="email" className="block font-medium">
                      Email address
                    </label>
                    <div className="py-4 mb-4">
                      <Field
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        autoComplete="email"
                        required
                        className="mt-1 h-12 block w-full rounded-md bg-darkGray-100 text-white border-darkGray-100 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      />
                      {errors.email && touched.email ? (
                        <p
                          className="mt-2 text-sm text-emerald-500"
                          id="email-error"
                        >
                          {errors.email}
                        </p>
                      ) : null}
                    </div>
                  </div>
                  <div>
                    <button
                      disabled={loading}
                      type="submit"
                      className="flex w-full justify-center rounded-md border border-transparent bg-emerald-500 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                    >
                      <span>
                        {loading ? "Loading" : "Send login link to my email"}
                      </span>
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </>
  );
}
