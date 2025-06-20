import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from './components/Header';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import DashBoard from './pages/DashBoard';
import BrowseItems from './pages/BrowseItems';
import YourItems from './pages/YourItems';
import History from './components/History';

const App = () => {
  const userLogged = useSelector(state => state.auth.userLogged);

  return (
    <Routes>
      <Route path="/" element={!userLogged ? <Header /> : <Navigate to="/dashboard" />} />
      <Route path="/login" element={!userLogged ? <Login /> : <Navigate to="/dashboard" /> }/>
      <Route path="/signup"element={!userLogged ? <SignUp /> : <Navigate to="/dashboard" />}/>
      <Route
        path="/dashboard" element={userLogged ? <DashBoard /> : <Navigate to="/" /> }>
         <Route index element={<Navigate to="browseItems" />} />
        <Route path="browseItems" element={<BrowseItems />} />
        <Route path="your-items" element={<YourItems/>} />
        <Route path="history" element={<History/>} />
      </Route>
    </Routes>
  );
};

export default App;
