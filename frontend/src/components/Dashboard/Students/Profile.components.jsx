import {  useEffect, useState } from 'react';
import { Card, Image, Button, Container, Row, Col, Badge, ListGroup } from 'react-bootstrap';
import { GenderFemale, GenderMale, GeoAlt, Telephone } from 'react-bootstrap-icons';
import { useUser } from '../../../contexts/User.contexts';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

const StudentProfile = () => {
    const { currentUser } = useUser();
    const [offeringSubjects, setOfferingSubjects] = useState([]);
    const { first_name, last_name, username, address, phone_number, email, profile_picture, birth_date, gender, user_class, offering_subjects } = currentUser;
    const fetchSubjects = async () => {
        await axios.post("api/get-subjects/", { "subject_ids": offering_subjects })
            .then((response) => {
                setOfferingSubjects(response.data)
            })
            .catch(error => {
                console.error("Failed to fetch subjects.");
            });
    }
    useEffect(() => {
        if (offering_subjects.length !== 0) {
            fetchSubjects()
        }
    }, [currentUser])

    if (currentUser.is_student_or_teacher && currentUser) {
        return (
            <>
                <Container className="m-2">
                    <Row>
                        <Col md={8}>
                            <Card className="m-2">
                                <Card.Header className="bg-gradient">
                                    <div className="d-flex align-items-center">
                                        <div className="me-3">
                                            <Image
                                                src={profile_picture ? (`http://127.0.0.1:8000/media/${profile_picture}`) : ("http://127.0.0.1:8000/media/default_profile_images/default_image.jpeg")}
                                                roundedCircle
                                                style={{ width: '100px', height: '100px', 'objectFit': 'cover' }}
                                            />
                                        </div>
                                        <div>
                                            <Card.Title className="mb-0 fw-bold">{first_name} {last_name}</Card.Title>
                                            <br />
                                            <Card.Subtitle className="text-muted"><GeoAlt className="me-2" /> {address}</Card.Subtitle>
                                            <div className="d-flex align-items-center mt-2">
                                                @   {username}
                                            </div>
                                            <div className="d-flex align-items-center mt-2">
                                                <Telephone className='me-2' />{phone_number}
                                            </div>
                                            <div className="d-flex align-items-center mt-2">
                                                {gender === 'male' ?
                                                    (<Button className="m-2" size="sm" variant='primary' style={{ 'borderColor': 'white' }}>
                                                        <GenderMale />
                                                    </Button>) :
                                                    (<Button className="m-2" size="sm" style={{ 'backgroundColor': 'pink', 'borderColor': 'white' }}>
                                                        <GenderFemale />
                                                    </Button>)}
                                            </div>
                                        </div>
                                    </div>
                                </Card.Header>
                                <Card.Body className="d-flex justify-content-between">
                                    <Button variant="outline-primary">{email}</Button>
                                    <Button variant="outline-danger">{birth_date}</Button>
                                    <Button variant="outline-success">Class • {user_class}</Button>
                                </Card.Body>
                            </Card>
                            <Card className="mb-4">
                                <Card.Body>
                                    <Card.Title>Offering Subjects</Card.Title>
                                    {offeringSubjects.map(({ id, name }) => (
                                        <Badge pill bg="primary" className="me-2 mb-2" key={id} >
                                            {name.replace(`'`, '').replace(`'`, '')}
                                        </Badge>
                                    ))}
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container >
            </>
        )
    } return (
        <Navigate to='/dashboard/home' />
    );
}

export default StudentProfile