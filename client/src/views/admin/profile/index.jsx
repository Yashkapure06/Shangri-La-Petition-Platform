import axios from "axios";
import Banner from "./components/Banner";
import PieChartCard from "./components/PieChartCard";
import Project from "./components/Project";
import { BASE_URL } from "../../../config";
import { useEffect, useState } from "react";

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
  return (
    <div className="flex w-full flex-col gap-5">
      <div className="w-full mt-3 flex h-fit flex-col gap-5 lg:grid lg:grid-cols-12">
        <div className="col-span-4 lg:!mb-0">
          <Banner isAdmin={isAdmin} userData={userData} petitions={petitions} />
        </div>
        <div className="col-span-6 lg:col-span-8 lg:mb-0 3xl:col-span-4">
          <Project
            isAdmin={isAdmin}
            userData={userData}
            petitions={petitions}
          />
        </div>
        <div className="col-span-12 lg:col-span-12 lg:mb-0 3xl:col-span-4">
          <PieChartCard isAdmin={isAdmin} petitions={petitions} />
        </div>
      </div>
    </div>
  );
};

export default Profile;
