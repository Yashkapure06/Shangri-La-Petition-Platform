import Banner from "./components/Banner";
import Tables from "../tables";
import Widget from "../../../components/widget/Widget";
import {
  MdBarChart,
  MdDashboard,
  MdOutlineDataThresholding,
} from "react-icons/md";
import { IoDocuments } from "react-icons/io5";
import { IoMdHome } from "react-icons/io";

const Dashboard = ({ isAdmin }) => {
  return (
    <>
      <div className="mt-3 grid h-full grid-cols-1 gap-5 xl:grid-cols-2 2xl:grid-cols-3">
        <div className=" h-fit w-full xl:col-span-3 2xl:col-span-3">
          <Banner isAdmin={isAdmin} />
        </div>
      </div>
      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-6">
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
      </div>
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
              />
            </div>
            <div className=" flex items-center justify-between gap-4 sm:justify-start 2xl:gap-10">
              <button
                className="text-black linear rounded-xl bg-gray-200 px-4 py-2 text-center text-base font-medium transition duration-200
            hover:bg-gray-300 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
      <Tables isAdmin={isAdmin} />
    </>
  );
};

export default Dashboard;
