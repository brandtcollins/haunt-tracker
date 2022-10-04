import * as Yup from "yup";
import { Formik, Field, Form, FormikState } from "formik";
import { useRouter } from "next/router";
import { iUserSignIn } from "../../../../ts/Interfaces";
import { supabase } from "../../../../utils/supabaseClient";
import { useEffect } from "react";

export default function SignInForm() {
  interface iPasswordReset {
    email: string;
  }
  const initialValues: iPasswordReset = {
    email: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email().required("Email is a required field"),
  });

  const router = useRouter();

  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event == "PASSWORD_RECOVERY") {
        const newPassword: string | undefined = prompt(
          "What would you like your new password to be?"
        )!;
        const { data, error } = await supabase.auth.updateUser({
          password: newPassword,
        });

        if (data) alert("Password updated successfully!");
        if (error) alert("There was an error updating your password.");
      }
    });
  }, []);

  const handlePasswordReset = async (values: iPasswordReset) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(
      values.email,
      {
        redirectTo: "https://localhost:3000/user/reset-password",
      }
    );
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => handlePasswordReset(values)}
        validationSchema={validationSchema}
      >
        {({ errors, touched, isSubmitting }: FormikState<iPasswordReset>) => (
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
