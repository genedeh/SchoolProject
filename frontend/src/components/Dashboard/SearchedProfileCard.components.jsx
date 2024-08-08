import { Card, Button, Col, Image, Modal, Row, Badge } from 'react-bootstrap';
import { GenderFemale, GenderMale } from 'react-bootstrap-icons';
import { BsThreeDots, BsArrowLeft } from "react-icons/bs";
import { useState, useEffect } from 'react';
import axios from 'axios';

const ProfileModal = ({ user, show, handleClose }) => {
    const { username, is_student_or_teacher, gender, profile_picture, user_class, birth_date, phone_number, email, address, id } = user;
    const current_date = new Date();
    const [offeringSubjects, setOfferingSubjects] = useState([]);

    useEffect(() => {
        const fetchOfferingSubjects = async () => {
            if (user) {
                try {
                    const respone = await axios.post("http://127.0.0.1:8000/api/offering_subjects/", { "students_offering": id })
                    setOfferingSubjects(respone.data.Subjects.replace('[', '').replace(']', '').split(','))
                } catch (err) {
                    console.log("Error: ", err)
                }
            } else {
                console.log('No User Found')
            }
        };
        fetchOfferingSubjects();
    }, [])

    return (
        <Modal show={show} onHide={handleClose} centered size="lg" style={{ 'borderRadius': '1rem' }}>
            <Modal.Header closeButton>
                <Modal.Title style={{ 'textAlign': 'center' }}>Profile Overview</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center" style={{ backgroundColor: 'white' }}>
                <Button variant="link" className="position-absolute top-0 start-0 mt-2 ms-2" onClick={handleClose}>
                    <BsArrowLeft />
                </Button>
                {profile_picture !== null ? (<Image
                    src={profile_picture}
                    roundedCircle
                    style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                    className="mb-3" />)
                    : (<Image
                        src="http://127.0.0.1:8000/media/default_profile_images/default_image.jpeg"
                        roundedCircle
                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                        className="mb-3" />)
                }
                <h4>{username.replace('_', ' ')} <span className="badge">
                    {gender === 'male' ?
                        (<Button className="m-2" size="sm" variant='primary' style={{ 'borderColor': 'white' }}>
                            <GenderMale />
                        </Button>) :
                        (<Button className="m-2" size="sm" style={{ 'backgroundColor': 'pink', 'borderColor': 'white' }}>
                            <GenderFemale />
                        </Button>)
                    }</span></h4>
                <h5 className="text-muted">{is_student_or_teacher ? ("Student") : ("Teacher")}</h5>
                <p className='fw-bold text-muted'>Class • {user_class}</p>
                <hr />
                <Row className="text-start mb-3">
                    <Col><strong>Address • </strong></Col>
                    <Col>{address}</Col>
                </Row>
                <Row className="text-start mb-3">
                    <Col><strong>Phone No • </strong></Col>
                    <Col>{phone_number}</Col>
                </Row>
                <Row className="text-start mb-3">
                    <Col><strong>Date Of Birth • </strong></Col>
                    <Col>{birth_date}</Col>
                </Row>
                <Row className="text-start mb-3">
                    <Col><strong>Age • </strong></Col>
                    <Col>{current_date.getFullYear() - Number(birth_date.split('-')[0])}</Col>
                </Row>
                <Row className="text-start mb-3">
                    <Col><strong>Email • </strong></Col>
                    <Col><Button variant='outline-primary'>{email}</Button></Col>
                </Row>
                <hr />
                <Card className="mb-4">
                    <Card.Body>
                        <Card.Title>{is_student_or_teacher ? ("Offering Subjects") : ('')}</Card.Title>
                        {offeringSubjects.map(subject => (
                            <Badge pill bg="primary" className="me-2 mb-2" key={subject.replace(`'`, '').replace(`'`, '')} >
                                {subject.replace(`'`, '').replace(`'`, '')}
                            </Badge>
                        ))}
                    </Card.Body>
                </Card>
                <hr />
            </Modal.Body>
        </Modal>
    );
}


const SearchedProfileCard = ({ user }) => {
    const { username, is_student_or_teacher, gender, profile_picture, user_class } = user;
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Col md={4} className="mb-4">
                <Card className="h-100 container" >
                    <Card.Body className="d-flex flex-column align-items-start" >
                        <div className="d-flex align-items-center mb-3">
                            {profile_picture !== null ? (<Image
                                src={profile_picture}
                                roundedCircle
                                style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                                className="me-3" />)
                                : (<Image
                                    src="http://127.0.0.1:8000/media/default_profile_images/default_image.jpeg"
                                    roundedCircle
                                    style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                                    className="me-3" />)
                            }
                            <div>
                                <Card.Title className="mb-0">{username.replace('_', ' ')}</Card.Title>
                                <Card.Subtitle className="text-muted">{is_student_or_teacher ? ("Student") : ("Teacher")}</Card.Subtitle>
                            </div>
                            <div className="ms-auto">
                                <span>{gender === 'male' ?
                                    (<Button className="m-2" size="sm" variant='primary' style={{ 'borderColor': 'white' }}>
                                        <GenderMale />
                                    </Button>) :
                                    (<Button className="m-2" size="sm" style={{ 'backgroundColor': 'pink', 'borderColor': 'white' }}>
                                        <GenderFemale />
                                    </Button>)}
                                </span>
                            </div>
                        </div>
                        <Card.Text className="fw-bold text-muted">
                            Class • {user_class}
                        </Card.Text>
                        <div className="mt-auto d-flex align-items-center">
                            <Button variant="outline-dark" onClick={handleShow}><BsThreeDots /></Button>
                        </div>
                    </Card.Body>
                </Card>
            </Col>
            <ProfileModal user={user} handleClose={handleClose} show={show} />
        </>
    );
}

export default SearchedProfileCard;