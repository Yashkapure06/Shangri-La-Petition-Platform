import { columnsDataComplex } from "./variables/columnsData";

import tableDataComplex from "./variables/tableDataComplex.json";
import ComplexTable from "./components/ComplexTable";

const Tables = ({
  isAdmin,
  petitions,
  userId,
  threshold,
  getAllPetitions,
  isProfile,
}) => {
  // console.log(petitions);
  return (
    <div>
      <div className="mt-5  h-full  gap-5 ">
        <ComplexTable
          isAdmin={isAdmin}
          columnsData={columnsDataComplex}
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
