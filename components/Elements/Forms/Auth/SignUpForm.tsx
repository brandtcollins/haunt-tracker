import * as Yup from "yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Formik, Field, Form, FormikState } from "formik";
import { supabase } from "../../../../utils/supabaseClient";
import { iNewUserSignup } from "../../../../ts/Interfaces";
import Image from "next/image";

export default function SignUpForm() {
  const initialValues: iNewUserSignup = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object().shape({
    username: Yup.string().required("A username is required"),
    email: Yup.string().email().required("Email is a required field"),
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

  const handSignUp = async (values: iNewUserSignup) => {
    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: {
          username: values.username,
        },
      },
    });
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
        validationSchema={validationSchema}
      >
        {({ errors, touched, isSubmitting }: FormikState<iNewUserSignup>) => (
          <Form className="text-white">
            {isSubmitting && <p>Submitting</p>}
            <div>
              <label htmlFor="username" className="block font-medium">
                Username
              </label>
              <div className="mt-1">
                <Field
                  name="username"
                  id="username"
                  placeholder=""
                  className="mt-1 h-12 block w-full rounded-md bg-darkGray-100 text-white border-darkGray-100 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  aria-invalid="true"
                  aria-describedby="username-error"
                />
                {errors.username && touched.username ? (
                  <p
                    className="mt-2 text-sm text-emerald-500"
                    id="username-error"
                  >
                    {errors.username}
                  </p>
                ) : null}
              </div>
            </div>
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
              <label htmlFor="password" className="block font-medium mt-4">
                Password
              </label>
              <div className="mt-1">
                <Field
                  id="password"
                  name="password"
                  type="password"
                  className="mt-1 h-12 block w-full rounded-md bg-darkGray-100 text-white border-darkGray-100 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                />
                {errors.password && touched.password ? (
                  <p className="mt-2 text-sm text-emerald-500" id="email-error">
                    {errors.password}
                  </p>
                ) : null}
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block font-medium mt-4">
                Confirm Password
              </label>
              <div className="mt-1">
                <Field
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  className="mt-1 h-12 block w-full rounded-md bg-darkGray-100 text-white border-darkGray-100 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                />
                {errors.confirmPassword && touched.confirmPassword ? (
                  <p className="mt-2 text-sm text-emerald-500" id="email-error">
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
                Create Account
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
}
