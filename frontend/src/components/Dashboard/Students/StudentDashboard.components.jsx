import { useLocation } from 'react-router-dom';
import StudentSidebar from '../../Side_Navigation_Bar/StudentSideBar.components';
import StudentHome from './Home.components';
import StudentProfile from './Profile.components';
import StudentTopLevel from './TopLevel.components';
import { useContext, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap'
import SearchedProfileCard from '../SearchedProfileCard.components';
import { UserContext } from '../../../contexts/User.contexts';


const StudentDashboard = ({ usersList }) => {
    const location = useLocation();
    const [searchTerm, setSearchTerm] = useState('')
    const {currentUser} = useContext(UserContext)


    // console.log(current)

    const SearchHandler = (e) => {
        setSearchTerm(e.target.value);
    }


    const filteredUsers = usersList.filter(userProfile => {
        if (searchTerm.length !== 0 || searchTerm === null) {
            if (userProfile.username !== currentUser.username) {
                return userProfile.username.toLowerCase().includes(searchTerm.replace(' ', '_').toLowerCase())
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
                        <StudentTopLevel searchHandler={SearchHandler} term={searchTerm} />
                        <Container fluid>
                            <Row className='m-3'>
                                {filteredUsers.map((user) => (
                                    <SearchedProfileCard key={user.id} user={user} />
                                ))}
                            </Row>
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
                        <StudentTopLevel searchHandler={SearchHandler} term={searchTerm} />
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
                        <StudentTopLevel searchHandler={SearchHandler} term={searchTerm} />
                        <StudentProfile />
                    </Col>
                </Row>
            </Container>
        );
    }
};

export default StudentDashboard;