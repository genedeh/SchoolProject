import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button, Image } from "react-bootstrap";
import '../Authentication/Login.styles.css'
import { ErrorAlert } from '../Alerts/ErrorAlert.components';
import { WarningAlert } from '../Alerts/WarningAlert.components';
import loginImage from "../../assets/logo512.png"
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { LoadingOverlay } from '../Loading/LoadingOverlay.components';
import useLogin from '../../utils/LoginHandler.utils';

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [password, setPassword] = useState('');

    const { mutate, isLoading, error } = useLogin();

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };
    useEffect(() => setUsername(`${firstname.replace(/ /g, "")}_${lastname.replace(/ /g, "")}`)
        , [firstname, lastname])
    const handleLogin = async (event) => {
        event.preventDefault();
        mutate({ username, password });
    };
    return (
        <>
            <Container fluid className="login-container">
                <Row className="login-row">
                    {/* Left Side - Login Form */}
                    {error?.status === 500 ? (
                        <WarningAlert
                            heading={"Network Error"}
                            message={"We are unable to connect to the server. Please check your internet connection and try again."}
                        >
                            <a href="/">Try Again!</a>
                        </WarningAlert>) : ("")
                    }
                    {error?.status === 401 ? (
                        <ErrorAlert
                            heading={"Authentication Problem 401"}
                            message={"Access denied. You do not have permission to view this page. Please contact support if you believe this is a mistake."}
                            removable={true}
                        >
                            <a href="/">Try Again!</a>
                        </ErrorAlert>) : ("")
                    }
                    <LoadingOverlay loading={isLoading} message='Authenticating user...' />

                    <Col md={6} className="login-box">
                        <div className="login-content">
                            <h2 className="login-title">Login</h2>
                            <p className="login-subtitle">Enter your account details</p>

                            <Form onSubmit={handleLogin}>
                                {/* Username Input */}
                                <Form.Group controlId="formFirstNam">
                                    <Form.Control
                                        type="text"
                                        className='form-username'
                                        placeholder="FirstName"
                                        value={firstname}
                                        onChange={(e) => setFirstname(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <hr />
                                <Form.Group controlId="formLastName">
                                    <Form.Control
                                        type="text"
                                        className='form-username'
                                        placeholder="LastName"
                                        value={lastname}
                                        onChange={(e) => setLastname(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <hr />
                                {/* Password Input with Visibility Toggle */}
                                <Form.Group controlId="formPassword" className="password-group">
                                    <Form.Control
                                        type={passwordVisible ? "text" : "password"}
                                        placeholder="Password"
                                        className='form-password'
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    <span className="password-toggle" onClick={togglePasswordVisibility}>
                                        {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                                    </span>
                                </Form.Group>


                                {/* Login Button */}
                                <Button variant="primary" type="submit" className="login-btn">
                                    Login
                                </Button>
                            </Form>
                            <p className="signup-link mt-2">
                                © {new Date().getFullYear()} Ogunboyejo Adeola Memorial School. All rights reserved.
                            </p>
                        </div>
                    </Col>

                    {/* Right Side - Image */}
                    <Col md={6} className="d-none d-md-flex align-items-center justify-content-center bg-primary login-image-container">

                        <div className="login-image">
                            {/* Placeholder for Image */}
                            <Image
                                src={loginImage}
                                alt="Student Portal Illustration"
                                fluid
                                className="login-image"
                            />
                            <h2>Welcome to <br /><span>Student Portal</span></h2>
                            <p>Login to access your account</p>
                        </div>
                    </Col>
                </Row>
            </Container>
        </>

    );

};

export default LoginForm;
