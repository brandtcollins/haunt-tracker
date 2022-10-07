import { useEffect, FunctionComponent } from "react";
import Layout from "../components/Layout/Layout";
import { useUserContext } from "../state/UserContext";
import { useQuery } from "@tanstack/react-query";
import { getAllCheckins, getCheckinsByUser } from "../utils/HelperFunctions";
import { useRouter } from "next/router";
import LoadingCircle from "../components/Elements/LoadingCircle";
import Header from "../components/Header/Header";
import Head from "next/head";

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
    <>
      <Head>
        <title>Haunt Tracker - Track your haunted experiences</title>
        <meta
          property="og:title"
          content="Haunt Tracker - Track your haunted experiences"
        />
      </Head>
      <div className="min-h-full">
        <div className="bg-darkGray-500 pb-32">
          <Header />
        </div>

        <main className="-mt-32 bg-darkGray-500 min-h-screen">
          <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
            {sessionLoaded ? (
              <LoadingCircle />
            ) : (
              <div className="text-white text-center flex flex-col md:flex-row justify-between mt-12">
                <div className="flex flex-col my-12 items-center text-center md:w-1/2 md:mt-32 gap-2">
                  <h1 className="font-bold text-5xl ">Haunt Tracker</h1>
                  <h2 className="text-emerald-500 md:w-1/2">
                    Find haunts around you and keep track of the haunts you've
                    visited.
                  </h2>
                </div>
                <div className="md:w-1/2">
                  <img src="/images/phone-mockup.png" />
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default Home;
