import { FunctionComponent } from "react";
import { supabase } from "../utils/supabaseClient";

interface CheckinFeedProps {}

const CheckinFeed: FunctionComponent<CheckinFeedProps> = () => {
  async function getCurrentUser() {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      throw error;
    }

    if (!session?.user) {
      throw new Error("User not logged in");
    }

    return session.user;
  }

  return <div>Checkin Feed</div>;
};

export default CheckinFeed;
