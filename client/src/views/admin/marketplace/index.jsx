import Banner from "./components/Banner";
import Tables from "../tables";
import Widget from "../../../components/widget/Widget";
import {
  MdBarChart,
  MdDashboard,
  MdOutlineDataThresholding,
  MdOutlineTextSnippet,
} from "react-icons/md";
import { IoDocuments } from "react-icons/io5";
import { IoMdHome } from "react-icons/io";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../../config";
import { toast } from "react-toastify";

const Dashboard = ({ isAdmin }) => {
  const [state, setState] = useState({});
  const { title, description } = state;
  const [showModal, setShowModal] = useState(false);
  const [threshold, setThreshold] = useState(0);
  const [userData, setUserData] = useState({});
  const [petitions, setPetitions] = useState([]);

  const getUserDataById = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("authToken");
      const response = await axios.get(`${BASE_URL}/get/petitioner/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isAdmin === false) {
      Promise.all([getUserDataById()]);
    }
    getAllPetitions();
    getGlobalThreshold();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "threshold") {
      if (value >= 0) {
        setThreshold(value);
      }
    } else {
      setState({ ...state, [name]: value });
    }
  };

  const handlePetitionCreation = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const body = {
        title,
        description,
      };
      const response = await axios.post(`${BASE_URL}/petition/create`, body, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setState({});
      getAllPetitions();
      toast.success("Petition created successfully!");
    } catch (error) {
      console.error(error);
    }
  };

  const getAllPetitions = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await axios.get(`${BASE_URL}/petition/getall`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPetitions(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getGlobalThreshold = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/petition/get-global-threshold`
      );
      // set the threshold response.data
      // console.log(response.data);
      setThreshold(response.data?.threshold);
    } catch (error) {
      console.error(error);
    }
  };

  const handleThresholdUpdate = async () => {
    try {
      // from ppetitions get all the signatures seperately and if hte length of the array is equal to the threshold then the status is closed else open
      if (threshold <= 0) {
        toast.warn("Threshold cannot be negative or zero!");
        return;
      }
      const response = await axios.put(
        `${BASE_URL}/petition/set-global-threshold`,
        {
          threshold,
        }
      );
      toast.success("Threshold updated successfully!");
      setThreshold(response.data?.threshold);
      getGlobalThreshold();
      getAllPetitions();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="mt-3 grid h-full grid-cols-1 gap-5 xl:grid-cols-2 2xl:grid-cols-3">
        <div className=" h-fit w-full xl:col-span-3 2xl:col-span-3">
          <Banner
            isAdmin={isAdmin}
            userName={userData?.username || "Petitioner"}
          />
        </div>
      </div>
      {/* <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-6">
        <Widget
          icon={<MdBarChart className="h-7 w-7" />}
          title={"Earnings"}
          subtitle={"£340.5"}
        />
        <Widget
          icon={<IoDocuments className="h-6 w-6" />}
          title={"Spend this month"}
          subtitle={"£642.39"}
        />
        <Widget
          icon={<MdBarChart className="h-7 w-7" />}
          title={"Sales"}
          subtitle={"£574.34"}
        />
        <Widget
          icon={<MdDashboard className="h-6 w-6" />}
          title={"Your Balance"}
          subtitle={"£1,000"}
        />
        <Widget
          icon={<MdBarChart className="h-7 w-7" />}
          title={"New Tasks"}
          subtitle={"145"}
        />
        <Widget
          icon={<IoMdHome className="h-6 w-6" />}
          title={"Total Projects"}
          subtitle={"£2433"}
        />
      </div> */}

      {isAdmin && (
        <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-6">
          <div className="relative mt-[20px] flex h-[61px] w-[355px]   items-center justify-around gap-2 rounded-full bg-white px-2 py-2 shadow-xl shadow-shadow-500 dark:!bg-navy-800 dark:shadow-none md:w-[365px] md:flex-grow-0 md:gap-1 xl:w-[465px] xl:gap-2">
            <p className="text-xl">
              <MdOutlineDataThresholding className="h-7 w-7 text-gray-700 dark:text-white" />
            </p>
            <label
              className=" font-medium text-gray-600 dark:text-white"
              htmlFor="threshold"
            >
              <p className="text-base font-medium text-gray-600 dark:text-white">
                Set the threshold
              </p>
            </label>
            <div className="flex h-full items-center rounded-full bg-lightPrimary text-navy-700 dark:bg-navy-900 dark:text-white xl:w-[325px]">
              <input
                type="number"
                placeholder="Set the threshold"
                className="pl-3 block h-full w-full rounded-full bg-lightPrimary text-sm font-medium text-navy-700 outline-none placeholder:!text-gray-400 dark:bg-navy-900 dark:text-white dark:placeholder:!text-white sm:w-fit"
                value={threshold}
                onChange={handleChange}
                name="threshold"
              />
            </div>
            <div className=" flex items-center justify-between gap-4 sm:justify-start 2xl:gap-10">
              <button
                className="text-black linear rounded-xl bg-gray-200 px-4 py-2 text-center text-base font-medium transition duration-200
            hover:bg-gray-300 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white"
                onClick={handleThresholdUpdate}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {!isAdmin && (
        <div className="mt-3 ">
          <button
            onClick={() => {
              setShowModal(true);
            }}
            className="
            text-black linear rounded-xl bg-gray-200 px-4 py-2 text-center text-base font-medium transition duration-200
            hover:bg-gray-300 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white
          "
          >
            <div className=" flex items-center justify-between gap-4 sm:justify-start ">
              <span className=" font-medium text-gray-800 dark:text-white">
                Add New Petition +
              </span>
              <MdOutlineTextSnippet className="h-7 w-7 text-gray-700 dark:text-white" />
            </div>
          </button>
        </div>
      )}
      <Tables
        isAdmin={isAdmin}
        petitions={petitions}
        userId={userData?.id}
        getAllPetitions={getAllPetitions}
        threshold={threshold}
      />

      {!isAdmin && showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative w-full max-w-xl bg-white p-6 rounded-xl shadow-lg dark:bg-gray-800">
            {/* Close Button */}
            <button
              onClick={() => {
                setShowModal(false);
              }}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-500"
            >
              &times;
            </button>

            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Add New Petition
            </h1>
            <div className="mt-5 flex flex-col gap-4">
              <div>
                <label
                  htmlFor="title"
                  className="text-lg font-medium text-gray-700 dark:text-gray-300"
                >
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  className="mt-2 w-full rounded-lg border border-gray-300 p-2 text-gray-800 focus:ring focus:ring-blue-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  onChange={handleChange}
                  name="title"
                  value={title}
                />
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="text-lg font-medium text-gray-700 dark:text-gray-300"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  onChange={handleChange}
                  name="description"
                  value={description}
                  className="mt-2 w-full rounded-lg border border-gray-300 p-2 text-gray-800 focus:ring focus:ring-blue-400 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                ></textarea>
              </div>
              <button
                onClick={() => {
                  handlePetitionCreation();
                  setShowModal(false);
                }}
                className="self-end rounded-lg bg-blue-500 px-4 py-2 text-white transition duration-200 hover:bg-blue-600"
              >
                Add Petition
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
