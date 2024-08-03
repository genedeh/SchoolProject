import { Card, Image, Button, Container, Row, Col, Badge, ListGroup } from 'react-bootstrap';
import { GeoAlt, PersonBadge, Phone } from 'react-bootstrap-icons';
const StudentProfile = ({ user }) => {
    const { first_name, last_name, username, address, phone_number, email, profile_picture, birth_date } = user
    return (
        <Container className="my-4">
            <Row>
                <Col md={8}>
                    <Card className="mb-4">
                        <Card.Header className="bg-gradient">
                            <div className="d-flex align-items-center">
                                <Image
                                    src={profile_picture}
                                    roundedCircle
                                    width="100"
                                    height="100"
                                    className="me-3"
                                />
                                <div>
                                    <Card.Title className="mb-0">{last_name} {first_name}</Card.Title>
                                    <Card.Subtitle className="text-muted"><GeoAlt className="" />{address}</Card.Subtitle>
                                    <div className="d-flex align-items-center mt-2">
                                        @{username}
                                        <Phone className="m-2" /> {phone_number}
                                    </div>
                                </div>
                            </div>
                        </Card.Header>
                        <Card.Body className="d-flex justify-content-between">
                            <Button variant="outline-primary">{email}</Button>
                            <Button variant="outline-secondary">BIRTH DATE: {birth_date}</Button>
                        </Card.Body>
                    </Card>
                    <Card className="mb-4">
                        <Card.Body>
                            <Card.Title>Skills</Card.Title>
                            {/* {skills.map(skill => ( */}
                            <Badge pill bg="primary" className="me-2 mb-2" >
                                skill
                            </Badge>
                            {/* ))} */}
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="mb-4">
                        <Card.Body>
                            <Card.Title>People Associated</Card.Title>
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
        </Container>
    )
}

export default StudentProfile