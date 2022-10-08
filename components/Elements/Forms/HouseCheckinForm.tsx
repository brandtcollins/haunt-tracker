import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Dispatch,
  FunctionComponent,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { iCheckIn, iHauntedHouse } from "../../../ts/Interfaces";
import { getHauntedHouses } from "../../../utils/HelperFunctions";
import { supabase } from "../../../utils/supabaseClient";
import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import * as Yup from "yup";
//prettier-ignore
import { Formik, Field, Form, FormikHelpers,useFormikContext, useFormik, FormikProps,FormikState, useField } from "formik";
import { useRouter } from "next/router";
import { User } from "@supabase/supabase-js";
import LoadingCircle from "../LoadingCircle";

interface HouseCheckinFormProps {
  setOpen?: Dispatch<SetStateAction<boolean>>;
}

const HouseCheckinForm: FunctionComponent<HouseCheckinFormProps> = ({
  setOpen,
}) => {
  //prettier-ignore
  const { data: hauntedHouseList } = useQuery<iHauntedHouse[]>(["haunted-houses"],getHauntedHouses);
  //prettier-ignore
  const [selectedHouseObject, setSelectedHouseObject] = useState<iHauntedHouse>();
  const [sliderValue, setSliderValue] = useState<number>(5);
  const queryClient = useQueryClient();
  const [currentUser, setCurrentUser] = useState<any>();
  const [selectedHouse, setSelectedHouse] = useState<string>("");
  const [runNotes, setRunNotes] = useState<string>("");
  const router = useRouter();
  const { username, checkinID } = router.query;
  const [user, setUser] = useState<User>();
  const { data: singleCheckInArray, isLoading } = useQuery(
    ["singleCheckin"],
    getCheckinsByUser,
    { enabled: Boolean(checkinID) }
  );

  async function getCheckinsByUser() {
    try {
      let { data, error, status } = await supabase
        .from("check-ins")
        .select("*")
        .eq("checkin_id", checkinID)
        .order("created_at", { ascending: true });

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        return data;
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    }
  }

  const postCheckin = async (values: iCheckIn) => {
    const { data, error } = await supabase.from("check-ins").upsert([values]);
    if (error) {
      throw error;
    }
    return data;
  };

  const updateCheckin = async (values: iCheckIn) => {
    const { data, error } = await supabase
      .from("check-ins")
      .update([values])
      .match({ checkin_id: checkinID });
    if (error) {
      throw error;
    }
    return data;
  };

  const mutation = useMutation(checkinID ? updateCheckin : postCheckin, {
    onSuccess: () => {
      router.push("/");
      queryClient.refetchQueries(["check-ins"]);
      queryClient.invalidateQueries(["singleCheckin"]);
    },
  });

  async function getCurrentUser() {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      throw error;
    }

    if (!session?.user) {
      throw new Error("User not logged in");
    }

    setCurrentUser(session.user.id);
  }

  useEffect(() => {
    setSelectedHouseObject(
      hauntedHouseList?.find(
        (house) => house.haunted_house_id === selectedHouse
      )
    );
  }, [selectedHouse]);

  useEffect(() => {
    getCurrentUser();
  }, []);

  const initialValues: iCheckIn = {
    haunted_house_id: "",
    rating: 2.5,
    user: currentUser,
    user_id: currentUser,
    note: "",
    estimated_wait_time: undefined,
    actual_wait_time: undefined,
    express: false,
  };

  const initialValuesEdit: iCheckIn = {
    haunted_house_id:
      singleCheckInArray && singleCheckInArray[0].haunted_house_id,
    rating: singleCheckInArray && singleCheckInArray[0].rating,
    user_id: currentUser,
    user: currentUser,
    note: singleCheckInArray && singleCheckInArray[0].note,
    estimated_wait_time:
      singleCheckInArray && singleCheckInArray[0].estimated_wait_time,
    actual_wait_time:
      singleCheckInArray && singleCheckInArray[0].actual_wait_time,
    express: singleCheckInArray && singleCheckInArray[0].express,
  };

  const HouseCheckinSchema = Yup.object().shape({
    haunted_house_id: Yup.string()
      .min(2, "Please select a house.")
      .required("Please select a house."),
    rating: Yup.number()
      .min(1, "Please rate between 1 and 5.")
      .max(5, "Please rate between 1 and 5.")
      .required("Please rate between 1 and 5."),
  });

  if (checkinID) {
    if (isLoading) {
      return <LoadingCircle />;
    }
  }
  return (
    <>
      <Formik
        enableReinitialize
        initialValues={checkinID ? initialValuesEdit : initialValues}
        onSubmit={(values) => mutation.mutate(values)}
        validationSchema={HouseCheckinSchema}
      >
        {({ errors, values, touched, isSubmitting }: FormikState<iCheckIn>) => (
          <Form className="text-white">
            {isSubmitting && <p>Submitting</p>}
            <div>
              <Field
                as="select"
                id="haunted_house_id"
                name="haunted_house_id"
                className="mt-1 h-12 block w-full rounded-md bg-darkGray-100 text-white border-darkGray-100 py-2 pl-3 pr-10 text-base focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 sm:text-sm"
              >
                <option disabled value="">
                  Select a house
                </option>
                {hauntedHouseList?.map((house) => (
                  <option
                    value={house.haunted_house_id}
                    key={house.haunted_house_id}
                  >
                    {house.name}
                  </option>
                ))}
              </Field>
              {errors.haunted_house_id && touched.haunted_house_id ? (
                <p className="mt-2 text-sm text-emerald-500" id="email-error">
                  {errors.haunted_house_id}
                </p>
              ) : null}
            </div>
            <div className="py-2">
              <label htmlFor="rating" className="block font-medium">
                Run rating: {values.rating}
              </label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <Field
                  name="rating"
                  type="range"
                  min="1"
                  max="5"
                  step="0.25"
                  id="rating"
                  placeholder="Give your run a rating between 1 and 5"
                  className="mt-1 h-12 block w-full rounded-md bg-darkGray-100 text-white border-darkGray-100 py-2 pl-3 pr-10 text-base focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 sm:text-sm"
                  aria-invalid="true"
                  aria-describedby="email-error"
                />
                {errors.rating && touched.rating ? (
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <ExclamationCircleIcon
                      className="h-5 w-5 text-emerald-500"
                      aria-hidden="true"
                    />
                  </div>
                ) : null}
              </div>
              {errors.rating && touched.rating ? (
                <p className="mt-2 text-sm text-emerald-500" id="email-error">
                  {errors.rating}
                </p>
              ) : null}
            </div>
            <div className="py-2">
              <label
                htmlFor="estimated_wait_time"
                className="block font-medium"
              >
                Estimated Wait Time (Optional)
              </label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <Field
                  name="estimated_wait_time"
                  type="number"
                  id="estimated_wait_time"
                  placeholder="What was your estimated wait time?"
                  className="mt-1 h-12 block w-full rounded-md bg-darkGray-100 text-white border-darkGray-100 py-2 pl-3 pr-10 text-base focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 sm:text-sm"
                  aria-invalid="true"
                  aria-describedby="email-error"
                />
              </div>
            </div>
            <div className="py-2">
              <label htmlFor="actual_wait_time" className="block font-medium">
                Actual Wait Time (Optional)
              </label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <Field
                  name="actual_wait_time"
                  type="number"
                  id="actual_wait_time"
                  placeholder="How long did you actually wait?"
                  className="mt-1 h-12 block w-full rounded-md bg-darkGray-100 text-white border-darkGray-100 py-2 pl-3 pr-10 text-base focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 sm:text-sm"
                  aria-invalid="true"
                  aria-describedby="email-error"
                />
              </div>
            </div>
            <div className="py-2">
              <label htmlFor="express" className="block font-medium">
                <Field
                  name="express"
                  type="checkbox"
                  id="express"
                  placeholder="What was your estimated wait time?"
                  aria-invalid="true"
                  aria-describedby="email-error"
                />
                <span className="pl-2">Did you use express passes?</span>
              </label>
              <div className="relative mt-1 rounded-md shadow-sm"></div>
            </div>
            <div className=" pt-2 pb-10">
              <label htmlFor="note" className="block font-medium">
                Run notes (Optional)
              </label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <Field
                  as="textarea"
                  name="note"
                  id="note"
                  placeholder="Have something specific to note about this run? Let's hear it!"
                  className="mt-1 block w-full rounded-md bg-darkGray-100 text-white border-darkGray-100 py-2 pl-3 pr-10 text-base focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 sm:text-sm h-24"
                  aria-invalid="true"
                  aria-describedby="email-error"
                />
              </div>
            </div>
            <button
              type="submit"
              className="inline-flex w-full justify-center rounded-md border border-transparent bg-emerald-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-emerald-600 sm:text-sm"
            >
              {checkinID ? "Edit Checkin" : "Submit Run"}
            </button>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default HouseCheckinForm;
