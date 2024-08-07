import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Alert, Spinner } from 'react-bootstrap';
import '../User/UserDashboard.styles.css';
import TeacherDashboard from '../Dashboard/Teachers/TeacherDashboard.components';
import StudentDashboard from '../Dashboard/Students/StudentDashboard.components';
import { UserContext } from '../../contexts/User.contexts';
import { UsersListContext } from '../../contexts/UsersList.contexts';

const UserDashboard = () => {
    const [error, setError] = useState('');
    const { currentUser, setCurrentUser } = useContext(UserContext);
    const { setUsersList } = useContext(UsersListContext);
    const giveUserClass = (dummyArray, response) => {
        response.data.map(async ({ classes, classrooms, id, username, profile_picture, is_student_or_teacher, birth_date, gender, address, phone_number, email }) => {
            if (Number(classes) !== 0) {
                const classesresponse = await axios.get(`http://127.0.0.1:8000/api/classrooms/${Number(classes)}`)
                dummyArray.push({
                    'id': id,
                    'username': username,
                    'profile_picture': profile_picture,
                    'is_student_or_teacher': is_student_or_teacher,
                    'birth_date': birth_date,
                    'gender': gender,
                    'user_class': classesresponse.data.name,
                    'address': address,
                    'phone_number': phone_number,
                    'email': email,
                })
            } else {
                const classroomsResponse = await axios.get(`http://127.0.0.1:8000/api/classrooms/${Number(classrooms)}/`)
                dummyArray.push({
                    'id': id,
                    'username': username,
                    'profile_picture': profile_picture,
                    'is_student_or_teacher': is_student_or_teacher,
                    'birth_date': birth_date,
                    'gender': gender,
                    'user_class': classroomsResponse.data.name,
                    'address': address,
                    'phone_number': phone_number,
                    'email': email,
                })
            }
        })
    }
    useEffect(() => {
        const fetchUserProfile = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await axios.get('http://127.0.0.1:8000/api/profile/', {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                        },
                    });
                    setCurrentUser(response.data);
                    fetchUserProfilesList();
                } catch (err) {
                    setError('Failed to fetch user profile'.toLocaleUpperCase());
                }
            } else {
                setError('No token found');
            }
        };

        const fetchUserProfilesList = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await axios.get('http://127.0.0.1:8000/api/users/')
                    const dummyArray = []
                    giveUserClass(dummyArray, response);
                    setUsersList(dummyArray);
                } catch (err) {
                    console.error('There was an error fetching the items!', err);
                }
            }
        };
        fetchUserProfile(); 
    }, []);

    if (error === "No token found") {
        return (
            <Alert variant='warning' className='warning-container'>
                <Alert.Heading>Missing Permission</Alert.Heading>
                <hr />
                PLEASE ENDEVOUR TO LOG IN BEFORE U CAN HAVE ACCESS TO THIS PAGE
                <Alert.Link href='/' className='m-2'>GO TO LOGIN PAGE</Alert.Link>
            </Alert>
        );
    } else if (error) {
        return (
            <Alert variant='danger' className='error-container'>
                <Alert.Heading>Failed Request</Alert.Heading>
                <hr />
                {error}
                <Alert.Link href='/' className='m-2'>GO TO LOGIN PAGE</Alert.Link>
            </Alert>
        );
    }

    if (!currentUser) {
        return (
            <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        )
            ;
    }
    return (
        <>
            {currentUser.is_student_or_teacher ? (<StudentDashboard />) : (<TeacherDashboard />)}
        </>
    );

};

export default UserDashboard;
