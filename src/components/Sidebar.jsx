import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../Store/auth-actions';
import { useNavigate } from 'react-router-dom';
import AddItemForm from './AddItemForm';
import SettingsPanel from './SettingsPanel';
import Modal from './UI/Modal';

const Sidebar = () => {
  const user = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [modalType, setModalType] = useState(null); 
  if (!user.userLogged) return null;

  const handleLogOut = () => dispatch(logout());
  const closeModal = () => setModalType(null);

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-white p-4 shadow-lg fixed top-0 left-0 h-full z-40 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 border-b pb-4">
            <img src={user.photo} className="w-10 h-10 rounded-full object-cover" alt="User" />
            <span className="font-semibold">{user.name}</span>
          </div>

          <div className="flex flex-col gap-2 mt-4">
            <button
              onClick={() => navigate('/dashboard/browseItems')}
              className="hover:bg-gray-100 p-2 rounded text-left"
            >
              Browse Items
            </button>
            <button
              onClick={() => setModalType('add')}
              className="hover:bg-gray-100 p-2 rounded text-left"
            >
              Add New Item
            </button>
            <button
              onClick={() => navigate('/dashboard/your-items')}
              className="hover:bg-gray-100 p-2 rounded text-left"
            >
              Your Items
            </button>
            <button
              onClick={() => navigate('/dashboard/history')}
              className="hover:bg-gray-100 p-2 rounded text-left"
            >
              History
            </button>
            {/* <button
              onClick={() => setModalType('settings')}
              className="hover:bg-gray-100 p-2 rounded text-left"
            >
              Settings
            </button> */}
          </div>
        </div>

        <div>
          <button
            onClick={handleLogOut}
            className="hover:bg-red-100 text-red-600 p-2 rounded text-left w-full"
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-64 p-6 bg-gray-50 w-full"></main>

      {modalType && (
        <Modal onClose={closeModal}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">
              {modalType === 'add' ? 'Add New Item' : 'Settings'}
            </h2>
            <button
              onClick={closeModal}
              className="text-gray-500 hover:text-black text-2xl"
            >
              &times;
            </button>
          </div>
          {modalType === 'add' ? <AddItemForm /> : <SettingsPanel />}
        </Modal>
      )}
    </div>
  );
};

export default Sidebar;
