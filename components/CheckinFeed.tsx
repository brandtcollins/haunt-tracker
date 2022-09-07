import { Box } from "@chakra-ui/react";
import { FunctionComponent, useEffect, useState } from "react";
import { iCheckIn } from "../ts/Interfaces";
import { supabase } from "../utils/supabaseClient";

interface CheckinFeedProps {}

const CheckinFeed: FunctionComponent<CheckinFeedProps> = () => {
  const [checkIns, setCheckIns] = useState<iCheckIn[]>();
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
  async function getCheckins() {
    try {
      const user = await getCurrentUser();

      let { data, error, status } = await supabase
        .from("check-ins")
        .select("*")
        .eq("user_id", user.id);

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setCheckIns(data);
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  }

  useEffect(() => {
    console.log(checkIns);
  }, [checkIns]);

  useEffect(() => {
    getCheckins();
  }, []);

  return (
    <div>
      Checkin Feed
      {checkIns
        ?.map((checkIn) => (
          <Box mt="2" mb="2" background="gray.100">
            <p>{checkIn.haunted_house_name}</p>
            <p>Run rating: {checkIn.rating}</p>
          </Box>
        ))
        .reverse()}
    </div>
  );
};

export default CheckinFeed;
