import { Card, ListGroup, Button, Table, Row, Col, Badge } from 'react-bootstrap';
import { ClassroomsContext } from '../../../../../contexts/Classrooms.contexts';
import { SubjectsContext } from '../../../../../contexts/Subjects.contexts';
import { useState, useContext, useEffect } from 'react';


export const ConfirmationStep = ({ formData, prevStep, setStep }) => {
    const { username, first_name, last_name, password, email, address, birth_date,
        is_student_or_teacher, is_superuser, phone_number, profile_picture, classes, gender
    } = formData;
    const current_date = new Date();
    const { subjects } = useContext(SubjectsContext);
    const { classrooms } = useContext(ClassroomsContext);
    const [currentClassroom, setCurrentClassroom] = useState('');
    const [userType, setUserType] = useState('');
    const test = [4, 6]

    useEffect(() => {
        if (is_student_or_teacher) {
            setUserType('Student');
        } else {
            if (is_superuser) {
                setUserType('Admin');
            } else {
                setUserType('Teacher');
            }
        }

        setCurrentClassroom(classrooms.filter(({ id }) => id === classes[0]))

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
                                        profile_picture ||
                                        'http://127.0.0.1:8000/media/default_profile_images/default_image.jpeg' // Default placeholder image
                                    }
                                    alt="Profile"
                                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                    className="rounded-circle"
                                />
                            </Col>
                            <Col md={8}>
                                <h4>{username.replace("_", " ")}  <hr />
                                    {userType === "Student" ? (<Badge bg="primary">Student</Badge>)
                                        : (userType === "Admin" ? (<Badge bg="success">Admin</Badge>)
                                            : (<Badge bg="dark">Teacher</Badge>))}</h4>
                                <p className="text-muted">{currentClassroom.length !== 0 ? (currentClassroom[0].name) : ('No Class Selected')}</p>
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
                                {formData.subjects.map((subjectId) => {
                                    const newSubject = subjects.filter(({ id }) => id === subjectId);
                                    return (
                                        <tr>
                                            <td>{newSubject[0].name.replace('_', ' ')}</td>
                                            <td>{newSubject[0].assigned_teacher ? (newSubject[0].assigned_teacher.username.replace('_', ' ')) : ("NO ASSIGNED TEACHER")}</td>
                                            <td>{newSubject[0].students_offering.length}</td>
                                        </tr>
                                    );
                                })}

                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>

            </div>
            <div className="d-flex justify-content-between mt-4">
                <Button variant="secondary" onClick={prevStep}>
                    Back
                </Button>
                <Button variant="primary" >
                    View sessions
                </Button>
            </div>
            <br />
        </>
    );
};