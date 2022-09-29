import { useState, useEffect, FunctionComponent } from "react";
import { supabase } from "../utils/supabaseClient";
import Auth from "../components/Auth";
import { AuthSession } from "@supabase/supabase-js";
import CheckinFeed from "../components/CheckinFeed";
import Layout from "../components/Layout/Layout";
import ProfileStats from "../components/Elements/ProfileStats";
import { useUserContext } from "../state/UserContext";

interface HomeProps {}

const Home: FunctionComponent<HomeProps> = () => {
  const { session, isLoading } = useUserContext();

  if (!session) {
    return <Auth />;
  }

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

export default Home;
