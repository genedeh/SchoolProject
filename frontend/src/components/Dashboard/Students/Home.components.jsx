import { Card, Container, Row, Col } from 'react-bootstrap';
import { useUser } from '../../../contexts/User.contexts';
import { Navigate } from 'react-router-dom';
import { Schedule } from "../HomeTools/HomeTools.components";

const StudentHome = () => {
    const { currentUser } = useUser();
    const { username } = currentUser;
    if (currentUser.is_student_or_teacher && currentUser) {
        return (
            <Container fluid className="p-4 container">
                <Row className="mb-4">
                    <Col md={12}>
                        <Card className="p-3 mb-4 container-welcome" bg="primary" text='light' >
                            <Card.Body >
                                <Card.Title>Welcome back, {username.replace('_', ' ')} 👋</Card.Title>
                                <Card.Text>
                                    You've learned 70% of your goal this week! Keep it up and improve your progress.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                        <Row>
                            <Col md={12}>
                                <Schedule />
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        );
    } return (
        <Navigate to='/dashboard/home' />
    )

}

export default StudentHome