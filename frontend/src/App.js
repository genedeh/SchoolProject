import React from 'react';
import { Route, Routes } from 'react-router-dom';
import LoginForm from './components/Authentication/Login.components';
import 'bootstrap/dist/css/bootstrap.min.css'
import axios from 'axios';
import StudentHome from './components/Dashboard/Students/Home.components';
import Navigation from './components/Navigation/Navigation.components';
import TeacherHome from './components/Dashboard/Teachers/Home.components';
import StudentProfile from './components/Dashboard/Students/Profile.components';
import TeacherProfile from './components/Dashboard/Teachers/Profile.components';
import { AddUser } from './components/Dashboard/Teachers/AdminComponents/AddUser.components';
import  {AdminPrivateRoute, PrivateRoute} from './components/Routes/PrivateRoute.components';
import { Subjects } from './components/Dashboard/Teachers/AdminComponents/Subjects.components';
import { AssignedSubjects } from './components/Dashboard/Teachers/BasicComponents/AssignedSubject.components';
import { Classrooms } from './components/Dashboard/Teachers/AdminComponents/Classrooms.components';
import { AssignedClassrooms } from './components/Dashboard/Teachers/BasicComponents/AssignedClassroom.components';
axios.defaults.baseURL = 'https://schoolproject-6io4.onrender.com';
// axios.defaults.baseURL = 'http://127.0.0.1:8000/';

function App() {
  return (
    <Routes>
      <Route index Component={LoginForm} />
      <Route path='/dashboard' element={<Navigation />}>
        <Route path='home' element={<PrivateRoute Component={StudentHome} AltComponent={TeacherHome} />} />
        <Route path='student-profile' element={<StudentProfile />} />
        <Route path='teacher-profile' element={<TeacherProfile />} />
        <Route path='add-user' element={<AddUser />} />
        <Route path='subjects' element={<AdminPrivateRoute Component={Subjects} AltComponent={AssignedSubjects} />} />
        <Route path='classrooms' element={<AdminPrivateRoute Component={Classrooms} AltComponent={AssignedClassrooms} />} />
      </Route>
    </Routes>
  );
}

export default App;
