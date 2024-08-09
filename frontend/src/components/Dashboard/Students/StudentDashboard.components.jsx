import { useLocation } from 'react-router-dom';
import StudentSidebar from '../../Side_Navigation_Bar/SideBar.components';
import StudentHome from './Home.components';
import StudentProfile from './Profile.components';
import TopLevel from '../TopLevel.components';
import { useContext, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap'
import SearchedProfileCard from '../SearchedProfileCard.components';
import { UserContext } from '../../../contexts/User.contexts';
import { UsersListContext } from '../../../contexts/UsersList.contexts';
import { SignDeadEnd } from 'react-bootstrap-icons';


const StudentDashboard = () => {
    const location = useLocation();
    const [searchTerm, setSearchTerm] = useState('');
    const { currentUser } = useContext(UserContext);
    const { usersList } = useContext(UsersListContext);

    const SearchHandler = (e) => {
        setSearchTerm(e.target.value);
    }


    const filteredUsers = usersList.filter(({ username }) => {
        if (searchTerm.length !== 0 || searchTerm === null) {
            if (username !== currentUser.username) {
                return username.toLowerCase().includes(searchTerm.replace(' ', '_').toLowerCase())
            }
        }
    }
    );
    if (searchTerm.length !== 0 || searchTerm === null) {
        return (
            <Container fluid>
                <Row>
                    <Col md={2} className="bg-light">
                        <StudentSidebar />
                    </Col>
                    <Col md={10}>
                        <TopLevel searchHandler={SearchHandler} term={searchTerm} />
                        <Container fluid>
                            {filteredUsers.length === 0 ?
                                (<div style={{ 'margin': '5rem' }}><h1><SignDeadEnd color='red' size={96} /> 404 NO USER OF USERNAME "{searchTerm}" EXISTS</h1></div>)
                                : (<Row className='m-3'>
                                    {filteredUsers.map((user) => (
                                        <SearchedProfileCard key={user.id} user={user} />
                                    ))}
                                </Row>
                                )}
                        </Container>
                    </Col>
                </Row>
            </Container>
        );
    } else if (location.hash === '#home') {
        return (
            <Container fluid>
                <Row>
                    <Col md={2} className="bg-light">
                        <StudentSidebar />
                    </Col>
                    <Col md={10}>
                        <TopLevel searchHandler={SearchHandler} term={searchTerm} />
                        <StudentHome />
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
                        <TopLevel searchHandler={SearchHandler} term={searchTerm} />
                        <StudentProfile />
                    </Col>
                </Row>
            </Container>
        );
    }
};

export default StudentDashboard;