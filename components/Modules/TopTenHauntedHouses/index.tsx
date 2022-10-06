import { FunctionComponent, useEffect } from "react";
import { useUserContext } from "../../../state/UserContext";
import { getCheckinsByUser } from "../../../utils/HelperFunctions";

interface TopTenHauntedHousesProps {}

const TopTenHauntedHouses: FunctionComponent<TopTenHauntedHousesProps> = () => {
  const { website, username, avatarUrl, userId } = useUserContext();
  useEffect(() => {
    if (userId) {
      getCheckinsByUser(userId);
    }
  }, [userId]);

  return (
    <div className="border-2 border-darkGray-100 rounded-lg p-4">
      Top House Runs
    </div>
  );
};

export default TopTenHauntedHouses;
