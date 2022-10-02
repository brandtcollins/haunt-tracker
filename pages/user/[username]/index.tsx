import { useEffect, FunctionComponent, useState } from "react";
import CheckinFeed from "../../../components/CheckinFeed";
import ProfileStats from "../../../components/Elements/ProfileStats";
import Layout from "../../../components/Layout/Layout";
import { useUserContext } from "../../../state/UserContext";
import { useQuery } from "@tanstack/react-query";
import { getCheckins, getUserID } from "../../../utils/HelperFunctions";
import { useRouter } from "next/router";

interface MyActivityProps {}

const MyActivity: FunctionComponent<MyActivityProps> = () => {
  const router = useRouter();
  const { username } = router.query;
  const [userID, setUserID] = useState<string | null>(null);
  const { data: userIDQuery } = useQuery(
    ["userID", username],
    () => getUserID(username),
    {
      enabled: !!username,
    }
  );

  const { data: userCheckinArray, isLoading } = useQuery(
    ["getCheckins", userID],
    () => getCheckins(userID),
    {
      enabled: !!userID,
    }
  );

  useEffect(() => {
    if (userIDQuery) {
      setUserID(userIDQuery[0].user_id);
    }
  }, [userIDQuery]);

  return (
    <Layout title="Haunt Activity">
      <div className="md:flex">
        <div className="md:max-w-3xl md:w-4/5">
          <CheckinFeed
            checkInFeedData={userCheckinArray}
            dataLoading={isLoading}
          />
        </div>
        <div className="px-4 hidden md:block w-full max-w-md ">
          <ProfileStats />
        </div>
      </div>
    </Layout>
  );
};

export default MyActivity;
