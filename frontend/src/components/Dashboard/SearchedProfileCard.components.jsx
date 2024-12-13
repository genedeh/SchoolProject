import { Card, Button, Col, Image, Modal, Row, Badge } from 'react-bootstrap';
import { GenderFemale, GenderMale } from 'react-bootstrap-icons';
import { BsThreeDots, BsArrowLeft, BsArrowReturnRight } from "react-icons/bs";
import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../contexts/User.contexts';

const ProfileModal = ({ user, show, handleClose }) => {
    const { username, is_student_or_teacher, gender, profile_picture, classes, classrooms, birth_date, subjects, subject, phone_number, email, address, id } = user;
    const current_date = new Date();
    let className = "None"
    let classroomName = "None"
    useEffect(() => {
        if (classes.length !== 0) {
            const dummy = classes[0]
            className = dummy.name
        }
        if (classrooms) {
            classroomName = classrooms.name
        }
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
                {profile_picture ? (<Image
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
                <p className='fw-bold text-muted'>{is_student_or_teacher ? (`Class • ${className}`) : (`Assigned Class • ${classroomName}`)}</p>
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
                        <Card.Title>{is_student_or_teacher ? ("Offering Subjects") : ('Teaching Subjects')}</Card.Title>
                        {subjects.length !== 0 ? (
                            subjects.map(({ name, id }) => (
                                <Badge pill bg="primary" key={id} className="me-2 mb-2" >
                                    {name.replace(`'`, '').replace(`'`, '')}
                                </Badge>
                            ))) : (
                            subject.map(({ name, id }) => (
                                <Badge pill bg="primary" key={id} className="me-2 mb-2" >
                                    {name.replace(`'`, '').replace(`'`, '')}
                                </Badge>
                            ))
                        )}
                    </Card.Body>
                </Card>
                <hr />
            </Modal.Body>
        </Modal>
    );
}



const SearchedProfileCard = ({ user }) => {
    const { username, is_student_or_teacher, gender, profile_picture, classes, classrooms } = user;
    const [show, setShow] = useState(false);
    const { currentUser } = useContext(UserContext);
    let className = "None"
    let classroomName = "None"
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    if (classes.length !== 0) {
        const dummy = classes[0]
        className = dummy.name
    }
    if (classrooms) {
        classroomName = classrooms.name
    }

    return (
        <>
            <Col md={4} className="mb-4">
                <Card className="h-100 container" >
                    <Card.Body className="d-flex flex-column align-items-start" >
                        <div className="d-flex align-items-center mb-3">
                            {profile_picture ? (<Image
                                src={profile_picture.includes('http://') ? (profile_picture) : (`http://127.0.0.1:8000/media/${profile_picture}`)}
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
                            {is_student_or_teacher ? (`Class • ${className}`) : (`Assigned Class • ${classroomName}`)}
                        </Card.Text>
                        <div className="mt-auto d-flex align-items-center">
                            <Button variant="outline-dark" className='me-4' onClick={handleShow}><BsThreeDots /></Button>
                            {!currentUser.is_student_or_teacher ?
                                (
                                    currentUser.user_class === className || currentUser.is_admin ? (<Button variant="outline-primary" ><BsArrowReturnRight /></Button>) : ('')
                                )
                                : ('')}
                        </div>
                    </Card.Body>
                </Card>
            </Col>
            <ProfileModal user={user} handleClose={handleClose} show={show} />
        </>
    );
}

export default SearchedProfileCard;