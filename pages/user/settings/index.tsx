import { useState, useEffect, FunctionComponent, ChangeEvent } from "react";
import { supabase } from "../../../utils/supabaseClient";
import { PaperClipIcon } from "@heroicons/react/20/solid";
import Layout from "../../../components/Layout/Layout";
import * as Yup from "yup";
//prettier-ignore
import { Formik, Field, Form, FormikHelpers,useFormikContext, useFormik, FormikProps,FormikState } from "formik";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { iUserSettings } from "../../../ts/Interfaces";
import { spawn } from "child_process";
import { Avatar } from "@chakra-ui/react";
import WithAuth from "../../../components/HOC/WithAuth";

interface UserSettingsProps {
  session: any;
}

const UserSettings: FunctionComponent<UserSettingsProps> = ({ session }) => {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(null);
  const [website, setWebsite] = useState<string | null>(null);
  const [avatar_url, setAvatarUrl] = useState<string | null>(null);
  const [formDisabled, setFormDisabled] = useState(true);
  const [changeAvatar, setChangeAvatar] = useState(false);
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
      setFormDisabled(true);
      getProfile();
    }
  };

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

  const handleUpload = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      console.log(event.target.files[0]);
    }
  };

  const handleFormCancel = () => {
    setFormDisabled(!formDisabled);
    setChangeAvatar(false);
  };

  return (
    <WithAuth>
      <Layout title="User Settings">
        {!loading && (
          <Formik
            initialValues={initialValues}
            onSubmit={(values) => mutation.mutate(values)}
            validationSchema={HouseCheckinSchema}
          >
            {({
              errors,
              touched,
              isSubmitting,
            }: FormikState<iUserSettings>) => (
              <Form className="text-white">
                {isSubmitting && <p>Submitting</p>}
                <div className="overflow-hidden bg-white shadow sm:rounded-lg ">
                  <div className="px-4 py-5 sm:px-6 flex justify-between">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      User Settings
                    </h3>
                    <h3
                      onClick={() => handleFormCancel()}
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
                        <dd
                          className={`mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0`}
                        >
                          <UploadAvatar
                            url={avatar_url}
                            size={75}
                            formDisabled={formDisabled}
                            onUpload={(url: string) => {
                              setAvatarUrl(url);
                              updateProfile({
                                username,
                                website,
                                avatar_url: url,
                              });
                            }}
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
    </WithAuth>
  );
};

interface UploadAvatarProps {
  url: string | null;
  size: number;
  onUpload: any;
  formDisabled: boolean;
}

const UploadAvatar: FunctionComponent<UploadAvatarProps> = ({
  url,
  size,
  onUpload,
  formDisabled,
}) => {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [changeAvatar, setChangeAvatar] = useState(false);

  useEffect(() => {
    console.log(avatarUrl);
  }, [avatarUrl]);

  useEffect(() => {
    if (url) downloadImage(url);
  }, [url]);

  async function downloadImage(path: string) {
    try {
      const { data, error } = await supabase.storage
        .from("avatars")
        .download(path);
      if (error) {
        throw error;
      }
      const url = URL.createObjectURL(data);
      setAvatarUrl(url);
    } catch (error: any) {
      console.log("Error downloading image: ", error.message);
    }
  }

  async function uploadAvatar(event: ChangeEvent<HTMLInputElement>) {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      let { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      onUpload(filePath);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex">
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt="Avatar"
          className="avatar image"
          style={{ height: size, width: size }}
        />
      ) : (
        <div
          className="avatar no-image"
          style={{ height: size, width: size }}
        />
      )}
      <div className="pl-6">
        <h1
          onClick={() => setChangeAvatar(true)}
          className={`font-bold text-emerald-500 hover:cursor-pointer pl-4 ${
            (formDisabled || changeAvatar) && "hidden"
          }`}
        >
          Change Avatar
        </h1>
        <input
          className={`${(formDisabled || !changeAvatar) && "hidden"}`}
          type="file"
          id="single"
          accept="image/*"
          onChange={uploadAvatar}
          disabled={uploading}
        />
      </div>
    </div>
  );
};

export default UserSettings;
