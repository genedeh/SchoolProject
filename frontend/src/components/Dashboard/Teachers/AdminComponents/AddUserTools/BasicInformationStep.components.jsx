import { useEffect, useState } from "react";
import { Form, Button, InputGroup } from "react-bootstrap";
import { FaUser, FaEnvelope } from "react-icons/fa";

import './AddUser.styles.css';
import axios from "axios";
export const BasicInformationStep = ({ formData, nextStep, prevStep, updateFormData }) => {
    const [firstName, setFirstname] = useState(formData.first_name);
    const [lastName, setLastname] = useState(formData.last_name);
    const [email, setEmail] = useState(formData.email);
    const [error, setError] = useState({
        'username': '',
        'email': '',
    });
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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
        const token = localStorage.getItem("token");

        if (!token) {
            throw new Error("Authentication token is missing!");
        }
        if (firstName !== '' && lastName !== '') {
            axios.get(`api/users/?username=${firstName}_${lastName}`,
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
                    }
                })
        }
    }, [firstName, lastName, email])

    const handleSubmit = (e) => {
        e.preventDefault()
        if (firstName !== '' && lastName !== '' && email !== '') {
            setError((prevData) => ({
                ...prevData,
                'required': null,
            }))
            if (error.email === null && error.username === null) {
                nextStep()
                updateFormData('first_name', firstName);
                updateFormData('last_name', lastName);
                updateFormData('username', `${firstName}_${lastName}`);
                updateFormData('email', email);
            }
        } else {
            setError((prevData) => ({
                ...prevData,
                'required': 'All fields are required',
            }))
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
                    <InputGroup>
                        <InputGroup.Text><FaUser /></InputGroup.Text>
                        <Form.Control
                            type="text"
                            required
                            placeholder="Enter First Name"
                            value={firstName}
                            onChange={(e) => setFirstname(e.target.value)}
                            isInvalid={!!error.username}
                        />
                    </InputGroup>
                    <Form.Control.Feedback type="invalid">{error.username}</Form.Control.Feedback>
                </Form.Group>

                {/* Last Name Field */}
                <Form.Group controlId="formLastname" className="mb-3">
                    <InputGroup>
                        <InputGroup.Text><FaUser /></InputGroup.Text>
                        <Form.Control
                            type="text"
                            required
                            placeholder="Enter Last Name"
                            value={lastName}
                            onChange={(e) => setLastname(e.target.value)}
                            isInvalid={!!error.username}
                        />
                    </InputGroup>
                    <Form.Control.Feedback type="invalid">{error.username}</Form.Control.Feedback>
                </Form.Group>

                {/* Email Field */}
                <Form.Group controlId="formEmail" className="mb-3">
                    <InputGroup>
                        <InputGroup.Text><FaEnvelope /></InputGroup.Text>
                        <Form.Control
                            type="email"
                            required
                            placeholder="Enter Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            isInvalid={!!error.email}
                        />
                    </InputGroup>
                    <Form.Control.Feedback type="invalid">{error.email}</Form.Control.Feedback>
                </Form.Group>

                {/* Navigation Buttons */}
                <div className="d-flex justify-content-between footer mt-5">
                    <Button variant="secondary" onClick={prevStep} className="custom-btn2">
                        Back
                    </Button>
                    <Button type="submit" className="custom-btn">
                        Next
                    </Button>
                </div>
            </Form>
        // </Container>
    )
}