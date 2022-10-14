import { useEffect, FunctionComponent, useState } from "react";
import CheckinFeed from "../../../components/Modules/CheckInFeeds.tsx/CheckinFeed";
import ProfileStats from "../../../components/Elements/Profile/ProfileStats";
import Layout from "../../../components/Layout/Layout";
import { useQuery } from "@tanstack/react-query";
import {
  getCheckinsByUser,
  getUserProfile,
} from "../../../utils/HelperFunctions";
import { useRouter } from "next/router";
import CheckInButton from "../../../components/Elements/CheckInButton";
import { useUserContext } from "../../../state/UserContext";

interface MyActivityProps {}

const MyActivity: FunctionComponent<MyActivityProps> = () => {
  const router = useRouter();
  const { username } = router.query;
  const { username: loggedInUsername } = useUserContext();

  const [userId, setUserID] = useState<string | null>(null);
  const { data: userProfile } = useQuery(
    ["UserProfile", username],
    () => getUserProfile(username),
    {
      enabled: !!username,
    }
  );

  const { data: userCheckinArray, isLoading } = useQuery(
    ["getCheckinsByUser", userId],
    () => getCheckinsByUser(userId),
    {
      enabled: !!userId,
    }
  );

  const { data: userCheckIns, isLoading: userCheckInsLoading } = useQuery(
    ["user-check-ins", userId],
    () => getCheckinsByUser(userId),
    {
      enabled: !!userId,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    if (userProfile) {
      setUserID(userProfile[0].user_id);
    }
  }, [userProfile]);

  return (
    <Layout title="Haunt Activity">
      <div className="md:flex">
        <div className="md:max-w-3xl md:w-4/5">
          <CheckInButton mobileOnly />
          <CheckinFeed
            checkInFeedData={userCheckinArray}
            dataLoading={isLoading}
          />
        </div>
        <div className="px-4 hidden md:block w-full max-w-md ">
          {loggedInUsername === username && <CheckInButton />}
          <ProfileStats
            userProfile={userProfile && userProfile[0]}
            checkIns={userCheckIns}
            checkInsLoading={userCheckInsLoading}
          />
        </div>
      </div>
    </Layout>
  );
};

export default MyActivity;
