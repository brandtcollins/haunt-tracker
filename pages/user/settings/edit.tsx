import { useState, useEffect, FunctionComponent } from "react";
import { supabase } from "../../../utils/supabaseClient";
import { PaperClipIcon } from "@heroicons/react/20/solid";
import Layout from "../../../components/Layout/Layout";
import * as Yup from "yup";
//prettier-ignore
import { Formik, Field, Form, FormikHelpers,useFormikContext, useFormik, FormikProps,FormikState } from "formik";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface MyAccountProps {
  session: any;
}

const MyAccount: FunctionComponent<MyAccountProps> = ({ session }) => {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(null);
  const [website, setWebsite] = useState<string | null>(null);
  const [avatar_url, setAvatarUrl] = useState<string | null>(null);
  const [formDisabled, setFormDisabled] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    getProfile();
  }, [session]);

  async function getCurrentUser() {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      throw error;
    }

    if (!session?.user) {
      throw new Error("User not logged in");
    }

    return session.user;
  }

  async function getProfile() {
    try {
      setLoading(true);
      const user = await getCurrentUser();

      let { data, error, status } = await supabase
        .from("profiles")
        .select(`username, website, avatar_url`)
        .eq("user_id", user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setWebsite(data.website);
        data.avatar_url && setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  const updateProfile = async ({
    username,
    website,
    avatar_url,
  }: iUserSettings) => {
    try {
      setLoading(true);
      const user = await getCurrentUser();

      const updates = {
        user_id: user.id,
        username,
        website,
        avatar_url,
        updated_at: new Date(),
      };

      let { error } = await supabase.from("profiles").upsert(updates);

      if (error) {
        throw error;
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  interface iUserSettings {
    username: string | null;
    website: string | null;
    avatar_url: string | null;
  }

  const initialValues: iUserSettings = {
    username: username ? username : "",
    website: website ? website : "",
    avatar_url: avatar_url ? avatar_url : "",
  };

  const HouseCheckinSchema = Yup.object().shape({
    username: Yup.string().required("Please enter a username."),
  });

  const mutation = useMutation(updateProfile, {
    onSuccess: () => {
      queryClient.invalidateQueries(["user-settings"]);
    },
  });

  return (
    <Layout title="User Settings">
      {!loading && (
        <Formik
          initialValues={initialValues}
          onSubmit={(values) => mutation.mutate(values)}
          validationSchema={HouseCheckinSchema}
        >
          {({ errors, touched, isSubmitting }: FormikState<iUserSettings>) => (
            <Form className="text-white">
              {isSubmitting && <p>Submitting</p>}
              <div className="overflow-hidden bg-white shadow sm:rounded-lg ">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    User Settings
                  </h3>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                  <dl className="sm:divide-y sm:divide-gray-200">
                    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        Username
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                        <Field
                          disabled={formDisabled}
                          name="username"
                          id="username"
                          placeholder="Username"
                          aria-invalid="true"
                          aria-describedby="username-error"
                        />
                      </dd>
                    </div>
                    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        Email address
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                        <Field
                          name="website"
                          disabled={formDisabled}
                          id="website"
                          placeholder="Website"
                          aria-invalid="true"
                          aria-describedby="website-error"
                        />
                      </dd>
                    </div>
                    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        Avatar
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                        <Field
                          name="avatar_url"
                          disabled={formDisabled}
                          id="avatar_url"
                          placeholder="Avatar URL"
                          aria-invalid="true"
                          aria-describedby="avatar_url-error"
                        />
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
              <button
                type="submit"
                className="inline-flex w-full justify-center rounded-md border border-transparent bg-emerald-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 sm:text-sm my-4"
              >
                Update Savings
              </button>
            </Form>
          )}
        </Formik>
      )}
    </Layout>
  );
};

// return (
//   <div>
//     <div>
//       {/* <Avatar name={username} src="" mr="4" /> */}
//       <div>
//         <h2>{username}</h2>
//         <h2 onClick={() => supabase.auth.signOut()}>Logout</h2>
//       </div>
//       {/* <div>
//         <label htmlFor="email">Email</label>
//         <input id="email" type="text" value={session.user.email} disabled />
//       </div>
//       <div>
//         <label htmlFor="username">Name</label>
//         <input
//           id="username"
//           type="text"
//           value={username || ""}
//           onChange={(e) => setUsername(e.target.value)}
//         />
//       </div>
//       <div>
//         <label htmlFor="website">Website</label>
//         <input
//           id="website"
//           type="website"
//           value={website || ""}
//           onChange={(e) => setWebsite(e.target.value)}
//         />
//       </div>

//       <div>
//         <button
//           className="button primary block"
//           onClick={() => updateProfile({ username, website, avatar_url })}
//           disabled={loading}
//         >
//           {loading ? "Loading ..." : "Update"}
//         </button>
//       </div>

//       <div>
//         <button
//           className="button block"
//           onClick={() => supabase.auth.signOut()}
//         >
//           Sign Out
//         </button>
//       </div> */}
//     </div>
//   </div>
// );

export default MyAccount;
