import { Card, Button, Col, Image, Badge } from 'react-bootstrap';
import { BsThreeDots, BsArrowReturnRight } from "react-icons/bs";
import { useState, useContext } from 'react';
import { UserContext } from '../../../contexts/User.contexts';
import { ProfileModal } from './UserProfileModal.components';


const SearchedProfileCard = ({ user }) => {
    const { username, is_student_or_teacher, profile_picture_url, classes, classrooms, is_superuser } = user;
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
                            <Image
                                src={profile_picture_url}
                                roundedCircle
                                style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                                className="me-3" />
                            <div>
                                <Card.Title className="mb-0">{username.replace('_', ' ')}</Card.Title>
                                <hr />
                                <Card.Subtitle className="text-muted">{is_student_or_teacher ? (
                                    <Badge bg="primary">Student</Badge>
                                ) :
                                    (is_superuser ? <Badge bg="success">Admin</Badge>
                                        : <Badge bg="danger">Teacher</Badge>)}</Card.Subtitle>
                            </div>
                        </div>
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
            <ProfileModal user={user} handleClose={handleClose} show={show} className={className} classroomName={classroomName} />
        </>
    );
}

export default SearchedProfileCard;