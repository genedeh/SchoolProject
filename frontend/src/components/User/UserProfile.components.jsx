import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Alert, Button, Spinner } from 'react-bootstrap'
import '../User/UserProfile.styles.css'
import TeacherDashboard from '../Dashboard/TeacherDashboard.components';
import StudentDashboard from '../Dashboard/StudentDashboard.components';
const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    let navigate = useNavigate()

    const logoutHandler = () => {
        localStorage.removeItem('token');
        return navigate("/")
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
                    setUser(response.data);
                } catch (err) {
                    setError('Failed to fetch user profile'.toLocaleUpperCase());
                }
            } else {
                setError('No token found');
            }
        };

        fetchUserProfile();
    }, []);

    if (error === "No token found") {
        return (
            <Alert variant='warning' className='warning-container'>
                <Alert.Heading>Missing Permission</Alert.Heading>
                <hr />
                PLS ENDEVOUR TO LOG IN BEFORE U CAN HAVE ACCESS TO THIS PAGE
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

    if (!user) {
        return <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
        </Spinner>;
    }

    return (
        <>
            {user.is_student_or_teacher ? (<StudentDashboard user={user} />) : (<TeacherDashboard user={user} />)}
            <div>
                <Button onClick={logoutHandler}>LOG OUT</Button>
            </div>
        </>
    );
};

export default UserProfile;
