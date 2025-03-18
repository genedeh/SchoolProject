import { Card, ListGroup, Button, Table, Row, Col, Badge, Alert } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useMutation } from 'react-query';
import { ErrorAlert } from '../../../../Alerts/ErrorAlert.components';
import { ErrorMessageHandling } from '../../../../../utils/ErrorHandler.utils'
import { SuccessAlert } from '../../../../Alerts/SuccessAlert.components';
import axios from 'axios';
import './AddUser.styles.css'
import { CenteredSpinner } from '../../../../Loading/CenteredSpinner.components';

const useCreateUser = (userData) => {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("Authentication token is missing!");
    }
    const formData = new FormData();
    console.log(userData)
    // Append normal fields
    for (const key in userData) {
        if (Array.isArray(userData[key])) {
            // Append each array item separately (important for Django)
            userData[key].forEach(value => {
                formData.append(`${key}[]`, value);
            });
        } else {
            formData.append(key, userData[key]);
        }
    }

    console.log(formData)

    // Send POST request
    return axios.post("/api/users/", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
    });
};



export const ConfirmationStep = ({ formData, prevStep, setStep, setFormData }) => {
    const { username, first_name, last_name, password, email, address, birth_date,
        is_student_or_teacher, is_superuser, phone_number, profile_picture, classes, gender, subjects
    } = formData;
    const current_date = new Date();
    const [currentClassroom, setCurrentClassroom] = useState(null);
    const [offeringSubjects, setOfferingSubjects] = useState([]);
    const [displayProfilePicture, setDisplayProfilePicture] = useState(null)
    const [userType, setUserType] = useState('');
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("Authentication token is missing!");
    }


    // const handleSubmit = async () => {
    const { mutate: handleSubmit, isLoading, isError, error, isSuccess } = useMutation(
        useCreateUser
    );


    const fetchClassSubjects = async (subjects) => {
        if (subjects.length !== 0) {
            await axios.post('/api/get-subjects/', { "subject_ids": subjects },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            )
                .then(response => {
                    const data = response.data
                    setOfferingSubjects(data)
                })
        }
    }
    const fetchClassroom = async (classId) => {
        await axios.get(`/api/classrooms/${classId}/`,
            {
                headers: { Authorization: `Bearer ${token}` },
            })
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

            {isLoading ? (<CenteredSpinner caption={`Creating ${username}...`} />) : (
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
            )}
            {isSuccess &&
                <SuccessAlert heading="User Creation Status" message={`User ${username} was created successfully`}>
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
                </SuccessAlert>
            }
            {isError && <ErrorAlert heading="User creation failed" message={ErrorMessageHandling(isError, error)} removable={true} />}

            <div className="d-flex justify-content-between mt-4">
                <Button variant="secondary" onClick={prevStep}>
                    Back
                </Button>
                <Button variant="primary" onClick={() => {
                    handleSubmit(formData);
                }} disabled={isLoading}>
                    Submit
                </Button>
            </div>
            <br />
        </>
    );
};