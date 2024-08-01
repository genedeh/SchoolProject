import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

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
                    setError('Failed to fetch user profile');
                }
            } else {
                setError('No token found');
            }
        };

        fetchUserProfile();
    }, []);

    if (error === "No token found") {
        return <div>PLS ENDEVOUR TO LOG IN BEFORE U CAN HAVE ACCESS TO THIS PAGE
            <br /><Link to="/">LOG IN</Link>
        </div>;
    } else if (error) {
        return <div>{error}</div>;
    }

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <div>
                <h1>User Profile</h1>
                <p>ID: {user.id}</p>
                <p>Username: {user.username}</p>
                <p>Email: {user.email}</p>
            </div>
            <div>
                <button onClick={logoutHandler}>LOG OUT</button>
            </div>
        </>
    );
};

export default UserProfile;
