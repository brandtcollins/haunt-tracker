import { AuthSession, Session, User } from "@supabase/supabase-js";
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
  user?: User;
  session: Session | null;
}

interface UserProviderProps {
  children: ReactNode;
}

export const UserContext = createContext<UserContextProps>(
  {} as UserContextProps
);
export const useUserContext = () => useContext(UserContext);

const UserProvider: FunctionComponent<UserProviderProps> = ({ children }) => {
  const [sessionLoaded, setSessionLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User>();
  const [username, setUsername] = useState<string | null>("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>("");
  const [website, setWebsite] = useState<string | null>("");
  const [userId, setUserId] = useState<string | null>("");
  const [session, setSession] = useState<AuthSession | null>(null);

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

  useEffect(() => {
    let mounted = true;

    async function getInitialSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      // only update the react state if the component is still mounted
      if (mounted) {
        if (session) {
          setSession(session);
          setSessionLoaded(true);
        }
      }
    }

    getInitialSession();

    const supabaseAuth: any = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      mounted = false;

      supabaseAuth.subscription?.unsubscribe();
    };
  }, []);

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
      let { data, error, status } = await supabase
        .from("profiles")
        .select(`username, website, avatar_url, user_id`)
        .eq("user_id", user?.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setWebsite(data.website);
        setUserId(data.user_id);
        setIsLoading(false);
        if (data.avatar_url) {
          downloadImage(data.avatar_url);
        }
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
    }
  }
  useEffect(() => {
    if (sessionLoaded) {
      getCurrentUser();
    }
  }, [session]);

  useEffect(() => {
    if (sessionLoaded) {
      getProfile();
    }
  }, [user]);

  return (
    <UserContext.Provider
      value={{ username, website, avatarUrl, userId, isLoading, user, session }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
