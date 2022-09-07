import { useState, useEffect, FunctionComponent } from "react";
import { supabase } from "../utils/supabaseClient";
import Auth from "../components/Auth";
import Account from "../components/Account";
import { AuthSession } from "@supabase/supabase-js";
import CheckIn from "../components/Checkin";
import CheckInModal from "../components/CheckInModal";
import { Box, Flex } from "@chakra-ui/react";
import CheckinFeed from "../components/CheckinFeed";

interface HomeProps {}

const Home: FunctionComponent<HomeProps> = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<AuthSession | null>(null);

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

    const { subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      mounted = false;

      subscription?.unsubscribe();
    };
  }, []);

  return (
    <div className="container" style={{ padding: "50px 0 100px 0" }}>
      {!session ? (
        <Auth />
      ) : (
        <Flex>
          <Box p="2" w="100%">
            <Flex direction="column">
              <CheckInModal />
              <CheckinFeed />
            </Flex>
          </Box>
          <Box p="2" w="100%" maxW="325px">
            <Account key={session.user.id} session={session} />
          </Box>
        </Flex>
      )}
    </div>
  );
};

export default Home;
