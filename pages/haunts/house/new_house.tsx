import { FunctionComponent } from "react";
import AddNewHouseForm from "../../../components/Elements/Forms/AddNewHouseForm";
import Layout from "../../../components/Layout/Layout";

interface NewHouseProps {}

const NewHouse: FunctionComponent<NewHouseProps> = () => {
  return (
    <Layout title="Add New House">
      <AddNewHouseForm />
    </Layout>
  );
};

export default NewHouse;
