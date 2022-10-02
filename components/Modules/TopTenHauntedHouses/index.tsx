import { FunctionComponent, useEffect } from "react";
import { useUserContext } from "../../../state/UserContext";
import { getCheckins } from "../../../utils/HelperFunctions";

interface TopTenHauntedHousesProps {}

const TopTenHauntedHouses: FunctionComponent<TopTenHauntedHousesProps> = () => {
  const { website, username, avatarUrl, userId } = useUserContext();
  useEffect(() => {
    if (userId) {
      getCheckins(userId);
    }
  }, [userId]);

  return (
    <div className="border-2 border-darkGray-100 rounded-lg p-4">
      Top House Runs
    </div>
  );
};

export default TopTenHauntedHouses;
