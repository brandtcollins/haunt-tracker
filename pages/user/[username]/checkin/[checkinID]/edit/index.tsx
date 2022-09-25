import { User } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { FunctionComponent, useState } from "react";
import HouseCheckinForm from "../../../../../../components/Elements/Forms/HouseCheckinForm";
import Layout from "../../../../../../components/Layout/Layout";
import { supabase } from "../../../../../../utils/supabaseClient";

interface EditCheckinProps {}

const EditCheckin: FunctionComponent<EditCheckinProps> = () => {
  return (
    <Layout title="Edit Checkin">
      <HouseCheckinForm />
    </Layout>
  );
};

export default EditCheckin;
