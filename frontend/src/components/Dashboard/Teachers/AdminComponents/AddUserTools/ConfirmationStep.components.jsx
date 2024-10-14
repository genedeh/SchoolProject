import { Card, ListGroup, Button, Table, Row, Col, Badge } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import axios from 'axios';

export const ConfirmationStep = ({ formData, prevStep, setStep, setFormData }) => {
    const { username, first_name, last_name, password, email, address, birth_date,
        is_student_or_teacher, is_superuser, phone_number, profile_picture, classes, gender, subjects
    } = formData;
    const current_date = new Date();
    const [currentClassroom, setCurrentClassroom] = useState(null);
    const [offeringSubjects, setOfferingSubjects] = useState([]);
    const [displayProfilePicture, setDisplayProfilePicture] = useState(null)
    const [userType, setUserType] = useState('');

    const handleSubmit = async () => {
        axios.post('api/users/', formData)
            .then(response => {
                if (response.data['username'] === username) {
                    setStep(1);
                    setFormData({
                        "username": "",
                        "password": "",
                        "email": "",
                        "first_name": "",
                        "last_name": "",
                        "profile_picture": null,
                        "is_student_or_teacher": true,
                        "birth_date": null,
                        "address": "",
                        "is_superuser": false,
                        "phone_number": "",
                        "gender": "male",
                        "classes": [],
                        "subjects": []
                    })
                    alert("New User Was Succesfully Added")
                }
            }).catch(e => {
                console.log(e)
                alert("Failed To Add New User");
            })
    }

    const fetchClassSubjects = async (subjects) => {
        if (subjects.length !== 0) {
            await axios.post('/api/get-subjects/', { "subject_ids": subjects })
                .then(response => {
                    const data = response.data
                    setOfferingSubjects(data)
                })
        }
    }
    const fetchClassroom = async (classId) => {
        await axios.get(`/api/classrooms/${classId}/`)
            .then(response => {
                if (response.data["detail"]) {
                    setCurrentClassroom(null)
                } else {
                    setCurrentClassroom(response.data)
                }
            })
    }
    useEffect(() => {
        if (is_student_or_teacher) {
            setUserType('Student');
            if (subjects.length !== 0 && classes.length !== 0) {
                fetchClassSubjects(subjects)
                fetchClassroom(classes[0])
            }
        } else {
            if (is_superuser) {
                setUserType('Admin');
            } else {
                setUserType('Teacher');
            }
        }


        if (profile_picture) {
            const reader = new FileReader();
            reader.onload = () => {
                setDisplayProfilePicture(reader.result); // Display selected image
            };
            reader.readAsDataURL(profile_picture);
        }
    }, [])


    return (
        <>
            <div className="container mt-4">
                {/* User Header */}
                <Card className="mb-4">
                    <Card.Body>
                        <Row>
                            <Col md={2} className="text-center">
                                <img
                                    src={
                                        displayProfilePicture ||
                                        'http://127.0.0.1:8000/media/default_profile_images/default_image.jpeg' // Default placeholder image
                                    }
                                    alt="Profile"
                                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                    className="rounded-circle"
                                />
                            </Col>
                            <Col md={8}>
                                <h4 className='mt-2 text-center'>{username.replace("_", " ")}  <hr />
                                    {userType === "Student" ? (<Badge bg="primary">Student</Badge>)
                                        : (userType === "Admin" ? (<Badge bg="success">Admin</Badge>)
                                            : (<Badge bg="danger">Teacher</Badge>))}</h4>
                                <p className="text-muted">{currentClassroom ? (currentClassroom.name) : ('No Class Selected')}</p>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>

                {/* User Details */}
                <Card className="mb-4">
                    <Card.Body>
                        <ListGroup variant="flush">
                            <ListGroup.Item><strong>FirstName:</strong> {first_name}</ListGroup.Item>
                            <ListGroup.Item><strong>LastName:</strong> {last_name}</ListGroup.Item>
                            <ListGroup.Item><strong>Password:</strong> {password}</ListGroup.Item>
                            <ListGroup.Item><strong>Gender:</strong> {gender.toLocaleUpperCase()}</ListGroup.Item>
                            <ListGroup.Item><strong>Email Address:</strong> {email}</ListGroup.Item>
                            <ListGroup.Item><strong>Phone Number:</strong> {phone_number}</ListGroup.Item>
                            <ListGroup.Item><strong>Address:</strong> {address}</ListGroup.Item>
                            <ListGroup.Item><strong>Birth Of Date:</strong> {birth_date && birth_date}</ListGroup.Item>
                            <ListGroup.Item><strong>Age:</strong> {birth_date && current_date.getFullYear() - Number(birth_date.split('-')[0])}</ListGroup.Item>
                        </ListGroup>
                    </Card.Body>
                </Card>

                {/* Organizations */}
                <Card className="mb-4">
                    <Card.Header>Offering Subjects</Card.Header>
                    <Card.Body>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Assigned Teacher</th>
                                    <th>No Of Students</th>
                                </tr>
                            </thead>
                            <tbody>
                                {offeringSubjects.map(({ id, name, assigned_teacher, students_offering }) => (
                                    <tr key={id}>
                                        <td>{name.replace('_', ' ')}</td>
                                        <td>{assigned_teacher ? (assigned_teacher.username.replace('_', ' ')) : ("NO ASSIGNED TEACHER")}</td>
                                        <td>{students_offering.length}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>

            </div>
            <div className="d-flex justify-content-between mt-4">
                <Button variant="secondary" onClick={prevStep}>
                    Back
                </Button>
                <Button variant="primary" onClick={handleSubmit} >
                    Submit
                </Button>
            </div>
            <br />
        </>
    );
};