import { useEffect, useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
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
                    ['email']: 'Invalid Email',
                }))
            } else {
                setError((prevData) => ({
                    ...prevData,
                    ['email']: null,
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
                            ['username']: 'Username already exists.',
                        }))
                    } else {
                        setError((prevData) => ({
                            ...prevData,
                            ['username']: null,
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
                ['required']: null,
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
                ['required']: 'All fields are required',
            }))
        }
    }
    return (
        <Container fluid={true}>
            <Form onSubmit={handleSubmit} className="box mt-4">
                <div className="header">
                    <h1 className="title">Fill In Needed Information</h1>
                </div>
                <Form.Group controlId="formFirstname">
                    <Form.Control type="text" required placeholder="Enter firstname" value={firstName} onChange={(e) => setFirstname(e.target.value)} isInvalid={!!error.username} />
                    <Form.Control.Feedback type="invalid">{error.username}</Form.Control.Feedback>
                </Form.Group>
                <br />
                <Form.Group controlId="formLastname">
                    <Form.Control type="text" required placeholder="Enter lastname" value={lastName} onChange={(e) => setLastname(e.target.value)} isInvalid={!!error.username} />
                    <Form.Control.Feedback type="invalid">{error.username}</Form.Control.Feedback>
                </Form.Group>
                <br />
                <Form.Group controlId="formEmail">
                    <Form.Control type="email" required placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} isInvalid={!!error.email} />
                    <Form.Control.Feedback type="invalid">{error.email}</Form.Control.Feedback>
                </Form.Group>
                <br />
                <div className="d-flex justify-content-between footer">
                    <Button variant="secondary" onClick={prevStep}>
                        Back
                    </Button>
                    <Button variant="primary" type="submit"   >
                        Next
                    </Button>
                </div>
            </Form>
        </Container>
    )
}