import ComplexTable from "./components/ComplexTable";

const Tables = ({
  isAdmin,
  petitions,
  userId,
  threshold,
  getAllPetitions,
  isProfile,
}) => {
  return (
    <div>
      <div className="mt-5  h-full  gap-5 ">
        <ComplexTable
          isAdmin={isAdmin}
          tableData={petitions}
          userId={userId}
          threshold={threshold}
          getAllPetitions={getAllPetitions}
          isProfile={isProfile}
        />
      </div>
    </div>
  );
};

export default Tables;
