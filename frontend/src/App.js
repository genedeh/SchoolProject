import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LoginForm from './components/Authentication/Login.components';
import 'bootstrap/dist/css/bootstrap.min.css'
import UserDashboard from './components/User/UserDashboard.components';
import axios from 'axios';

axios.defaults.baseURL = 'http://127.0.0.1:8000';
function App() {

  return (
      <Routes>
      <Route index Component={LoginForm} />
      <Route path='dashboard' Component={UserDashboard} />
    </Routes>
  );
}

export default App;
