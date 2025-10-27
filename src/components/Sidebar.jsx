import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../Store/auth-actions";
import { useNavigate } from "react-router-dom";
import AddItemForm from "./AddItemForm";
import Modal from "./UI/Modal";

const Sidebar = () => {
  const { userLogged, name, email, photo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [modalType, setModalType] = useState(null);

  if (!userLogged) return null;

  const handleLogOut = () => {
    dispatch(logout());
    navigate("/");
  };

  const closeModal = () => setModalType(null);

  const menuItems = [
    { label: "Profile", action: () => navigate("/dashboard") },
    { label: "Browse Items", action: () => navigate("/browse-items") },
    { label: "Add New Item", action: () => setModalType("add") },
    { label: "Your Items", action: () => navigate("/dashboard/your-items") },
    { label: "History", action: () => navigate("/dashboard/history") },
    { label: "Reservations", action: () => navigate("/dashboard/reservations") },
  ];

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <aside className="w-full md:w-64 bg-white shadow-lg md:fixed md:top-0 md:left-0 md:h-full flex flex-col justify-between z-50 p-4">
        <div className="flex flex-col items-center pb-6 border-b mb-4">
          <div className="avatar mb-2">
            <div className="w-16 rounded-full ring ring-green-500 ring-offset-base-100 ring-offset-2">
              <img src={photo || "/avatar.png"} alt="User" />
            </div>
          </div>
          <span className="font-semibold text-lg text-gray-800">{name}</span>
          <span className="text-sm text-gray-500">{email}</span>
        </div>

        <div className="flex flex-col gap-2">
          {menuItems.map((item, idx) => (
            <button
              key={idx}
              onClick={item.action}
              className="btn btn-ghost justify-start text-gray-700 hover:text-green-600 hover:bg-green-50 transition-all rounded-xl"
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="mt-auto">
          <button
            onClick={handleLogOut}
            className="btn btn-outline btn-error w-full mt-4"
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 md:ml-64 p-6">
      </main>

      {modalType && (
        <Modal onClose={closeModal}>
          <div className="flex justify-between items-center mb-4 border-b pb-2">
            <h2 className="text-xl font-semibold text-gray-800">
              {modalType === "add" ? "Share Your Item" : "Settings"}
            </h2>
            <button
              onClick={closeModal}
              className="text-gray-500 hover:text-gray-900 text-2xl"
            >
              &times;
            </button>
          </div>
          {modalType === "add" && <AddItemForm /> }
        </Modal>
      )}
    </div>
  );
};

export default Sidebar;
