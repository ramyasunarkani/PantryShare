import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const navigate = useNavigate();
  const { userLogged, name, photo } = useSelector((state) => state.auth);

  return (
    <>
      <div
        className="h-16 flex justify-between items-center px-6 border-b shadow-md fixed top-0 left-0 z-10 bg-gradient-to-r from-indigo-500 to-teal-400 transition-all duration-500 ease-in-out w-full"
      >
        <div
          className="flex items-center gap-1 cursor-pointer"
          onClick={() => navigate("/browseItems")}
        >
          <img src="/image.png" alt="Logo" className="h-8 w-8 object-contain" />
          <h2 className="text-xl font-semibold font-mono text-white">
            PantryShare
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {userLogged && (
            <div
              className="flex items-center gap-2 cursor-pointer hover:bg-white/10 rounded-full px-3 py-1 transition"
              onClick={() => navigate("/dashboard")}
            >
              <img
                src={photo || "/avatar.png"}
                alt="Profile"
                className="w-10 h-10 rounded-full border-2 border-white"
              />
              <span className="text-white font-medium">{name}</span>
            </div>
          )}
        </div>
      </div>

      <div className="h-16"></div>
    </>
  );
};

export default NavBar;
