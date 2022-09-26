import { useState, useEffect, FunctionComponent } from "react";
import { supabase } from "../../../utils/supabaseClient";
import { PaperClipIcon } from "@heroicons/react/20/solid";
import Layout from "../../../components/Layout/Layout";
import * as Yup from "yup";
//prettier-ignore
import { Formik, Field, Form, FormikHelpers,useFormikContext, useFormik, FormikProps,FormikState } from "formik";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { iUserSettings } from "../../../ts/Interfaces";
import { useUserContext } from "../../../state/UserContext";

interface UserSettingsProps {
  session: any;
}

const UserSettings: FunctionComponent<UserSettingsProps> = ({ session }) => {
  const [loading, setLoading] = useState(true);
  const [formDisabled, setFormDisabled] = useState(true);
  const queryClient = useQueryClient();
  const { userId, username, website, avatarUrl, isLoading } = useUserContext();

  const updateProfile = async ({
    username,
    website,
    avatar_url,
  }: iUserSettings) => {
    try {
      setLoading(true);
      const updates = {
        user_id: userId,
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
      setFormDisabled(true);
    }
  };

  const initialValues: iUserSettings = {
    username: username ? username : "",
    website: website ? website : "",
    avatar_url: avatarUrl ? avatarUrl : "",
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
      {!isLoading && (
        <Formik
          initialValues={initialValues}
          onSubmit={(values) => mutation.mutate(values)}
          validationSchema={HouseCheckinSchema}
        >
          {({ errors, touched, isSubmitting }: FormikState<iUserSettings>) => (
            <Form className="text-white">
              {isSubmitting && <p>Submitting</p>}
              <div className="overflow-hidden bg-white shadow sm:rounded-lg ">
                <div className="px-4 py-5 sm:px-6 flex justify-between">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    User Settings
                  </h3>
                  <h3
                    onClick={() => setFormDisabled(!formDisabled)}
                    className="text-lg font-medium leading-6 text-emerald-500 hover:text-emerald-600 cursor-pointer"
                  >
                    {formDisabled ? "Edit" : "Cancel"}
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
                          className="w-full"
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
                          className="w-full"
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
                          className="w-full"
                          aria-describedby="avatar_url-error"
                        />
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
              {!formDisabled && (
                <button
                  type="submit"
                  className="inline-flex w-full justify-center rounded-md border border-transparent bg-emerald-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-emerald-600 sm:text-sm my-4"
                >
                  Update Savings
                </button>
              )}
            </Form>
          )}
        </Formik>
      )}
    </Layout>
  );
};

export default UserSettings;
