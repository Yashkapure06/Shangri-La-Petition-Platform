import React from "react";
import avatar from "../../../../assets/img/avatars/avatar11.png";
import banner from "../../../../assets/img/profile/banner.png";
import Card from "../../../../components/card";

const Banner = ({ isAdmin, userData, petitions }) => {
  const getUserInital = (username) => {
    return username?.charAt(0)?.toUpperCase();
  };

  const getSignatureCount = () => {
    let count = 0;
    petitions.forEach((petition) => {
      count += petition.signatures.length;
    });
    return count;
  };

  return (
    <Card extra={"items-center w-full h-full p-[16px] bg-cover"}>
      {/* Background and profile */}
      <div
        className="relative mt-1 flex h-32 w-full justify-center rounded-xl bg-cover"
        style={{ backgroundImage: `url(${banner})` }}
      >
        <div className="absolute -bottom-12 flex h-[87px] w-[87px] items-center justify-center rounded-full border-[4px] border-white bg-pink-400 dark:!border-navy-700">
          {/* <img className="h-full w-full rounded-full" src={avatar} alt="" /> */}
          {/* avatar should be initial letter of usernmae */}
          <p className="text-3xl font-bold text-white dark:text-navy-700">
            {isAdmin ? "A" : getUserInital(userData.username)}
          </p>
        </div>
      </div>

      {/* Name and position */}
      <div className="mt-16 flex flex-col items-center">
        <h4 className="text-xl font-bold text-navy-700 dark:text-white">
          {userData.username}
        </h4>
        <p className="text-base font-normal text-gray-600">
          {isAdmin ? "Admin" : "Petitioner"}
        </p>
      </div>

      {/* Post followers */}
      {!isAdmin && (
        <div className="mt-6 mb-3 flex gap-4 md:!gap-14">
          <div className="flex flex-col items-center justify-center">
            <p className="text-2xl font-bold text-navy-700 dark:text-white">
              {petitions.length}
            </p>
            <p className="text-sm font-normal text-gray-600">Petitions</p>
          </div>

          <div className="flex flex-col items-center justify-center">
            <p className="text-2xl font-bold text-navy-700 dark:text-white">
              {getSignatureCount()}
            </p>
            <p className="text-sm font-normal text-gray-600">
              Petitions You have Signed
            </p>
          </div>
        </div>
      )}
      {isAdmin && (
        <div className="mt-6 mb-3 flex gap-4 md:!gap-14">
          <div className="flex flex-col items-center justify-center">
            <p className="text-2xl font-bold text-navy-700 dark:text-white">
              {petitions.length}
            </p>
            <p className="text-sm font-normal text-gray-600">Total Petitions</p>
          </div>

          <div className="flex flex-col items-center justify-center">
            <p className="text-2xl font-bold text-navy-700 dark:text-white">
              {getSignatureCount()}
            </p>
            <p className="text-sm font-normal text-gray-600">
              Total Signed Petitions
            </p>
          </div>
        </div>
      )}
    </Card>
  );
};

export default Banner;
