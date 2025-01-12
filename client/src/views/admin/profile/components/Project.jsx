import React from "react";
import Card from "../../../../components/card";

const Project = ({ isAdmin, petitions, userData }) => {
  const getUserInital = (username) => {
    return username?.charAt(0)?.toUpperCase();
  };
  return (
    <Card extra={"w-full p-4 h-full"}>
      <div className="mb-8 w-full">
        <h4 className="text-xl font-bold text-navy-700 dark:text-white">
          {isAdmin ? "All Petitions" : "My Petitions"}
        </h4>
        <p className="mt-2 text-base text-gray-600">
          {isAdmin
            ? "Latest petitions created by users"
            : "Here you can find your latest created petitions."}
        </p>
      </div>
      {/* Need to map here list of latest or current 5 petitions by all the users and by single user */}
      {petitions?.slice(0, 3)?.map((petition, index) => (
        <div
          key={index}
          className="flex w-full items-center justify-between rounded-2xl bg-white p-3 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none mt-3"
        >
          <div className="flex items-center">
            <div className="">
              {/* <img
                className="h-[83px] w-[83px] rounded-lg"
                src={image3}
                alt=""
              /> */}
              <p
                className="text-3xl font-bold text-navy-700 dark:text-white h-[83px] w-[83px] rounded-lg
                text-center flex items-center justify-center bg-gray-200  dark:bg-navy-800 dark:text-white
              "
              >
                {isAdmin ? "A" : getUserInital(userData.username)}
              </p>
            </div>
            <div className="ml-4">
              <p className="text-base font-medium text-navy-700 dark:text-white">
                {petition.title}
              </p>
              <p className="mt-2 text-sm text-brand-500">
                {petition.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </Card>
  );
};

export default Project;
