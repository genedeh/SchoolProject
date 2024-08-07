import { useContext } from 'react';
import { Card, Image, Button, Container, Row, Col, Badge, ListGroup } from 'react-bootstrap';
import { GenderFemale, GenderMale, GeoAlt, Telephone } from 'react-bootstrap-icons';
import { UserContext } from '../../../contexts/User.contexts';
const StudentProfile = () => {
    const { currentUser } = useContext(UserContext)
    const { first_name, last_name, username, address, phone_number, email, profile_picture, birth_date, gender, user_class } = currentUser;
    
    return (
        <>
            <Container className="my-4">
                <Row>
                    <Col md={8}>
                        <Card className="mb-4">
                            <Card.Header className="bg-gradient">
                                <div className="d-flex align-items-center">
                                    {profile_picture === null ? (<Image
                                        src={profile_picture}
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
                                <Button variant="outline-success">{user_class}</Button>
                            </Card.Body>
                        </Card>
                        <Card className="mb-4">
                            <Card.Body>
                                <Card.Title>Offering Subjects</Card.Title>
                                {/* {skills.map(skill => ( */}
                                <Badge pill bg="primary" className="me-2 mb-2" >
                                    Subject
                                </Badge>
                                {/* ))} */}
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="mb-4">
                            <Card.Body>
                                <Card.Title>Class Mates</Card.Title>
                                <ListGroup variant="flush">
                                    {/* {people.map(person => ( */}
                                    <ListGroup.Item >
                                        <div className="d-flex align-items-center">
                                            <Image
                                                src="/path/to/profile-image.jpg"
                                                roundedCircle
                                                width="40"
                                                height="40"
                                                className="me-3"
                                            />
                                            <div>
                                                <div className="fw-bold">person.name</div>
                                                <div className="text-muted">person.title at person.company</div>
                                            </div>
                                        </div>
                                    </ListGroup.Item>
                                    {/* ))} */}
                                </ListGroup>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container >
        </>
    )
}

export default StudentProfile