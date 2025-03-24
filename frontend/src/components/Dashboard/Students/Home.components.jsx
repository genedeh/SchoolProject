import { Card, Container, Row, Col } from 'react-bootstrap';
import { useUser } from '../../../contexts/User.contexts';
import { QuoteCarousel, FunFactCarousel, FlipClock } from '../HomeTools/HomeCards.components';
import { Navigate } from 'react-router-dom';
import { Schedule } from "../HomeTools/HomeTools.components";

const StudentHome = () => {
    const { currentUser } = useUser();
    const { username } = currentUser;
    if (currentUser.is_student_or_teacher && currentUser) {
        return (

            <Container fluid className="dashboard">
                <Row className="mb-4">
                    <Col md={12}>
                        <Card className="p-3 mb-4 container-welcome" bg="primary" text='light' >
                            <Card.Body >
                                <Card.Title>Welcome back, {username.replace('_', ' ')} 👋</Card.Title>
                            </Card.Body>
                        </Card>
                        <FlipClock />

                        <hr />
                        <Schedule />
                        <hr />
                        <h2 className='text-center'>Inspirational Quotes</h2>
                        <hr />
                        <QuoteCarousel />

                        <hr />
                        <h2 className='text-center'>Fun Facts</h2>
                        <hr />
                        <FunFactCarousel />

                        <hr />

                    </Col>

                </Row>
            </Container>
        );
    } return (
        <Navigate to='/dashboard/home' />
    )

}

export default StudentHome