import * as Yup from "yup";
import { Formik, Field, Form, FormikState } from "formik";
import { useRouter } from "next/router";
import { iUserSignIn } from "../../../../ts/Interfaces";
import { supabase } from "../../../../utils/supabaseClient";
import Link from "next/link";
import { useUserContext } from "../../../../state/UserContext";

export default function SignInForm() {
  const { setRefreshSession } = useUserContext();
  const initialValues: iUserSignIn = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email().required("Email is a required field"),
  });

  const router = useRouter();
  const handleSignIn = async (values: iUserSignIn) => {
    const { error } = await supabase.auth.signInWithPassword(values);
    if (error) {
      alert(JSON.stringify(error));
    } else {
      console.log(`submitted`);
      setRefreshSession(true);
      router.push("/activity");
    }
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => handleSignIn(values)}
        // onSubmit={(values) => console.log(values)}
        validationSchema={validationSchema}
      >
        {({ errors, touched, isSubmitting }: FormikState<iUserSignIn>) => (
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
            <div className="mt-4 flex flex-row-reverse">
              <Link href="/user/reset-password" passHref>
                <a className="font-bold text-emerald-500">Forgot Password?</a>
              </Link>
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
