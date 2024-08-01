import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import LoginForm from './components/Authentication/Login.components';
// import PrivateRoute from './components/Authentication/Routes.components';
import Home from './components/Home/Home.components';

function App() {
  const token = localStorage.getItem('token');

  return (
    // <Router>
    <LoginForm />
    // <Routes>
    //   <Route path="/login" component={LoginForm} />
    //   <Route path="/home" component={token ? Home : <Navigate to="/login" />}/>

    // </Routes>
    // </Router>
  );
}

export default App;
