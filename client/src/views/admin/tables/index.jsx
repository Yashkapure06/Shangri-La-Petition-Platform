import { columnsDataComplex } from "./variables/columnsData";

import tableDataComplex from "./variables/tableDataComplex.json";
import ComplexTable from "./components/ComplexTable";

const Tables = ({ isAdmin, petitions }) => {
  // console.log(petitions);
  return (
    <div>
      <div className="mt-5  h-full  gap-5 ">
        <ComplexTable
          isAdmin={isAdmin}
          columnsData={columnsDataComplex}
          tableData={petitions}
        />
      </div>
    </div>
  );
};

export default Tables;
