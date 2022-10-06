import { FunctionComponent } from "react";
import AddNewHouseForm from "../../../components/Elements/Forms/AddNewHouseForm";
import HouseCheckinForm from "../../../components/Elements/Forms/HouseCheckinForm";
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
