import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ErrorModal } from '../ErrorHandling/ErrorModal.components';
import { Container, Form, Row, Col, Button,  Spinner } from 'react-bootstrap'
import '../Authentication/Login.styles.css'


const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState([]);
    const [show, setShow] = useState(false);
    let navigate = useNavigate();
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => setUsername(`${firstname}_${lastname}`)
        , [firstname, lastname])
    const handleLogin = async (event) => {
        event.preventDefault();
        if (!firstname || !lastname || !password) {
            setError(['FORM NOT FILLED COMPLETELY', 'CREDENTIALS ARE REQUIRED'])
            handleShow();
        } else {
            setLoading(true);
            try {
                const response = await axios.post('http://127.0.0.1:8000/api/login/', { username, password });
                localStorage.setItem('token', response.data.access);
                setError([]);
                return navigate("/dashboard/home")
            } catch (err) {
                if (err.message === "Network Error") {
                    setError(['NETWORK ISSUE', 'THERE SEEMS TO BE A PROBLEM WITH OUR SERVER NETWORK PLEASE TRY AGAIN!'])
                    handleShow();
                } else {
                    setError(['AUTHENTICATION PROBLEM', "Invalid Credentials"])
                    handleShow();
                }
            }

        }
        setLoading(false)
    };
    return (
        <>
            <Container fluid="true" className="login-container" >
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
                                    <Form onSubmit={handleLogin}>
                                        <Form.Group controlId="formFirstname">
                                            <Form.Control type="text" placeholder="Enter firstname" value={firstname} onChange={(e) => setFirstname(e.target.value)} />
                                        </Form.Group>
                                        <br />
                                        <Form.Group controlId="formLastname">
                                            <Form.Control type="text" placeholder="Enter lastname" value={lastname} onChange={(e) => setLastname(e.target.value)} />
                                        </Form.Group>
                                        <br />
                                        <Form.Group controlId="formPassword">
                                            <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
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
            <ErrorModal errorMessage={error} show={show} handleClose={handleClose} />
        </>

    );


};

export default LoginForm;
