import { useEffect, useState } from "react";
import { Form, Button, InputGroup, Spinner } from "react-bootstrap";
import { FaUser, FaEnvelope } from "react-icons/fa";

import './AddUser.styles.css';
import axios from "axios";
export const BasicInformationStep = ({ formData, nextStep, prevStep, updateFormData }) => {
    const [firstName, setFirstname] = useState(formData.first_name);
    const [lastName, setLastname] = useState(formData.last_name);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState(formData.email);
    const [error, setError] = useState({
        'username': '',
        'email': '',
    });
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const token = localStorage.getItem("token");
    useEffect(() => {
        if (email !== '') {
            if (!regex.test(email)) {
                setError((prevData) => ({
                    ...prevData,
                    'email': 'Invalid Email',
                }))
            } else {
                setError((prevData) => ({
                    ...prevData,
                    'email': null,
                }))
            }
        }

        if (!token) {
            throw new Error("Authentication token is missing!");
        }

    }, [firstName, lastName, email])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true);
        if (firstName !== '' && lastName !== '') {
            await axios.get(`api/users/?username=${firstName}_${lastName}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            )
                .then(response => {
                    if (response.data.results.length > 0 && response.data.results[0]['is_student_or_teacher'] === formData['is_student_or_teacher']) {
                        setError((prevData) => ({
                            ...prevData,
                            'username': 'Username already exists.',
                        }))
                    } else {
                        setError((prevData) => ({
                            ...prevData,
                            'username': null,
                        }))
                        nextStep();
                        updateFormData('first_name', firstName)
                        updateFormData('last_name', lastName)
                        updateFormData('email', email)
                        updateFormData('username', `${firstName}_${lastName}`);
                    }
                }).finally(() => {
                    setLoading(false);
                })
        }
    }
    return (
        // <Container fluid className="form-container">
        <Form onSubmit={handleSubmit} className="mt-4">
            <hr />
            <h2 className="form-title">Fill In Needed Information</h2>
            <hr />

            {/* First Name Field */}
            <Form.Group controlId="formFirstname" className="mb-3">
                <Form.Label> <b> First Name</b></Form.Label>
                <InputGroup>
                    <InputGroup.Text><FaUser /></InputGroup.Text>
                    <Form.Control
                        type="text"
                        placeholder="Enter your first name"
                        value={firstName}
                        onChange={(e) => setFirstname(e.target.value)}
                        isInvalid={!!error.username}
                        required
                    />
                    <Form.Control.Feedback type="invalid">
                        {error.username}
                    </Form.Control.Feedback>
                </InputGroup>
            </Form.Group>

            {/* Last Name Field */}
            <Form.Group controlId="formLastname" className="mb-3">
                <Form.Label> <b> Last Name</b></Form.Label>
                <InputGroup>
                    <InputGroup.Text><FaUser /></InputGroup.Text>
                    <Form.Control
                        type="text"
                        placeholder="Enter your last name"
                        value={lastName}
                        onChange={(e) => setLastname(e.target.value)}
                        isInvalid={!!error.username}
                        required
                    />
                    <Form.Control.Feedback type="invalid">
                        {error.username}
                    </Form.Control.Feedback>
                </InputGroup>
            </Form.Group>

            {/* Email Field */}
            <Form.Group controlId="formEmail" className="mb-3">
                <Form.Label> <b> Email Address</b></Form.Label>
                <InputGroup>
                    <InputGroup.Text><FaEnvelope /></InputGroup.Text>
                    <Form.Control
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        isInvalid={!!error.email}
                        required
                    />
                    <Form.Control.Feedback type="invalid">
                        {error.email}
                    </Form.Control.Feedback>
                </InputGroup>
            </Form.Group>


            {/* Navigation Buttons */}
            <div className="d-flex justify-content-between footer mt-5">
                <Button variant="secondary" onClick={prevStep} className="custom-btn2">
                    Back
                </Button>
                <Button type="submit" className="custom-btn" disabled={!!loading}>
                    {loading &&
                        <Spinner
                            as="span"
                            animation="grow"
                            size="sm"
                            className="ml-2"
                            role="status"
                            aria-hidden="true"
                        />
                    }
                    Next
                </Button>
            </div>
        </Form>
        // </Container>
    )
}