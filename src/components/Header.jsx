import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import bgImage from '../assets/pantry-bg.png';
import NavBar from './NavBar';

const Header = () => {
  const userLogged = useSelector((state) => state.auth.userLogged);

  return (
    <>
     <NavBar/>
      <div
      className="relative bg-cover bg-center min-h-[calc(100vh)] "
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-black/40 z-0"></div>

      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
        <div className="px-6 py-6 rounded-lg shadow-sm text-center max-w-xl">
          <h3 className="text-2xl font-bold text-white mb-2">Welcome to PantryShare</h3>
          <p className="text-white text-lg">
            Help your community by sharing extra pantry items like fruits, grains, or essentials.
          </p>
          <p className="text-white text-lg mb-4">
            Discover what your neighbors are offering, share your surplus, and support those around you. <br />
            Together, we reduce waste, foster kindness, and build stronger neighborhoods—one item at a time.
          </p>
          {!userLogged && (
            <Link
              to="/login"
              className="inline-block mt-4 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Login to get started
            </Link>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default Header;
