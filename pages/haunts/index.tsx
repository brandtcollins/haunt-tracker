import { useQuery } from "@tanstack/react-query";
import { FunctionComponent } from "react";
import LoadingCircle from "../../components/Elements/LoadingCircle";
import Layout from "../../components/Layout/Layout";
import HauntCard from "../../components/Modules/HauntCard";
import { getHaunts } from "../../utils/HelperFunctions";
import { supabase } from "../../utils/supabaseClient";

interface HauntsProps {}

const Haunts: FunctionComponent<HauntsProps> = () => {
  const { data: haunts, isLoading: hauntsAreLoading } = useQuery(
    ["haunts"],
    getHaunts,
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  return (
    <Layout title="Haunts">
      {hauntsAreLoading ? (
        <LoadingCircle />
      ) : (
        <ul
          role="list"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        >
          {haunts?.map((haunt, index) => (
            <HauntCard haunt={haunt} key={index} />
          ))}
        </ul>
      )}
    </Layout>
  );
};

export default Haunts;
