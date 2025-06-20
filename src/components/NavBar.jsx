

const NavBar = () => {

  return (
    <>
      <div className="h-16 flex justify-between items-center px-6  border-b shadow-md fixed top-0 left-0 
         w-full z-10 bg-gradient-to-r from-indigo-500 to-teal-400">
        <div className="flex items-center gap-1">
          <img src="/image.png" alt="Logo" className="h-8 w-8 object-contain" />
          <h2 className="text-xl font-semibold font-mono text-white">PantryShare</h2>
        </div>
      </div>
    </>
  );
};

export default NavBar;
