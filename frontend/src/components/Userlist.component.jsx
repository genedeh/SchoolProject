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
                {users.map(({id, username, is_student_or_teacher, phone_number, email}) => (
                    <li key={id}>{username}----{email}----{ phone_number}</li>
                ))}
            </ul>
        </div>
    );
};

export default UserList;