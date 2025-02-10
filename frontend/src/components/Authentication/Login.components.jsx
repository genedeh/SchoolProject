import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Row, Col, Button, Spinner } from 'react-bootstrap'
import '../Authentication/Login.styles.css'
import { ErrorAlert } from '../Alerts/ErrorAlert.components';
import { WarningAlert } from '../Alerts/WarningAlert.components';
import logo512 from '../../assets/logo512.png'
import { LoadingOverlay } from '../Loading/LoadingOverlay.components';

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    let navigate = useNavigate();

    useEffect(() => setUsername(`${firstname.replace(/ /g, "")}_${lastname.replace(/ /g, "")}`)
        , [firstname, lastname])
    const handleLogin = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            await axios.post('api/login/', { username, password })
                .then(response => {
                    localStorage.setItem('token', response.data.access);
                    setTimeout(() => {
                        setLoading(false)
                        setError(null);
                        return navigate("/dashboard/home")
                    }, 5000)
                });
        } catch (err) {
            if (err.message === "Network Error") {
                setError("Network")
            } else {
                setError("401")
            }
            setLoading(false)
            setTimeout(() => {
                setError(null)
            }, 5000)
        }
    };
    return (
        <>
            <Container fluid="true" className="login-container" >
                <Row className="justify-content-center align-items-center min-vh-100">
                    {error == "Network" ? (
                        <WarningAlert
                            heading={"Network Error"}
                            message={"We are unable to connect to the server. Please check your internet connection and try again."}
                        >
                            <a href="/">Try Again!</a>
                        </WarningAlert>) : ("")
                    }
                    {error == "401" ? (
                        <ErrorAlert
                            heading={"Authentication Problem 401"}
                            message={"Access denied. You do not have permission to view this page. Please contact support if you believe this is a mistake."} >
                            <a href="/">Try Again!</a>
                        </ErrorAlert>) : ("")
                    }
                    <Col md={4} className="login-box text-center">
                        <LoadingOverlay loading={loading} message='Authenticating user...' />
                        <div>
                            <div className="login-header">
                                <img src={logo512} alt="logo" className="img-fluid" width={50} height={50} />
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
                                    <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value.replace(/ /g, ""))} required />
                                </Form.Group>
                                <br />
                                <Button variant="primary" type="submit" block="true">
                                    Log In
                                </Button>
                            </Form>
                            <div className="login-footer">
                                <b>V2.1.2--Ogunboyejo Adeola Memorial School--V2.1.2</b>
                            </div>
                        </div>
                        {/* )- */}
                        {/* } */}
                    </Col >
                </Row >
            </Container >
        </>

    );

};

export default LoginForm;
