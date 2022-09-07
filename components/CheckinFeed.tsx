import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import { User } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";
import { FunctionComponent, useEffect, useState } from "react";
import { iCheckIn } from "../ts/Interfaces";
import { supabase } from "../utils/supabaseClient";

interface CheckinFeedProps {}

const CheckinFeed: FunctionComponent<CheckinFeedProps> = () => {
  const [checkIns, setCheckIns] = useState<iCheckIn[]>();
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(null);
  const [website, setWebsite] = useState<string | null>(null);
  const [avatar_url, setAvatarUrl] = useState<string | null>(null);

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
    setUser(session?.user);
    return session.user;
  }

  async function getProfile() {
    try {
      setLoading(true);
      const user = await getCurrentUser();

      let { data, error, status } = await supabase
        .from("profiles")
        .select(`username, website, avatar_url`)
        .eq("user_id", user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setWebsite(data.website);
        data.avatar_url && setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      setLoading(false);
    }
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
        return data;
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  }
  const { data: checkInArray } = useQuery(["check-ins"], getCheckins);

  useEffect(() => {
    setCheckIns(checkInArray);
  }, [checkInArray]);

  useEffect(() => {
    getCheckins();
    getProfile();
  }, []);

  return (
    <Box background="white" mt="4" pt="4">
      <Text fontSize="2xl" as="b" p="2">
        Recent Activity
      </Text>
      {checkIns
        ?.map((checkIn) => (
          <Flex justifyItems="center">
            <Avatar name={username} src="" mr="4" />
            <Box mt="2" mb="2" p="2">
              <Text>
                {username} just ran{" "}
                <Text fontSize="xl" as="b">
                  {checkIn.haunted_house_name}
                </Text>{" "}
                and gave the run a{" "}
                <Text as="b">{checkIn.rating / 2} out of 5</Text>.
              </Text>
            </Box>
          </Flex>
        ))
        .reverse()}
    </Box>
  );
};

export default CheckinFeed;
