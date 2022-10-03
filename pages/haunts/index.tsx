import { useQuery } from "@tanstack/react-query";
import { FunctionComponent } from "react";
import LoadingCircle from "../../components/Elements/LoadingCircle";
import Layout from "../../components/Layout/Layout";
import { getHaunts } from "../../utils/HelperFunctions";

const people = [
  {
    name: "Jane Cooper",
    title: "Paradigm Representative",
    role: "Admin",
    email: "janecooper@example.com",
    telephone: "+1-202-555-0170",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
  },
  {
    name: "Jane Cooper",
    title: "Paradigm Representative",
    role: "Admin",
    email: "janecooper@example.com",
    telephone: "+1-202-555-0170",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
  },
  {
    name: "Jane Cooper",
    title: "Paradigm Representative",
    role: "Admin",
    email: "janecooper@example.com",
    telephone: "+1-202-555-0170",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
  },
  {
    name: "Jane Cooper",
    title: "Paradigm Representative",
    role: "Admin",
    email: "janecooper@example.com",
    telephone: "+1-202-555-0170",
    imageUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
  },
];
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

  if (hauntsAreLoading) {
    return <LoadingCircle />;
  }

  return (
    <Layout title="Haunts">
      <ul
        role="list"
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      >
        {haunts?.map((haunt, index) => (
          <li
            key={index}
            className="text-white col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-darkGray-300 border-2 border-darkGray-100 text-center shadow"
          >
            <div className="flex flex-1 flex-col p-8">
              {/* <img
                className="mx-auto h-32 w-32 flex-shrink-0 rounded-full"
                src={person.imageUrl}
                alt=""
              /> */}
              <h3 className="mt-6 font-medium text-xl">{haunt.haunt_name}</h3>
              <dl className="mt-1 flex flex-grow flex-col justify-between">
                <dt className="sr-only">Title</dt>
                {/* <dd className="text-sm text-gray-500">{person.title}</dd> */}
                <dt className="sr-only">Role</dt>
              </dl>
            </div>
          </li>
        ))}
      </ul>
    </Layout>
  );
};

export default Haunts;
