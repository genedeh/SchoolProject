import { Card, Container, Row, Col } from 'react-bootstrap';
import { useUser } from '../../../contexts/User.contexts';
import { QuoteCarousel, FunFactCarousel, FlipClock } from '../HomeTools/HomeCards.components';
import { Navigate } from 'react-router-dom';
import { Schedule } from '../HomeTools/HomeTools.components';

const TeacherHome = () => {
    const { currentUser } = useUser();
    const { username } = currentUser;
    if (!currentUser.is_student_or_teacher && currentUser) {
        return (

            <Container fluid className="dashboard">
                <Row className="mb-4">
                    <Col md={12}>
                        <Card className="p-3 mb-4 mt-3 custom-btn" bg="" text='light' >
                            <Card.Body >
                                <Card.Title>Welcome back, {username.replace('_', ' ')} 👋</Card.Title>
                                <hr />
                                <Card.Text>
                                    <strong>This is your dashboard. Here you can find all the information you need to manage your classes and students.</strong>
                                    <br />
                                    <strong>Have a great day!</strong>
                                </Card.Text>
                            </Card.Body>

                        </Card>
                        <FlipClock />

                        <hr />
                        <Schedule/>
                        <hr />
                        <h2 className='text-center'>Inspirational Quotes</h2>
                        <hr />
                        <QuoteCarousel />

                        <hr />
                        <h2 className='text-center'>Fun Facts</h2>
                        <hr />
                        <FunFactCarousel />
                    </Col>

                </Row>
            </Container>
        );
    } return (
        <Navigate to='/dashboard/home' />
    );
    ;
}

export default TeacherHome;