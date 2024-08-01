import React from 'react';
import { Route, Routes, Navigate, Router } from 'react-router-dom';
import LoginForm from './components/Authentication/Login.components';
// import PrivateRoute from './components/Authentication/Routes.components';
import UserProfile from './components/User/UserProfile.components';

function App() {
  // const token = localStorage.getItem('token');

  return (
    <Routes>
      <Route index Component={LoginForm} />
      <Route path='dashboard' Component={UserProfile} />
    </Routes>
  );
}

export default App;
