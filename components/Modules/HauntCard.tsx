import { useQuery } from "@tanstack/react-query";
import { FunctionComponent } from "react";
import { supabase } from "../../utils/supabaseClient";

interface HauntCardProps {
  haunt: any;
}

const HauntCard: FunctionComponent<HauntCardProps> = ({ haunt }) => {
  const { data: hauntImage } = useQuery(
    ["hauntImage", haunt.haunt_name],
    () => downloadImage(haunt.image ? haunt.image : ""),
    {
      enabled: !!haunt.image,
    }
  );

  async function downloadImage(path: string | null) {
    if (!path) {
      return;
    }
    try {
      const { data } = await supabase.storage
        .from("haunt-images")
        .getPublicUrl(path);
      return data;
    } catch (error: any) {
      console.log("Error downloading image: ", error.message);
    }
  }

  return (
    <li className="text-white col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-darkGray-300 border-2 border-darkGray-100 text-center shadow">
      <div className="flex flex-1 flex-col p-8">
        <img
          className="mx-auto h-32 w-32 flex-shrink-0 rounded-full"
          src={hauntImage?.publicUrl}
          alt=""
        />
        <h3 className="mt-6 font-medium text-xl">{haunt.haunt_name}</h3>
        <dl className="mt-1 flex flex-grow flex-col justify-between">
          <dt className="sr-only">Title</dt>
          <dd className="text-sm text-gray-500">
            {haunt.themepark_location.name}
          </dd>
          <dt className="sr-only">Role</dt>
        </dl>
      </div>
    </li>
  );
};

export default HauntCard;
