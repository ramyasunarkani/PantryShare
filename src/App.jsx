import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import Header from './components/Header';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import DashBoard from './pages/DashBoard';
import BrowseItems from './pages/BrowseItems';
import YourItems from './pages/YourItems';
import History from './components/History';
import UserProfile from './components/UserProfile';
import { fetchProfile } from './Store/auth-actions';
import Reservations from './components/Reservations';
import ItemDetails from './components/ItemDetails';
import { setupChatSocketListener } from './Store/chat-actions';

const App = () => {
  const dispatch = useDispatch();
  const userLogged = useSelector((state) => state.auth.userLogged);

  useEffect(() => {
    if (userLogged) {
    dispatch(fetchProfile());
  }
  }, [dispatch,userLogged]);
  useEffect(() => {
    setupChatSocketListener(dispatch);
    return () => {
      socket.off("receive_message");
    };
  }, [dispatch]);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={!userLogged ? <Header /> : <Navigate to="/browseItems" />} />
        <Route path="/login" element={!userLogged ? <Login /> : <Navigate to="/browseItems" />} />
        <Route path="/signup" element={!userLogged ? <SignUp /> : <Navigate to="/browseItems" />} />

        <Route path="/browseItems" element={<BrowseItems />} />
        <Route path="/item/:id" element={<ItemDetails/>} />

        <Route
          path="/dashboard"
          element={userLogged ? <DashBoard /> : <Navigate to="/login" />}
        >
          <Route index element={<UserProfile />} />
          <Route path="your-items" element={<YourItems />} />
          <Route path="history" element={<History />} />
          <Route path="reservations" element={<Reservations />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

export default App;
