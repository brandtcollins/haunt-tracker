import * as Yup from "yup";
import { Formik, Field, Form, FormikState } from "formik";
import { useRouter } from "next/router";
import { iUserSignIn } from "../../../../ts/Interfaces";
import { supabase } from "../../../../utils/supabaseClient";
import { useEffect, useState } from "react";

export default function SignInForm() {
  const [passwordRecovery, setPasswordRecovery] = useState<boolean>(false);

  const emailValidationSchema = Yup.object().shape({
    email: Yup.string().email().required("Email is a required field"),
  });

  const passwordValidationSchema = Yup.object().shape({
    password: Yup.string()
      .required("Please enter your password")
      .matches(
        /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
        "Password must contain at least 8 characters, one uppercase, one number and one special case character"
      ),
    confirmPassword: Yup.string()
      .required("Please confirm your password")
      .when("password", {
        is: (password: string) =>
          password && password.length > 0 ? true : false,
        then: Yup.string().oneOf(
          [Yup.ref("password")],
          "Password doesn't match"
        ),
      }),
  });

  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event == "PASSWORD_RECOVERY") {
        setPasswordRecovery(true);
      }
    });
  }, []);

  const handlePasswordResetRequest = async (values: { email: string }) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(
      values.email,
      {
        redirectTo: "https://haunt-tracker.com/user/reset-password",
      }
    );
  };

  const handlePasswordReset = async (values: {
    password: string;
    confirmPassword: string;
  }) => {
    const { data, error } = await supabase.auth.updateUser({
      password: values.password,
    });

    if (data) alert("Password updated successfully!");
    if (error) alert("There was an error updating your password.");
  };

  if (passwordRecovery) {
    return (
      <>
        <Formik
          initialValues={{ password: "", confirmPassword: "" }}
          onSubmit={(values) => handlePasswordReset(values)}
          validationSchema={passwordValidationSchema}
        >
          {({
            errors,
            touched,
            isSubmitting,
          }: FormikState<{ password: string; confirmPassword: string }>) => (
            <Form className="text-white">
              {isSubmitting && <p>Submitting</p>}
              <div>
                <label htmlFor="password" className="block font-medium">
                  Password
                </label>
                <div className="mt-1">
                  <Field
                    name="password"
                    id="password"
                    placeholder=""
                    className="mt-1 h-12 block w-full rounded-md bg-darkGray-100 text-white border-darkGray-100 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    aria-invalid="true"
                    aria-describedby="email-error"
                  />
                  {errors.password && touched.password ? (
                    <p
                      className="mt-2 text-sm text-emerald-500"
                      id="email-error"
                    >
                      {errors.password}
                    </p>
                  ) : null}
                </div>
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block font-medium">
                  Confirm Password
                </label>
                <div className="mt-1">
                  <Field
                    name="confirmPassword"
                    id="confirmPassword"
                    placeholder=""
                    className="mt-1 h-12 block w-full rounded-md bg-darkGray-100 text-white border-darkGray-100 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    aria-invalid="true"
                    aria-describedby="email-error"
                  />
                  {errors.confirmPassword && touched.confirmPassword ? (
                    <p
                      className="mt-2 text-sm text-emerald-500"
                      id="email-error"
                    >
                      {errors.confirmPassword}
                    </p>
                  ) : null}
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="mt-10 flex w-full justify-center rounded-md border border-transparent bg-emerald-500 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                >
                  Sign In
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </>
    );
  }

  return (
    <>
      <Formik
        initialValues={{ email: "" }}
        onSubmit={(values) => handlePasswordResetRequest(values)}
        validationSchema={emailValidationSchema}
      >
        {({
          errors,
          touched,
          isSubmitting,
        }: FormikState<{ email: string }>) => (
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
                {errors.email && touched.email ? (
                  <p className="mt-2 text-sm text-emerald-500" id="email-error">
                    {errors.email}
                  </p>
                ) : null}
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="mt-10 flex w-full justify-center rounded-md border border-transparent bg-emerald-500 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              >
                Sign In
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
}
