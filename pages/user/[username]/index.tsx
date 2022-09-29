import { useState, useEffect, FunctionComponent } from "react";

import { AuthSession } from "@supabase/supabase-js";
import Auth from "../../../components/Auth";
import CheckinFeed from "../../../components/CheckinFeed";
import ProfileStats from "../../../components/Elements/ProfileStats";
import Layout from "../../../components/Layout/Layout";
import { supabase } from "../../../utils/supabaseClient";
import { useUserContext } from "../../../state/UserContext";

interface MyActivityProps {}

const MyActivity: FunctionComponent<MyActivityProps> = () => {
  //   const [isLoading, setIsLoading] = useState(true);
  //   const [session, setSession] = useState<AuthSession | null>(null);
  const { session, isLoading } = useUserContext();

  return (
    <Layout title="Haunt Activity">
      <div className="md:flex">
        <div className="md:max-w-3xl md:w-4/5">
          <CheckinFeed />
        </div>
        <div className="px-4 hidden md:block w-full max-w-md ">
          <ProfileStats />
        </div>
      </div>
    </Layout>
  );
};

export default MyActivity;
