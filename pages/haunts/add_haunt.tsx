import { FunctionComponent } from "react";
import AddNewHauntForm from "../../components/Elements/Forms/AddNewHauntForm";
import AddNewHouseForm from "../../components/Elements/Forms/AddNewHouseForm";
import Layout from "../../components/Layout/Layout";

interface NewHauntProps {}

const NewHaunt: FunctionComponent<NewHauntProps> = () => {
  return (
    <Layout title="Add New Haunt">
      <AddNewHauntForm />
    </Layout>
  );
};

export default NewHaunt;
