import StudentSidebar from '../../Side_Navigation_Bar/StudentSideBar.components';
import { Container, Row, Col, Card, ListGroup, Stack, Form, Image } from 'react-bootstrap'
const StudentDashboard = ({ user }) => {
    return (
        <>
            <Container fluid>

                <Row>
                    <Col md={2} className="bg-light">
                        <StudentSidebar />
                    </Col>
                    <Col md={10}>
                        <Stack direction="horizontal" gap={1} className='container-input'>
                            <Form.Control className="me-auto" placeholder="Add your item here..." />
                            <Row>
                                <Col xs={6} md={4}><Image src="holder.js" roundedCircle fluid /></Col>
                                <Col xs={6} md={10}>@{user.username}</Col>
                            </Row>
                        </Stack>
                        <Container fluid className="p-4 container">
                            <Row className="mb-4">
                                <Col md={8}>
                                    <Card className="p-3 mb-4 container-welcome" bg="primary" text='light' >
                                        <Card.Body >
                                            <Card.Title>Welcome back, James 👋</Card.Title>
                                            <Card.Text>
                                                You've learned 70% of your goal this week! Keep it up and improve your progress.
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                    <Row>
                                        <Col md={4}>
                                            <Card className="mb-4 container">
                                                <Card.Body>
                                                    <Card.Title>Attendance</Card.Title>
                                                    <Card.Text>19/20</Card.Text>
                                                    <Card.Text>Well done! You're attending all lessons. Keep going!</Card.Text>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                        <Col md={4}>
                                            <Card className="mb-4 container">
                                                <Card.Body>
                                                    <Card.Title>Homework</Card.Title>
                                                    <Card.Text>53/56</Card.Text>
                                                    <Card.Text>Don't forget about your next homework.</Card.Text>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                        <Col md={4}>
                                            <Card className="mb-4 container">
                                                <Card.Body>
                                                    <Card.Title>Rating</Card.Title>
                                                    <Card.Text>89/100</Card.Text>
                                                    <Card.Link href="#">Go to report</Card.Link>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    </Row>
                                </Col>
                                <Col md={4}>
                                    <Card className="mb-4 container">
                                        <Card.Body>
                                            <Card.Title>Homework Progress</Card.Title>
                                            <ListGroup variant="flush">
                                                <ListGroup.Item>Rational inequalities - 30 Mar, 2024</ListGroup.Item>
                                                <ListGroup.Item>All about Homestas - 29 Mar, 2024</ListGroup.Item>
                                                <ListGroup.Item>Shapes and Structures - 03 Apr, 2024</ListGroup.Item>
                                            </ListGroup>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </Container>
                    </Col>
                </Row>
            </Container>

        </>
    )
}

export default StudentDashboard;