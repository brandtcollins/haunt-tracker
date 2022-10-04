import { useState, useEffect, FunctionComponent } from "react";
import { supabase } from "../utils/supabaseClient";
import Auth from "../components/Auth";
import { AuthSession } from "@supabase/supabase-js";
import CheckinFeed from "../components/CheckinFeed";
import Layout from "../components/Layout/Layout";
import ProfileStats from "../components/Elements/ProfileStats";
import { useUserContext } from "../state/UserContext";
import { useQuery } from "@tanstack/react-query";
import { getAllCheckins, getCheckins } from "../utils/HelperFunctions";
import { iCheckIn } from "../ts/Interfaces";

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
  const { session, isLoading } = useUserContext();
  const { website, username, avatarUrl, userId } = useUserContext();
  const { data: allCheckIns } = useQuery(["all-check-ins"], getAllCheckins, {
    initialData: initialAllUserCheckins,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  const { data: userCheckIns, isLoading: userCheckInsLoading } = useQuery(
    ["user-check-ins", userId],
    () => getCheckins(userId),
    {
      enabled: !!userId,
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    console.log(userId);
  }, [userId]);

  if (!session) {
    return <Auth />;
  }

  return (
    <Layout title="Haunt Activity">
      <div className="md:flex">
        <div className="md:max-w-3xl md:w-4/5">
          <CheckinFeed checkInFeedData={allCheckIns} dataLoading={isLoading} />
        </div>
        <div className="px-4 hidden md:block w-full max-w-md ">
          <ProfileStats
            checkIns={userCheckIns}
            checkInsLoading={userCheckInsLoading}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Home;
