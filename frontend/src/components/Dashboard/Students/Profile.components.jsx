import { useContext, useEffect, useState } from 'react';
import { Card, Image, Button, Container, Row, Col, Badge, ListGroup } from 'react-bootstrap';
import { GenderFemale, GenderMale, GeoAlt, Telephone } from 'react-bootstrap-icons';
import { UserContext } from '../../../contexts/User.contexts';
import { UsersListContext } from '../../../contexts/UsersList.contexts';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

const ClassMateCard = (({ classMate }) => {
    const { username, profile_picture, gender } = classMate
    return (
        <ListGroup.Item >
            <div className="d-flex align-items-center">
                {profile_picture ? (<Image
                    src={profile_picture.includes('http://') ? (profile_picture) : (`http://127.0.0.1:8000/media/${profile_picture}`)}
                    roundedCircle
                    style={{ width: '35px', height: '35px', objectFit: 'cover' }}
                    className="me-3" />)
                    : (<Image
                        src="http://127.0.0.1:8000/media/default_profile_images/default_image.jpeg"
                        roundedCircle
                        style={{ width: '35px', height: '35px', objectFit: 'cover' }}
                        className="me-3" />)
                }
                <div>
                    <div className="fw-bold">{username.replace('_', ' ')}</div>
                    <div className="d-flex align-items-center mt-2">
                        {gender === 'male' ?
                            (<Button className="me-2" size="sm" variant='primary' style={{ 'borderColor': 'white' }}>
                                <GenderMale />
                            </Button>) :
                            (<Button className="me-2" size="sm" style={{ 'backgroundColor': 'pink', 'borderColor': 'white' }}>
                                <GenderFemale />
                            </Button>)}
                    </div>
                </div>
            </div>
            <hr />
        </ListGroup.Item>
    )
})
const StudentProfile = () => {
    const { currentUser } = useContext(UserContext);
    const { usersList } = useContext(UsersListContext);
    const [offeringSubjects, setOfferingSubjects] = useState([]);
    const { id, first_name, last_name, username, address, phone_number, email, profile_picture, birth_date, gender, user_class } = currentUser;

    useEffect(() => {
        const fetchOfferingSubjects = async () => {
            if (currentUser) {
                try {
                    const respone = await axios.post("http://127.0.0.1:8000/api/offering-subjects/", { "students_offering": id })
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
    if (currentUser.is_student_or_teacher && currentUser) {
        return (
            <>
                <Container className="m-2">
                    <Row>
                        <Col md={8}>
                            <Card className="m-2">
                                <Card.Header className="bg-gradient">
                                    <div className="d-flex align-items-center">
                                        {profile_picture ? (<Image
                                            src={profile_picture.includes('http://') ? (profile_picture) : (`http://127.0.0.1:8000/media/${profile_picture}`)}
                                            roundedCircle
                                            width="100"
                                            height="100"
                                            className="me-3 "
                                            style={{ 'objectFit': 'cover' }}
                                        />) : (<Image
                                            src="http://127.0.0.1:8000/media/default_profile_images/default_image.jpeg"
                                            roundedCircle
                                            width="100"
                                            height="100"
                                            className="me-3 "
                                            style={{ 'objectFit': 'cover' }}
                                        />)}
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
                                    {offeringSubjects.map(subject => (
                                        <Badge pill bg="primary" className="me-2 mb-2" key={subject.replace(`'`, '').replace(`'`, '')} >
                                            {subject.replace(`'`, '').replace(`'`, '')}
                                        </Badge>
                                    ))}
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card className="m-2">
                                <Card.Body >
                                    <Card.Title>Class Mates</Card.Title>
                                    <ListGroup variant="flush">
                                        {usersList.map(potentialClassMate => {
                                            if (potentialClassMate.username !== username) {
                                                if (potentialClassMate.user_class === user_class) {
                                                    if (potentialClassMate.is_student_or_teacher) {
                                                        return (
                                                            <ClassMateCard classMate={potentialClassMate} key={potentialClassMate.id} />
                                                        )
                                                    }
                                                }
                                            }
                                        })}
                                    </ListGroup>
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