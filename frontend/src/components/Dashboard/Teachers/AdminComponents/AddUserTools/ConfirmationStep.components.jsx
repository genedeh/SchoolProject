import { Card, ListGroup, Button, Table, Row, Col, Badge, Alert } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { ErrorAlert } from '../../../../Alerts/ErrorAlert.components';
import { SuccessAlert } from '../../../../Alerts/SuccessAlert.components';
import axios from 'axios';
import './AddUser.styles.css'
import { LoadingOverlay } from '../../../../Loading/LoadingOverlay.components';

export const ConfirmationStep = ({ formData, prevStep, setStep, setFormData }) => {
    const { username, first_name, last_name, password, email, address, birth_date,
        is_student_or_teacher, is_superuser, phone_number, profile_picture, classes, gender, subjects
    } = formData;
    const current_date = new Date();
    const [currentClassroom, setCurrentClassroom] = useState(null);
    const [offeringSubjects, setOfferingSubjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({
        "success": null,
        "fail": null,
    })
    const [displayProfilePicture, setDisplayProfilePicture] = useState(null)
    const [userType, setUserType] = useState('');

    const handleSubmit = async () => {
        setLoading(true)
        axios.post('api/users/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
            .then(response => {
                if (response.data['username'] === username) {
                    axios.patch(`api/users/${response.data["id"]}/`, { "classes": formData.classes, "subjects": formData.subjects })
                        .then(response => {
                            setLoading(false)
                            setAlert({ "success": `User ${response.data["username"]} was added succesfully`, "fail": null })

                        }).catch(e => {
                            setLoading(false)
                            axios.delete(`api/users/${response.data["id"]}/`).catch(e => {
                                setAlert({ "fail": `Failed To Add User ${formData["username"]}`, "success": null })
                            })
                            setAlert({ "fail": `Failed To Add User ${formData["username"]}`, "success": null })
                        })
                    setLoading(false)
                }
            }).catch(e => {
                setLoading(false)
                setAlert({ "fail": `Failed To Add User ${formData["username"]}`, "success": null })
            })
        setTimeout(() => {
            setAlert({ "fail": null, "success": null })
        }, 5000)
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

            <div className="mt-4">
                {/* User Header */}

                <Card className="mb-4 box">
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
                                {is_student_or_teacher && <p className="text-muted text-center">{currentClassroom ? (currentClassroom.name) : ('No Class Selected')}</p>}
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>

                {/* User Details */}
                <Card className="mb-4 box">
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
                {is_student_or_teacher &&
                    <Card className="mb-4 box">
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
                    </Card>}

            </div>
            {loading && <LoadingOverlay loading={loading} message='User creation in progress...' />}
            {alert.fail &&
                <ErrorAlert heading="User creation failed" message={alert.fail} >
                    <Alert.Link onClick={() => setStep(1)}>Go Back</Alert.Link>
                </ErrorAlert>}
            {alert.success &&
                <SuccessAlert heading="User creation was succesful" message={alert.success}>
                    <Alert.Link onClick={() => {
                        setFormData({
                            "username": "",
                            "password": "",
                            "email": "",
                            "first_name": "",
                            "last_name": "",
                            "profile_picture": null,
                            "is_student_or_teacher": true,
                            "birth_date": "",
                            "address": "",
                            "is_superuser": false,
                            "phone_number": "",
                            "gender": "male",
                            "classes": [],
                            "subjects": []
                        })
                        setStep(1)
                    }}>Go Back</Alert.Link>
                </SuccessAlert>}
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