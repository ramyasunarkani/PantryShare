import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import bgImage from '../assets/pantry-bg.png';
import NavBar from './NavBar';

const Header = () => {
  const userLogged = useSelector((state) => state.auth.userLogged);

  return (
    <>
      <NavBar />
      <div
        className="relative bg-cover bg-center min-h-[calc(100vh)]"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="absolute inset-0 bg-black/50 z-0"></div>

        <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-6 text-center">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-lg max-w-xl">
            <h3 className="text-3xl font-extrabold text-white mb-3">Hey there 👋</h3>
            <p className="text-white text-lg mb-2">
              Welcome to <span className="font-semibold text-blue-300">PantryShare</span> — your local space to share, give, and connect!
            </p>
            <p className="text-white text-md leading-relaxed mb-4">
              Got some extra pantry items?   
              List them here and help someone nearby.  
              Or explore what your neighbors are sharing — it’s simple, free, and full of kindness 💙
            </p>

            {!userLogged && (
              <Link
                to="/login"
                className="inline-block mt-4 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-full shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-300"
              >
                Login & Start Sharing
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
