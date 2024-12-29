import axios from "axios";
import Banner from "./components/Banner";
import PieChartCard from "./components/PieChartCard";
import Project from "./components/Project";
import { BASE_URL } from "../../../config";
import { useEffect, useState } from "react";
import Card from "../../../components/card";

const Profile = ({ isAdmin }) => {
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

  const getAllPetitionsByCreatedId = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const userId = localStorage.getItem("userId");
      const response = await axios.get(
        `${BASE_URL}/petition/getall/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setPetitions(response.data);
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
  useEffect(() => {
    if (isAdmin === false) {
      getUserDataById();
      getAllPetitionsByCreatedId();
    }

    if (isAdmin === true) {
      getAllPetitions();
    }
  }, []);
  const getUserInital = (username) => {
    return username?.charAt(0)?.toUpperCase();
  };
  return (
    <div className="flex w-full flex-col gap-5">
      <div className="w-full mt-3 flex h-fit flex-col gap-5 lg:grid lg:grid-cols-12">
        <div className="col-span-4 lg:!mb-0">
          <Banner isAdmin={isAdmin} userData={userData} petitions={petitions} />
        </div>
        <div className="col-span-6 lg:col-span-8 lg:mb-0 3xl:col-span-4 overflow-x-scroll">
          {/* <Project
            isAdmin={isAdmin}
            userData={userData}
            petitions={petitions}
          /> */}
          {/* i want table here having title description and number of signatures and status  */}
          <Card extra={"w-full h-full px-6 pb-6 sm:overflow-x-auto"}>
            <div className="relative flex items-center justify-between pt-4">
              <div className="text-xl font-bold text-navy-700 dark:text-white">
                {isAdmin ? "All Petitions" : "Your Petitions"}
              </div>
            </div>
            <table className="w-full">
              <thead>
                <tr className="!border-px !border-gray-400">
                  <th
                    scope="col"
                    className="cursor-pointer border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start"
                  >
                    Title
                  </th>
                  <th
                    scope="col"
                    className="cursor-pointer border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start"
                  >
                    Description
                  </th>
                  <th
                    scope="col"
                    className="cursor-pointer border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start"
                  >
                    Signatures
                  </th>
                  <th
                    scope="col"
                    className="cursor-pointer border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start"
                  >
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {!isAdmin &&
                  petitions.map((petition, index) => (
                    <tr
                      key={index}
                      className="border-b-[1px] border-gray-200 dark:border-gray-600"
                    >
                      {/* <td className="text-sm font-medium text-navy-700 dark:text-white p-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <img
                          className="h-10 w-10 rounded-full"
                          src="https://www.kindpng.com/picc/m/78-785827_user-profile-avatar-login-account
                          -profile-user-icon.png"
                          alt=""
                        />
                      </div>
                    </div>
                  </td> */}
                      <td className="text-sm font-medium text-navy-700 dark:text-white p-4">
                        <div className="text-sm text-gray-900">
                          {petition.title}
                        </div>
                      </td>
                      <td className="text-sm font-medium text-navy-700 dark:text-white p-4">
                        <div className="text-sm text-gray-900">
                          {petition.description.slice(0, 50)}...
                        </div>
                      </td>
                      <td className="text-sm font-medium text-navy-700 dark:text-white p-4">
                        <div className="text-sm text-gray-900">
                          {petition.signatures.length}
                        </div>
                      </td>
                      <td className="text-sm font-medium text-navy-700 dark:text-white p-4">
                        <span
                          className={`${
                            petition.status === "open"
                              ? "bg-green-300 border-green-500 border text-sm font-light dark:bg-green-400  p-1  px-3 rounded-full                   text-green-500 dark:text-[#252525]                  "
                              : "bg-red-300 border-red-500 border text-sm font-light dark:bg-red-300  p-1  px-3 rounded-full"
                          }`}
                        >
                          {" "}
                          {petition.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                {isAdmin &&
                  petitions.slice(0, 5).map((petition, index) => (
                    <tr
                      key={index}
                      className="border-b-[1px] border-gray-200 dark:border-gray-600"
                    >
                      <td className="text-sm font-medium text-navy-700 dark:text-white p-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <p className="text-3xl font-bold text-navy-700">
                              {getUserInital(petition.username)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="text-sm font-medium text-navy-700 dark:text-white p-4">
                        <div className="text-sm text-gray-900">
                          {petition.title}
                        </div>
                      </td>
                      <td className="text-sm font-medium text-navy-700 dark:text-white p-4">
                        <div className="text-sm text-gray-900">
                          {petition.description.slice(0, 50)}...
                        </div>
                      </td>
                      <td className="text-sm font-medium text-navy-700 dark:text-white p-4">
                        <div className="text-sm text-gray-900">
                          {petition.signatures.length}
                        </div>
                      </td>
                      <td className="text-sm font-medium text-navy-700 dark:text-white p-4">
                        <span
                          className={`${
                            petition.status === "open"
                              ? "bg-green-300 border-green-500 border text-sm font-light dark:bg-green-400  p-1  px-3 rounded-full                   text-green-500 dark:text-[#252525]                  "
                              : "bg-red-300 border-red-500 border text-sm font-light dark:bg-red-300  p-1  px-3 rounded-full"
                          }`}
                        >
                          {" "}
                          {petition.status}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </Card>
        </div>
        <div className="col-span-12 lg:col-span-12 lg:mb-0 3xl:col-span-4">
          <PieChartCard isAdmin={isAdmin} petitions={petitions} />
        </div>
      </div>
    </div>
  );
};

export default Profile;
