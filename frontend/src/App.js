import React, { useContext, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import LoginForm from './components/Authentication/Login.components';
import 'bootstrap/dist/css/bootstrap.min.css'
import axios from 'axios';
import StudentHome from './components/Dashboard/Students/Home.components';
import Navigation from './components/Navigation/Navigation.components';
import TeacherHome from './components/Dashboard/Teachers/Home.components';
import { UserContext } from './contexts/User.contexts';
import StudentProfile from './components/Dashboard/Students/Profile.components';
import TeacherProfile from './components/Dashboard/Teachers/Profile.components';
// import { Spinner } from 'react-bootstrap';
axios.defaults.baseURL = 'http://127.0.0.1:8000';

function App() {
  const { currentUser } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [is_student_or_teacher, setIs_student_or_teacher] = useState(null);

  useEffect(() => {
    if (currentUser) {
      setIs_student_or_teacher(currentUser.is_student_or_teacher);
      setLoading(false);
    };
  }, [currentUser])
  return (
    <Routes>
      <Route index Component={LoginForm} />
      <Route path='/dashboard' element={<Navigation />}>
        {loading ?
          ('')
          :
          (
            is_student_or_teacher ?
              (<>
                <Route path='home' element={<StudentHome />} />
                <Route path='profile' element={<StudentProfile />} />
              </>
              )
              :
              (
                <>
                  <Route path='home' element={<TeacherHome />} />
                  <Route path='profile' element={<TeacherProfile />} />
                </>
              )
          )
        }
      </Route>
    </Routes>
  );
}

export default App;
