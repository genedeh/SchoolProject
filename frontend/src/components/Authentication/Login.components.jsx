import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    let navigate = useNavigate();
    useEffect(() => setUsername(`${firstname}_${lastname}`)
        , [firstname, lastname])
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/login/', { username, password });
            localStorage.setItem('token', response.data.access);
            setMessage('SUCCESFUL LOGIN')
            return navigate("/dashboard")
        } catch (err) {
            setMessage('Invalid Credentials');
        }


    };
    return (
        <div>
            <form onSubmit={handleLogin}>
                <div>
                    <label>Firstname:</label>
                    <input
                        type="text"
                        value={firstname}
                        onChange={(e) => setFirstname(e.target.value)}
                    />
                </div>
                <div>
                    <label>Lastname:</label>
                    <input
                        type="text"
                        value={lastname}
                        onChange={(e) => setLastname(e.target.value)}
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                {message && <p>{message}</p>}
                <button type="submit">Login</button>
            </form>
        </div>
    );


};

export default LoginForm;
