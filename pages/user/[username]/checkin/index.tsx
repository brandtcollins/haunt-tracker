import { FunctionComponent, useState } from "react";
import HouseCheckinForm from "../../../../components/Elements/Forms/HouseCheckinForm";
import Layout from "../../../../components/Layout/Layout";

interface CheckinProps {}

const Checkin: FunctionComponent<CheckinProps> = () => {
  return (
    <Layout title="House Checkin">
      <HouseCheckinForm />
    </Layout>
  );
};

export default Checkin;
