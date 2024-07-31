import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserList = () => {
    const [users, setUsers] = useState([]);



    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/users/')
            .then(response => setUsers(response.data))
            .catch(error => console.error('Error fetching User:', error));
    }, []);

    return (
        <div>
            <h1>Users</h1>
            <ul>
                {users.map(user => (
                    <li key={user.id}>{user.username}</li>
                ))}
            </ul>
        </div>
    );
};

export default UserList;
