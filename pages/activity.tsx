import { FunctionComponent } from "react";
import CheckinFeed from "../components/Modules/CheckInFeeds.tsx/CheckinFeed";
import Layout from "../components/Layout/Layout";
import ProfileStats from "../components/Elements/Profile/ProfileStats";
import { useUserContext } from "../state/UserContext";
import { useQuery } from "@tanstack/react-query";
import { getAllCheckins, getCheckinsByUser } from "../utils/HelperFunctions";
import WithAuth from "../components/HOC/WithAuth";
import CheckInButton from "../components/Elements/CheckInButton";

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
  const { userId, isLoading } = useUserContext();
  const { data: allCheckIns } = useQuery(["all-check-ins"], getAllCheckins, {
    initialData: initialAllUserCheckins,
    refetchOnWindowFocus: false,
  });

  const { data: userCheckIns, isLoading: userCheckInsLoading } = useQuery(
    ["user-check-ins", userId],
    () => getCheckinsByUser(userId),
    {
      enabled: !!userId,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  return (
    <WithAuth>
      <Layout title="Haunt Activity">
        <div className="md:flex">
          <div className="md:max-w-3xl md:w-4/5">
            <CheckInButton mobileOnly />
            {allCheckIns && (
              <CheckinFeed
                checkInFeedData={allCheckIns}
                dataLoading={isLoading}
              />
            )}
          </div>
          <div className="px-4 hidden md:flex w-full max-w-md flex-col gap-4">
            <ProfileStats
              checkIns={userCheckIns}
              checkInsLoading={userCheckInsLoading}
            />
          </div>
        </div>
      </Layout>
    </WithAuth>
  );
};

export default Home;
