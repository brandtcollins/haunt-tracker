import * as Yup from "yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Formik, Field, Form, FormikState } from "formik";
import { supabase } from "../../utils/supabaseClient";
import { iNewUserSignup } from "../../ts/Interfaces";

export default function SignIn() {
  const initialValues: iNewUserSignup = {
    email: "",
    password: "",
  };

  const newUserSchema = Yup.object().shape({});

  const handSignUp = async (values: iNewUserSignup) => {
    const { error } = await supabase.auth.signUp(values);
    if (error) {
      alert(JSON.stringify(error));
    } else {
      console.log(`Sign up successful`);
      //   router.push("/signin");
    }
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => handSignUp(values)}
        validationSchema={newUserSchema}
      >
        {({ errors, touched, isSubmitting }: FormikState<iNewUserSignup>) => (
          <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8 bg-darkGray-500 h-screen">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
              <img
                className="mx-auto h-12 w-auto"
                src="/images/haunt-tracker.png"
                alt="Your Company"
              />
              <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
                Create a new account.
              </h2>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
              <div className="bg-darkGray-300 py-8 px-4 shadow sm:rounded-lg sm:px-10 text-white">
                <Form className="text-white">
                  {isSubmitting && <p>Submitting</p>}
                  <div>
                    <label htmlFor="email" className="block font-medium">
                      Email address
                    </label>
                    <div className="mt-1">
                      <Field
                        name="email"
                        id="email"
                        placeholder=""
                        className="mt-1 h-12 block w-full rounded-md bg-darkGray-100 text-white border-darkGray-100 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        aria-invalid="true"
                        aria-describedby="email-error"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="block font-medium">
                      Password
                    </label>
                    <div className="mt-1">
                      <Field
                        id="password"
                        name="password"
                        type="password"
                        className="mt-1 h-12 block w-full rounded-md bg-darkGray-100 text-white border-darkGray-100 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="flex w-full justify-center rounded-md border border-transparent bg-emerald-500 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                    >
                      Create Account
                    </button>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        )}
      </Formik>
    </>
  );
}
