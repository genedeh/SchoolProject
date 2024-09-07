import { useEffect, useState } from "react"
import { Form, Button, Container, Alert } from "react-bootstrap"
import axios from "axios";
export const BasicInformationStep = ({ formData, nextStep, prevStep, updateFormData }) => {
    const [firstName, setFirstname] = useState(formData.first_name);
    const [lastName, setLastname] = useState(formData.last_name);
    const [email, setEmail] = useState(formData.email);
    const [error, setError] = useState({
        'username': '',
        'email': '',
        'required': '',
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
        if (firstName !== '' && lastName !== '') {
            axios.get(`api/users/?username=${firstName}_${lastName}`)
                .then(response => {
                    if (response.data.length > 0 && response.data[0]['is_student_or_teacher'] === formData['is_student_or_teacher']) {
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
            <hr /><h1 className="login-title">Fill In Needed Information</h1><hr />
            <Form>
                {error.username && <small className="text-danger m-4" >{error.username}</small>}<br/>
                {error.required && <Alert className="text-danger m-2" variant="danger" dismissible>{error.required}</Alert>}
                <Form.Group controlId="formFirstname">
                    <Form.Control type="text" required={true} placeholder="Enter firstname" value={firstName} onChange={(e) => setFirstname(e.target.value)} />
                </Form.Group>
                <br />
                <Form.Group controlId="formLastname">
                    <Form.Control type="text" required={true} placeholder="Enter lastname" value={lastName} onChange={(e) => setLastname(e.target.value)} />
                </Form.Group>
                <br />
                <Form.Group controlId="formEmail">
                    <Form.Control type="email" required={true} placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    {error.email && <small className="text-danger mt-4" >{error.email}</small>}
                </Form.Group>
                <br />
                <div className="d-flex justify-content-between mt-4">
                    <Button variant="secondary" onClick={prevStep}>
                        Back
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}  >
                        Next
                    </Button>
                </div>
            </Form>
        </Container>
    )
}