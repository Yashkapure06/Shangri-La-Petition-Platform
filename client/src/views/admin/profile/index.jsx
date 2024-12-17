import Banner from "./components/Banner";
import PieChartCard from "./components/PieChartCard";
import Project from "./components/Project";

const Profile = ({ isAdmin }) => {
  return (
    <div className="flex w-full flex-col gap-5">
      <div className="w-full mt-3 flex h-fit flex-col gap-5 lg:grid lg:grid-cols-12">
        <div className="col-span-4 lg:!mb-0">
          <Banner isAdmin={isAdmin} />
        </div>
        <div className="col-span-6 lg:col-span-8 lg:mb-0 3xl:col-span-4">
          <Project isAdmin={isAdmin} />
        </div>
        <div className="col-span-12 lg:col-span-12 lg:mb-0 3xl:col-span-4">
          <PieChartCard isAdmin={isAdmin} />
        </div>
      </div>
    </div>
  );
};

export default Profile;
