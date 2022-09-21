import { useState, useEffect, FunctionComponent } from "react";
import { supabase } from "../utils/supabaseClient";
import Auth from "../components/Auth";
import Account from "../components/Account";
import { AuthSession } from "@supabase/supabase-js";
import CheckInModal from "../components/Elements/CheckInModal";
import CheckinFeed from "../components/CheckinFeed";
import Layout from "../components/Layout/Layout";
import ProfileStats from "../components/Elements/ProfileStats";

interface HomeProps {}

const Home: FunctionComponent<HomeProps> = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

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
        }

        setIsLoading(false);
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

  if (!session) {
    return <Auth />;
  }

  return (
    <Layout title="Haunt Activity">
      <CheckInModal open={modalIsOpen} setOpen={setModalIsOpen} />
      <div className="md:flex">
        <div className="md:max-w-3xl md:w-4/5">
          <CheckinFeed open={modalIsOpen} setOpen={setModalIsOpen} />
        </div>
        <div className="px-4 hidden md:block w-full max-w-lg ">
          <ProfileStats />
        </div>
      </div>
    </Layout>
  );
};

export default Home;
