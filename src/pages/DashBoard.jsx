import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { Menu } from "lucide-react"; 

const DashBoard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div
        className={`fixed md:static z-40 transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <Sidebar closeSidebar={() => setIsSidebarOpen(false)} />
      </div>

      <main className="flex-1 p-4 md:p-6">
        <button
          className="md:hidden mb-4 bg-green-600 text-white px-3 py-2 rounded-md flex items-center gap-2"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <Menu size={20} />
          Menu
        </button>

        <Outlet />
      </main>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default DashBoard;
