import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const DashBoard = () => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="   bg-gray-50 w-full">
        <Outlet /> 
      </main>
    </div>
  );
};

export default DashBoard;
