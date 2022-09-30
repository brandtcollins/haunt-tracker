import { FunctionComponent } from "react";
import HouseCheckinForm from "../../../../../../components/Elements/Forms/HouseCheckinForm";
import Layout from "../../../../../../components/Layout/Layout";

interface EditCheckinProps {}

const EditCheckin: FunctionComponent<EditCheckinProps> = () => {
  return (
    <Layout title="Edit Checkin">
      <HouseCheckinForm />
    </Layout>
  );
};

export default EditCheckin;
