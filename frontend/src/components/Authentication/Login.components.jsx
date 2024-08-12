import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import { Container, Form, Row, Col, Button, Alert, Spinner } from 'react-bootstrap'
import '../Authentication/Login.styles.css'

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    let navigate = useNavigate();

    useEffect(() => setUsername(`${firstname}_${lastname}`)
        , [firstname, lastname])
    const handleLogin = async (event) => {
        event.preventDefault();
        if (!firstname || !lastname || !password) {
            setError('CREDENTIALS ARE REQUIRED')
        } else {
            setLoading(true);
            try {
                const response = await axios.post('http://127.0.0.1:8000/api/login/', { username, password });
                localStorage.setItem('token', response.data.access);
                setError('');
                setTimeout(() => { 
                    setLoading(false);
                    return navigate("/dashboard/home")
                }, 4000)
            } catch (err) {
                if (err.message === "Network Error") {
                    setError('THERE SEEMS TO BE A PROBLEM WITH OUR SERVER NETWORK PLEASE TRY AGAIN!')
                } else {
                    setError("Invalid Credentials")
                }
                setLoading(false)
            }

        }
    };
    return (
        <>
            <Container fluid className="login-container" >
                <Row className="justify-content-center align-items-center min-vh-100">
                    <Col md={4} className="login-box text-center">
                        {loading ?
                            (<Spinner animation="border" role="status"><span className="visually-hidden">Loading...</span></Spinner>)
                            : (
                                <div>
                                    <div className="login-header">
                                        <img src="" alt="logo" className="img-fluid" />
                                        <h1 className="login-title">Login</h1>
                                    </div >
                                    {error && <Alert variant="danger" >&#9888;{error}&#9888;</Alert>}
                                    <Form onSubmit={handleLogin}>
                                        <Form.Group controlId="formFirstname">
                                            <Form.Label>First Name</Form.Label>
                                            <Form.Control type="text" placeholder="Enter firstname" value={firstname} onChange={(e) => setFirstname(e.target.value)} />
                                        </Form.Group>
                                        <Form.Group controlId="formLastname">
                                            <Form.Label>Last Name</Form.Label>
                                            <Form.Control type="text" placeholder="Enter lastname" value={lastname} onChange={(e) => setLastname(e.target.value)} />
                                        </Form.Group>
                                        <Form.Group controlId="formPassword">
                                            <Form.Label>Password</Form.Label>
                                            <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                        </Form.Group>
                                        <br />
                                        <Button variant="primary" type="submit" block>
                                            Log In
                                        </Button>
                                    </Form>
                                    <div className="login-footer">
                                        <b>--Ogunboyejo Adeola Memorial School--</b>
                                    </div>
                                </div>
                            )
                        }
                    </Col >
                </Row >
            </Container >
        </>

    );


};

export default LoginForm;
