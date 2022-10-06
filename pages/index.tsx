import { useEffect, FunctionComponent } from "react";
import Layout from "../components/Layout/Layout";
import { useUserContext } from "../state/UserContext";
import { useQuery } from "@tanstack/react-query";
import { getAllCheckins, getCheckinsByUser } from "../utils/HelperFunctions";
import { useRouter } from "next/router";
import LoadingCircle from "../components/Elements/LoadingCircle";

export async function getServerSideProps() {
  return {
    props: {
      initialCheckins: await getAllCheckins(),
    },
  };
}

interface HomeProps {
  initialAllUserCheckins: any[];
}

const Home: FunctionComponent<HomeProps> = ({ initialAllUserCheckins }) => {
  const { isLoading, session, sessionLoaded } = useUserContext();
  const { userId } = useUserContext();
  const router = useRouter();
  const { data: allCheckIns } = useQuery(["all-check-ins"], getAllCheckins, {
    initialData: initialAllUserCheckins,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const { data: userCheckIns, isLoading: userCheckInsLoading } = useQuery(
    ["user-check-ins", userId],
    () => getCheckinsByUser(userId),
    {
      enabled: !!userId,
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    if (session) {
      router.push("/activity");
    }
  }, [sessionLoaded]);

  return (
    <Layout title="Haunt Activity">
      {sessionLoaded ? <LoadingCircle /> : <div>Content</div>}
    </Layout>
  );
};

export default Home;
