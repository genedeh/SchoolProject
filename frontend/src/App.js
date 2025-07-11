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
import { AddUser } from './components/Dashboard/Teachers/AddUser.components';
import { AdminPrivateRoute, PrivateRoute } from './components/Routes/PrivateRoute.components';
import { Subjects } from './components/Dashboard/Teachers/AdminComponents/Subjects.components';
import { AssignedSubjects } from './components/Dashboard/Teachers/TeacherComponents/AssignedSubject.components';
import { Classrooms } from './components/Dashboard/Teachers/AdminComponents/Classrooms.components';
import { AssignedClassrooms } from './components/Dashboard/Teachers/TeacherComponents/AssignedClassroom.components';
import UpdateStudentResult from './components/Dashboard/Teachers/ResultsTools/UpdateStudentResult.components';
import { CreateStudentResult } from './components/Dashboard/Teachers/ResultsTools/CreateStudentResult.components';
import StudentViewResult from './components/Dashboard/Students/Results/StudentViewResult.components';
import MigrateStudents from './components/Dashboard/Teachers/AdminComponents/MigrateStudents.components';
import { AdminViewResult } from './components/Dashboard/Teachers/AdminComponents/AdminViewResult.components';
import NotFound from './components/Routes/PageNotFound.components';
// axios.defaults.baseURL = 'https://schoolproject-6io4.onrender.com';
axios.defaults.baseURL = 'http://127.0.0.1:8000/';

function App() {
  return (
    <Routes>
      <Route index Component={LoginForm} />
      <Route path="*" element={<NotFound />} /> {/* 404 Route */}
      <Route path='/dashboard' element={<Navigation />}>
        <Route path='home' element={<PrivateRoute Component={StudentHome} AltComponent={TeacherHome} />} />
        <Route path='student-profile' element={<StudentProfile />} />
        <Route path='teacher-profile' element={<TeacherProfile />} />
        <Route path='add-user' element={<AddUser />} />
        <Route path='subjects' element={<AdminPrivateRoute Component={Subjects} AltComponent={AssignedSubjects} />} />
        <Route path='classrooms' element={<AdminPrivateRoute Component={Classrooms} AltComponent={AssignedClassrooms} />} />
        <Route path='student-results' element={<PrivateRoute Component={StudentViewResult} AltComponent={AdminViewResult}/>} />
        <Route path="update-student-result/:reuslt_name" element={<UpdateStudentResult />} />
        <Route path="create-student-result" element={<CreateStudentResult />} />
        <Route path="migrate-students" element={<MigrateStudents />} />
      </Route>
    </Routes>
  );
}

export default App;
