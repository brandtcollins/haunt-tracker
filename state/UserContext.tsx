import { User } from "@supabase/supabase-js";
import {
  createContext,
  FunctionComponent,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { supabase } from "../utils/supabaseClient";

interface UserContextProps {
  username: string | null;
  website: string | null;
  avatarUrl: string | null;
  userId: string | null;
  isLoading: boolean;
}

interface UserProviderProps {
  children: ReactNode;
}

export const UserContext = createContext<UserContextProps>(
  {} as UserContextProps
);
export const useUserContext = () => useContext(UserContext);

const UserProvider: FunctionComponent<UserProviderProps> = ({ children }) => {
  const [isLoading, setIsLoadin] = useState<boolean>(true);
  const [user, setUser] = useState<User>();
  const [username, setUsername] = useState<string | null>("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>("");
  const [website, setWebsite] = useState<string | null>("");
  const [userId, setUserId] = useState<string | null>("");

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
    setUser(session?.user);
    return session.user;
  }

  async function getProfile() {
    try {
      const user = await getCurrentUser();

      let { data, error, status } = await supabase
        .from("profiles")
        .select(`username, website, avatar_url, user_id`)
        .eq("user_id", user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
        setUserId(data.user_id);
        setIsLoadin(false);
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
    }
  }

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <UserContext.Provider
      value={{ username, website, avatarUrl, userId, isLoading }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
