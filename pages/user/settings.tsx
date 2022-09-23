import { useState, useEffect, FunctionComponent } from "react";
import { supabase } from "../../utils/supabaseClient";
import { PaperClipIcon } from "@heroicons/react/20/solid";
import Layout from "../../components/Layout/Layout";

interface MyAccountProps {
  session: any;
}

const MyAccount: FunctionComponent<MyAccountProps> = ({ session }) => {
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(null);
  const [website, setWebsite] = useState<string | null>(null);
  const [avatar_url, setAvatarUrl] = useState<string | null>(null);

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

  interface iUpdateProfile {
    username: string | null;
    website: string | null;
    avatar_url: string | null;
  }

  const updateProfile = async ({
    username,
    website,
    avatar_url,
  }: iUpdateProfile) => {
    try {
      setLoading(true);
      const user = await getCurrentUser();

      const updates = {
        id: user.id,
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

  return (
    <Layout title="My Account">
      <div className="overflow-hidden bg-white shadow sm:rounded-lg ">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Applicant Information
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Personal details and application.
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Username</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                {username}
              </dd>
            </div>
            <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Email address
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                margotfoster@example.com
              </dd>
            </div>
          </dl>
        </div>
      </div>
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
