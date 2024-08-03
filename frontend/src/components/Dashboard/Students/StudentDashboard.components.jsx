import StudentSidebar from '../../Side_Navigation_Bar/StudentSideBar.components';
import { useNavigate, useLocation } from 'react-router-dom';
import StudentHome from './Home.components';
import StudentProfile from './Profile.components';
import { Container, Row, Col, Stack, Form, Image, Button } from 'react-bootstrap'
const StudentDashboard = ({ user }) => {
    let navigate = useNavigate()
    const location = useLocation();

    const logoutHandler = () => {
        localStorage.removeItem('token');
        return navigate("/")
    }
    if (location.hash === '#home') {
        return (
            <Container fluid>
                <Row>
                    <Col md={2} className="bg-light">
                        <StudentSidebar />
                    </Col>
                    <Col md={10}>
                        <Stack direction="horizontal" gap={1} className='container-input'>
                            <Form.Control className="me-auto" placeholder={`${user.first_name} ${user.last_name}`} disabled />
                            <Image src={user.profile_picture} roundedCircle width="35" height="35" className="me-2" />
                            <div>
                                <div><Button onClick={logoutHandler} size='sm' variant="outline-primary">Logout</Button></div>
                            </div>

                        </Stack>
                        <StudentHome user={user} />
                    </Col>
                </Row>
            </Container>
        );
    } else if (location.hash === '#profile') {
        return (
            <Container fluid>
                <Row>
                    <Col md={2} className="bg-light">
                        <StudentSidebar />
                    </Col>
                    <Col md={10}>
                        <Stack direction="horizontal" gap={1} className='container-input'>
                            <Form.Control className="me-auto" placeholder={`${user.first_name} ${user.last_name}`} disabled />
                            <Image src={user.profile_picture} roundedCircle width="35" height="35" className="me-2" />
                            <div>
                                <div><Button onClick={logoutHandler} size='sm' variant="outline-primary">Logout</Button></div>
                            </div>

                        </Stack>
                        <StudentProfile user={user} />
                    </Col>
                </Row>
            </Container>
        );
    }
};

export default StudentDashboard;