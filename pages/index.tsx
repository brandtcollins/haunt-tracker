import { FunctionComponent } from "react";
import Auth from "../components/Auth";
import CheckinFeed from "../components/CheckinFeed";
import Layout from "../components/Layout/Layout";
import ProfileStats from "../components/Elements/ProfileStats";
import { useUserContext } from "../state/UserContext";
import { getAllCheckins } from "../utils/HelperFunctions";
import { useQuery } from "@tanstack/react-query";

interface HomeProps {}

const Home: FunctionComponent<HomeProps> = () => {
  const { session, isLoading } = useUserContext();

  const { data: checkInArray, isLoading: checkInsLoading } = useQuery(
    ["all-check-ins"],
    () => getAllCheckins()
  );

  if (!session) {
    return <Auth />;
  }

  return (
    <Layout title="Home">
      <div className="md:flex">
        <div className="md:max-w-3xl md:w-4/5">
          <CheckinFeed checkInFeedData={checkInArray} dataLoading={isLoading} />
        </div>
        <div className="px-4 hidden md:block w-full max-w-md ">
          <ProfileStats />
        </div>
      </div>
    </Layout>
  );
};

export default Home;
