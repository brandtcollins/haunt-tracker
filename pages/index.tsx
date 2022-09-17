import { useState, useEffect, FunctionComponent } from "react";
import { supabase } from "../utils/supabaseClient";
import Auth from "../components/Auth";
import Account from "../components/Account";
import { AuthSession } from "@supabase/supabase-js";
import CheckInModal from "../components/Elements/CheckInModal";
import CheckinFeed from "../components/CheckinFeed";
import Layout from "../components/Layout/Layout";

interface HomeProps {}

const Home: FunctionComponent<HomeProps> = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(true);

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

  return (
    <Layout>
      <CheckInModal open={modalIsOpen} setOpen={setModalIsOpen} />
      <CheckinFeed />
    </Layout>
  );

  // return (
  //   <div>
  //     {!session ? (
  //       <Auth />
  //     ) : (
  //       <div>
  //         <div>
  //           <div>
  //             <CheckInModal />
  //             <CheckinFeed />
  //           </div>
  //         </div>
  //         <div>
  //           <Account key={session.user.id} session={session} />
  //         </div>
  //       </div>
  //     )}
  //   </div>
  // );
};

export default Home;
