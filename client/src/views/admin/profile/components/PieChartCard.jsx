import PieChart from "../../../../components/charts/PieChart";
import Card from "../../../../components/card";

const PieChartCard = ({ isAdmin, petitions }) => {
  // Filter petitions based on status and count open, and closed petitions
  const filterPetitions = () => {
    if (!petitions || petitions.length === 0) {
      return [0, 0]; // Default to 0 if no petitions available
    }

    const openPetitions = petitions.filter(
      (petition) => petition.status === "open"
    );
    const closedPetitions = petitions.filter(
      (petition) => petition.status === "closed"
    );
    return [openPetitions.length, closedPetitions.length];
  };

  const [openCount, closedCount] = filterPetitions();
  const pieChartData = [openCount, closedCount];
  const pieChartOptions = {
    labels: ["Open Petitions", "Closed Petitions"],

    colors: ["#6AD2FF", "#FF6A6A"],
    chart: {
      type: "pie",
    },
    legend: {
      position: "bottom",
    },
  };

  return (
    <Card extra="rounded-[20px] p-3">
      <div className="flex flex-row justify-between px-3 pt-2">
        <div>
          <h4 className="text-lg font-bold text-navy-700 dark:text-white">
            Petition Status
          </h4>
        </div>
      </div>

      <div className="mb-auto flex h-[350px] w-full items-center justify-center">
        <PieChart options={pieChartOptions} series={pieChartData} />
      </div>

      <div className="flex flex-row !justify-between rounded-2xl px-6 py-3 shadow-2xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center justify-center">
            <div className="h-2 w-2 rounded-full bg-[#6AD2FF]" />
            <p className="ml-1 text-sm font-normal text-gray-600">
              Open Petitions
            </p>
          </div>
          <p className="mt-px text-xl font-bold text-navy-700 dark:text-white">
            {((openCount / (openCount + closedCount)) * 100).toFixed(1) || 0}%
          </p>
        </div>

        <div className="h-11 w-px bg-gray-300 dark:bg-white/10" />

        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center justify-center">
            <div className="h-2 w-2 rounded-full bg-[#FF6A6A]" />
            <p className="ml-1 text-sm font-normal text-gray-600">
              Closed Petitions
            </p>
          </div>
          <p className="mt-px text-xl font-bold text-navy-700 dark:text-white">
            {((closedCount / (openCount + closedCount)) * 100).toFixed(1) || 0}%
          </p>
        </div>
      </div>
    </Card>
  );
};

export default PieChartCard;
