import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Row, Col, Button, Spinner } from 'react-bootstrap'
import '../Authentication/Login.styles.css'
import { ErrorAlert } from '../Alerts/ErrorAlert.components';
import { WarningAlert } from '../Alerts/WarningAlert.components';


const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    let navigate = useNavigate();

    useEffect(() => setUsername(`${firstname}_${lastname}`)
        , [firstname, lastname])
    const handleLogin = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post('api/login/', { username, password });
            localStorage.setItem('token', response.data.access);
            setError([]);
            return navigate("/dashboard/home")
        } catch (err) {
            if (err.message === "Network Error") {
                setError("Network")
            } else {
                setError("401")
            }
        }

        setLoading(false)
    };
    return (
        <>
            <Container fluid="true" className="login-container" >
                <Row className="justify-content-center align-items-center min-vh-100">
                    <br />
                    {error == "401" ? (<ErrorAlert heading={"Authentication Problem 401"} message={"Invalid Credentials"} />) : ("")}
                    {error == "Network" ? (<WarningAlert heading={"Network Issue"} message={"There seems to be a problem with our server or your internetv connection try again later!"} />) : ("")}
                    <Col md={4} className="login-box text-center">
                        {loading ?
                            (<Spinner animation="border" role="status"><span className="visually-hidden">Loading...</span></Spinner>)
                            : (
                                <div>
                                    <div className="login-header">
                                        <img src="" alt="logo" className="img-fluid" />
                                        <h1 className="login-title">Login</h1>
                                    </div >
                                    <Form onSubmit={handleLogin}>
                                        <Form.Group controlId="formFirstname">
                                            <Form.Control type="text" placeholder="Enter firstname" value={firstname} onChange={(e) => setFirstname(e.target.value)} required />
                                        </Form.Group>
                                        <br />
                                        <Form.Group controlId="formLastname">
                                            <Form.Control type="text" placeholder="Enter lastname" value={lastname} onChange={(e) => setLastname(e.target.value)} required />
                                        </Form.Group>
                                        <br />
                                        <Form.Group controlId="formPassword">
                                            <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                        </Form.Group>
                                        <br />
                                        <Button variant="primary" type="submit" block="true">
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
