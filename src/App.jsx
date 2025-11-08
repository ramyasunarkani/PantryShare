import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import Header from "./components/Header";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import DashBoard from "./pages/DashBoard";
import BrowseItems from "./pages/BrowseItems";
import YourItems from "./pages/YourItems";
import History from "./components/History";
import UserProfile from "./components/UserProfile";
import Reservations from "./components/Reservations";
import ItemDetails from "./components/ItemDetails";
import Chatbot from "./components/Chatbot";
import { fetchProfile } from "./Store/auth-actions";
import { setupChatSocketListener } from "./Store/chat-actions";

const App = () => {
  const dispatch = useDispatch();
  const userLogged = useSelector((state) => state.auth.userLogged);

  useEffect(() => {
    if (userLogged) {
      dispatch(fetchProfile());
    }
  }, [dispatch, userLogged]);

  useEffect(() => {
    setupChatSocketListener(dispatch);
    return () => {
      if (window.socket) window.socket.off("receive_message");
    };
  }, [dispatch]);

  const ProtectedRoute = ({ element }) => {
    return userLogged ? element : <Navigate to="/login" replace />;
  };

  const PublicRoute = ({ element }) => {
    return !userLogged ? element : <Navigate to="/browseItems" replace />;
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      
        <Routes>
        <Route path="/" element={<PublicRoute element={<Header />} />} />
        <Route path="/login" element={<PublicRoute element={<Login />} />} />
        <Route path="/signup" element={<PublicRoute element={<SignUp />} />} />

        <Route path="/browseItems" element={<BrowseItems />} />
        <Route path="/item/:id" element={<ItemDetails />} />

        <Route
          path="/dashboard"
          element={<ProtectedRoute element={<DashBoard />} />}
        >
          <Route index element={<UserProfile />} />
          <Route path="your-items" element={<YourItems />} />
          <Route path="history" element={<History />} />
          <Route path="reservations" element={<Reservations />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Chatbot />
    </>
  );
};

export default App;
