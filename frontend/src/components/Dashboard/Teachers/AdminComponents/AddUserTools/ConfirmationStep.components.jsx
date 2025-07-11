import { Card, Badge, Table, ListGroup, Row, Col, Button, Alert, Spinner } from 'react-bootstrap';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkedAlt, FaBirthdayCake, FaTransgender, FaSchool, FaBook, FaCheckCircle } from 'react-icons/fa'; import { useState, useEffect } from 'react';
import { useMutation } from 'react-query';
import { ErrorAlert } from '../../../../Alerts/ErrorAlert.components';
import { ErrorMessageHandling } from '../../../../../utils/ErrorHandler.utils'
import NoProfilePicture from '../../../../../assets/NoProfilePicture.jpg'
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
        is_student_or_teacher, is_superuser, phone_number, profile_picture, classes, gender, subjects,
        parent_guardian_name, parent_guardian_phone, parent_guardian_email, home_town, admission_number,
        local_government_area,religion, blood_group, genotype, disability_status,
        boarding_status, nin, state_of_origin
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
    // 1. Determine and set the user type
    useEffect(() => {
        if (is_student_or_teacher) {
            setUserType('Student');
        } else {
            setUserType(is_superuser ? 'Admin' : 'Teacher');
        }
    }, [is_student_or_teacher, is_superuser]);

    // 2. Fetch class subjects and classroom only when subjects or classes change (and user is student/teacher)
    useEffect(() => {
        if (is_student_or_teacher && subjects.length !== 0 && classes.length !== 0) {
            fetchClassSubjects(subjects);
            fetchClassroom(classes[0]);
        }
    }, [subjects, classes, is_student_or_teacher]);

    // 3. Load profile picture
    useEffect(() => {
        if (profile_picture) {
            const reader = new FileReader();
            reader.onload = () => {
                setDisplayProfilePicture(reader.result);
            };
            reader.readAsDataURL(profile_picture);
        }
    }, [profile_picture]);
    console.log(email)



    return (
        <>
            {isLoading ? (
                <div className="text-center py-5">
                    <CenteredSpinner caption={`Creating ${username}...`} />
                </div>
            ) : (
                <div className="mt-4 user-preview">

                    {/* Header Card */}
                    <Card className="mb-4 box shadow-sm">
                        <Card.Body>
                            <Row className="align-items-center">
                                <Col xs={12} md={2} className="text-center mb-3 mb-md-0">
                                    <img
                                        src={displayProfilePicture || NoProfilePicture}
                                        alt="Profile"
                                        className="rounded-circle img-fluid border border-2"
                                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                    />
                                </Col>
                                <Col md={10}>
                                    <h4 className='text-center text-md-start'>{username.replace('_', ' ')} <hr />
                                        <Badge bg={
                                            userType === 'Student' ? 'primary' :
                                                userType === 'Admin' ? 'success' :
                                                    'danger'
                                        }>
                                            {userType}
                                        </Badge>
                                    </h4>
                                    {is_student_or_teacher && (
                                        currentClassroom ? (
                                            <p className="text-muted text-center text-md-start">
                                                <FaSchool className="me-2" />
                                                {currentClassroom.name}
                                            </p>
                                        ) : (
                                            <Spinner animation="border" size="sm" variant="secondary" className="ms-2" />
                                        )
                                    )}
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>

                    {/* Details Section */}
                    <Card className="mb-4 box shadow-sm">
                        <Card.Body>
                            <ListGroup variant="flush">
                                <ListGroup.Item><FaUser className="me-2" /> <strong>FirstName:</strong> {first_name}</ListGroup.Item>
                                <ListGroup.Item><FaUser className="me-2" /> <strong>LastName:</strong> {last_name}</ListGroup.Item>
                                <ListGroup.Item><FaCheckCircle className="me-2" /> <strong>Password:</strong> {password}</ListGroup.Item>
                                <ListGroup.Item><FaTransgender className="me-2" /> <strong>Gender:</strong> {gender.toUpperCase()}</ListGroup.Item>
                                <ListGroup.Item><FaEnvelope className="me-2" /> <strong>Email:</strong> {email !== '' ? email : 'None'}</ListGroup.Item>
                                <ListGroup.Item><FaPhone className="me-2" /> <strong>Phone:</strong> {phone_number !== '' ? phone_number : 'None'}</ListGroup.Item>
                                <ListGroup.Item><FaMapMarkedAlt className="me-2" /> <strong>Address:</strong> {address}</ListGroup.Item>
                                <ListGroup.Item><FaBirthdayCake className="me-2" /> <strong>DOB:</strong> {birth_date} | <strong>Age:</strong> {birth_date && current_date.getFullYear() - Number(birth_date.split('-')[0])}</ListGroup.Item>
                                <ListGroup.Item><strong>Admission No:</strong> {admission_number !== '' ? admission_number : 'None'}</ListGroup.Item>
                                <ListGroup.Item><strong>Guardian Name:</strong> {parent_guardian_name !== '' ? parent_guardian_name : 'None'}</ListGroup.Item>
                                <ListGroup.Item><strong>Guardian Phone:</strong> {parent_guardian_phone !== '' ? parent_guardian_phone : 'None'}</ListGroup.Item>
                                <ListGroup.Item><strong>Guardian Email:</strong> {parent_guardian_email !== '' ? parent_guardian_email : 'None'}</ListGroup.Item>
                                <ListGroup.Item><strong>Home Town:</strong> {home_town}</ListGroup.Item>
                                <ListGroup.Item><strong>LGA:</strong> {local_government_area}</ListGroup.Item>
                                <ListGroup.Item><strong>Religion:</strong> {religion}</ListGroup.Item>
                                <ListGroup.Item><strong>Blood Group:</strong> {blood_group !== '' ? blood_group : 'None'}</ListGroup.Item>
                                <ListGroup.Item><strong>Genotype:</strong>{genotype !== '' ? genotype : 'None'}</ListGroup.Item>
                                <ListGroup.Item><strong>Disability:</strong> {disability_status !== '' ? disability_status : 'None'}</ListGroup.Item>
                                <ListGroup.Item><strong>Boarding:</strong> {boarding_status}</ListGroup.Item>
                                <ListGroup.Item><strong>NIN:</strong> {nin !== '' ? nin : 'None'}</ListGroup.Item>
                                <ListGroup.Item><strong>State Of Origin:</strong> {state_of_origin}</ListGroup.Item>
                            </ListGroup>
                        </Card.Body>
                    </Card>

                    {/* Subjects Section */}
                    {is_student_or_teacher && (
                        <Card className="mb-4 shadow-sm box">
                            <Card.Header>
                                <FaBook className="me-2" />
                                Offering Subjects
                            </Card.Header>
                            <Card.Body>
                                {offeringSubjects.length === 0 ? (
                                    <div className="text-center">
                                        <Spinner animation="grow" size="sm" className="me-2" />
                                        Loading subjects...
                                    </div>
                                ) : (
                                    <Table responsive striped hover>
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
                                                    <td>{assigned_teacher ? (assigned_teacher.username.replace('_', ' ')) : "No Assigned Teacher"}</td>
                                                    <td><Badge bg="info">{students_offering.length}</Badge></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                )}
                            </Card.Body>
                        </Card>
                    )}
                </div>
            )}

            {/* Success Alert */}
            {isSuccess && (
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
                            "subjects": [],
                            "admission_number": "",
                            "parent_guardian_name": "",
                            "parent_guardian_phone": "",
                            "parent_guardian_email": "",
                            "home_town": "",
                            "local_government_area": "",
                            "religion": "",
                            "blood_group": "",
                            "genotype": "",
                            "disability_status": "",
                            "boarding_status": "Day",
                            "nin": "",
                            "state_of_origin": "",
                        });
                        setStep(1);
                    }}>Go Back</Alert.Link>
                </SuccessAlert>
            )}

            {isError && (
                <ErrorAlert heading="User creation failed" message={ErrorMessageHandling(isError, error)} removable />
            )}

            {/* Navigation */}
            <div className="d-flex justify-content-between mt-4 footer mb-3">
                <Button variant="secondary" onClick={prevStep} className="custom-btn2">Back</Button>
                <Button className="custom-btn" onClick={() => handleSubmit(formData)} disabled={isLoading}>Submit</Button>
            </div>
        </>
    );
};