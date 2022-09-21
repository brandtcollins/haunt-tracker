import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Dispatch,
  FunctionComponent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { iCheckIn, iHauntedHouse } from "../../../ts/Interfaces";
import { getHauntedHouses } from "../../../utils/HelperFunctions";
import { supabase } from "../../../utils/supabaseClient";
import { ValueTarget } from "framer-motion";
import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import * as Yup from "yup";
//prettier-ignore
import { Formik, Field, Form, FormikHelpers,useFormikContext, useFormik, FormikProps,FormikState } from "formik";

interface HouseCheckinFormProps {
  setOpen: Dispatch<SetStateAction<boolean>>;
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
  const [loading, setLoading] = useState<boolean>(true);

  const postCheckin = async (values: iCheckIn) => {
    const { data, error } = await supabase.from("check-ins").upsert([values]);
    if (error) {
      throw error;
    }
    return data;
  };

  const mutation = useMutation(postCheckin, {
    onSuccess: () => {
      queryClient.invalidateQueries(["check-ins"]);
      setOpen(false);
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
    setLoading(false);
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
    rating: undefined,
    user_id: currentUser,
    note: "",
    estimated_wait_time: undefined,
    actual_wait_time: undefined,
    express: false,
  };

  const onSubmit = (values: iCheckIn, helpers: FormikHelpers<iCheckIn>) => {
    console.log({ values, helpers });
    setTimeout(() => helpers.setSubmitting(false), 2000);
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

  if (loading) {
    return <p>Loading</p>;
  }

  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={(values) => mutation.mutate(values)}
        validationSchema={HouseCheckinSchema}
      >
        {({ errors, touched, isSubmitting }: FormikState<iCheckIn>) => (
          <Form className="text-white">
            {isSubmitting && <p>Submitting</p>}
            <div>
              <Field
                as="select"
                id="haunted_house_id"
                name="haunted_house_id"
                className="mt-1 h-12 block w-full rounded-md bg-darkGray-100 text-white border-darkGray-100 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
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
                Run rating
              </label>
              <div className="relative mt-1 rounded-md shadow-sm">
                <Field
                  name="rating"
                  type="number"
                  id="rating"
                  placeholder="Give your run a rating between 1 and 5"
                  className="mt-1 h-12 block w-full rounded-md bg-darkGray-100 text-white border-darkGray-100 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  defaultValue=""
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
                  className="mt-1 h-12 block w-full rounded-md bg-darkGray-100 text-white border-darkGray-100 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
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
                  className="mt-1 h-12 block w-full rounded-md bg-darkGray-100 text-white border-darkGray-100 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
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
                  className="mt-1 h-12 block w-full rounded-md bg-darkGray-100 text-white border-darkGray-100 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm h-24"
                  aria-invalid="true"
                  aria-describedby="email-error"
                />
              </div>
            </div>
            <button
              type="submit"
              className="inline-flex w-full justify-center rounded-md border border-transparent bg-emerald-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 sm:text-sm"
            >
              Submit Run
            </button>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default HouseCheckinForm;

{
  /* 
<Form>
          <label
            htmlFor="location"
            className="block font-medium text-white mb-4 pl-3"
          >
            What house did you just run?
          </label>
          <select
            id="location"
            name="location"
            className="mt-1 h-12 block w-full rounded-md bg-darkGray-100 text-white border-darkGray-100 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            defaultValue="Canada"
            onChange={(event) => setFieldValue("rating", event.target.value)}
          >
            {hauntedHouseList?.map((house) => (
              <option
                value={house.haunted_house_id}
                key={house.haunted_house_id}
              >
                {house.name}
              </option>
            ))}
          </select>

          <label
            htmlFor="steps-range"
            className="block font-medium text-white py-4 pl-4"
          >
            Run rating: {sliderValue}
          </label>
          <input
            id="steps-range"
            type="range"
            min="0"
            max="5"
            value={sliderValue}
            step="0.25"
            onChange={(event) => setFieldValue("rating", event.target.value)}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 mb-8"
          />
          <div className="py-4">
            <div className="relative rounded-md border border-darkGray-100 px-3 py-2 my-2 shadow-sm focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600">
              <label
                htmlFor="name"
                className="absolute -top-4 left-2 -mt-px inline-block bg-darkGray-300 px-1 font-medium text-white"
              >
                Estimated Wait Time (Optional)
              </label>
              <input
                type="number"
                name="Estimated Wait Time"
                id="estimatedWaitTime"
                className="block w-full border-0 p-0 text-white placeholder-gray-500 focus:ring-0 sm:text-sm bg-darkGray-300 h-7"
                placeholder="Enter time in minutes"
              />
            </div>
          </div>
          <div className="pb-4">
            <div className="relative rounded-md border border-darkGray-100 px-3 py-2 my-2 shadow-sm focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600">
              <label
                htmlFor="name"
                className="absolute -top-4 left-2 -mt-px inline-block bg-darkGray-300 px-1 font-medium text-white"
              >
                Actual Wait Time (Optional)
              </label>
              <input
                type="number"
                name="Actual Wait Time"
                id="actualWaitTime"
                className="block w-full border-0 p-0 text-white placeholder-gray-500 focus:ring-0 sm:text-sm bg-darkGray-300  h-7"
                placeholder="Enter time in minutes"
              />
            </div>
          </div>
          <div>
            <div className="relative rounded-md border border-darkGray-100 px-3 py-2 my-2 shadow-sm focus-within:border-indigo-600 focus-within:ring-1 focus-within:ring-indigo-600">
              <label
                htmlFor="name"
                className="absolute -top-4 left-2 -mt-px inline-block bg-darkGray-300 px-1 font-medium text-white"
              >
                Notes on this run (Optional)
              </label>
              <textarea
                name="Notes"
                id="notes"
                className="block w-full border-0 p-0 text-white placeholder-gray-500 focus:ring-0 sm:text-sm bg-darkGray-300 h-24"
                placeholder="How was this run? Leave a note!"
                onChange={(e) => setRunNotes(e.target.value)}
              />
            </div>
          </div>
          <div className="mt-5 sm:mt-6">
            <button
              type="button"
              className="inline-flex w-full justify-center rounded-md border border-transparent bg-emerald-500 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 sm:text-sm"
              onClick={() => mutation.mutate()}
            >
              Submit Checkin
            </button>
          </div>
        </Form> */
}
