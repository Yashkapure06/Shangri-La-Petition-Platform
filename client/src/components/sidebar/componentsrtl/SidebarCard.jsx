const FreeCard = ({ handleLogout }) => {
  return (
    <div className="relative  flex w-[256px] justify-center rounded-[20px] bg-gradient-to-br from-[#ff8686] via-[#f32c2c] to-[#f33]">
      <button
        onClick={handleLogout}
        className="text-medium block rounded-full  from-white/50 to-white/10 py-[12px] px-11 text-center text-base text-white  "
      >
        Logout
      </button>
    </div>
  );
};

export default FreeCard;
