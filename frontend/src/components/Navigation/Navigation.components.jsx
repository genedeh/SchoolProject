import { useContext, useState} from "react";
import { Outlet } from "react-router-dom";
import { UserContext } from "../../contexts/User.contexts";
import { Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import TopLevel from "./TopLevel.components";
import { StudentSidebar, TeacherSidebar } from "./Side_Navigation_Bar/SideBar.components";
import { UsersListContext } from "../../contexts/UsersList.contexts";
import SearchedProfileCard from "../Dashboard/SearchedProfileCard.components";
import { SignDeadEnd } from 'react-bootstrap-icons';
import { ErrorModal } from "../ErrorHandling/ErrorModal.components";


const Navigation = () => {
    const { currentUser, error } = useContext(UserContext);
    const [searchTerm, setSearchTerm] = useState('');
    const { usersList } = useContext(UsersListContext);
    const [show, setShow] = useState(true);
    const handleClose = () => setShow(false);

    const SearchHandler = (e) => {
        setSearchTerm(e.target.value);
    }
    const filteredUsers = usersList.filter(({ username }) => {
        if (searchTerm.length !== 0 || searchTerm === null) {
            if (username !== currentUser.username) {
                return username.toLowerCase().includes(searchTerm.replace(' ', '_').toLowerCase())
            }
        }
    });

    if (error === "No token found") {
        return (
            <ErrorModal errorMessage={['MISSING PERMISSION', 'PLEASE ENDEVOUR TO LOG IN BEFORE U CAN HAVE ACCESS TO THIS PAGE ']} show={show} handleClose={handleClose} >
                <Alert.Link href='/' className='m-2'>GO TO LOGIN PAGE</Alert.Link>
            </ErrorModal>
        );
    } else if (error) {
        return (
            <ErrorModal errorMessage={['Failed Request', error]} show={show} handleClose={handleClose} >
                <Alert.Link href='/' className='m-2'>GO TO LOGIN PAGE</Alert.Link>
            </ErrorModal>
        );
    }
    if (!currentUser) {
        return (
            <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        );
    }
    if (searchTerm.length !== 0) {
        return (
            <>
                <Container fluid>
                    <Row>
                        <Col md={2} className="bg-light">
                            {currentUser.is_student_or_teacher ? (<StudentSidebar />) : (<TeacherSidebar />)}
                        </Col>
                        <Col md={10}>
                            <TopLevel searchHandler={SearchHandler} term={searchTerm} />
                            <Container fluid>
                                {usersList.length !== 0 ?
                                    (
                                        filteredUsers.length === 0 ?
                                            (<div style={{ 'margin': '5rem' }}><h1><SignDeadEnd color='red' size={96} /> 404 NO USER OF USERNAME "{searchTerm}" EXISTS</h1></div>)
                                            : (<Row className='m-3'>
                                                {filteredUsers.map((user) => (
                                                    <SearchedProfileCard key={user.id} user={user} />
                                                ))}
                                            </Row>
                                            )
                                    )
                                    :
                                    (<Row className='m-3'>
                                        <Spinner animation="border" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </Spinner>
                                    </Row>)}
                            </Container>
                        </Col>
                    </Row>
                </Container>
            </>
        );
    } else {
        return (
            <>
                <Container fluid>
                    <Row>
                        <Col md={2} className="bg-light">
                            {currentUser.is_student_or_teacher ? (<StudentSidebar />) : (<TeacherSidebar />)}
                        </Col>
                        <Col md={10}>
                            <TopLevel searchHandler={SearchHandler} term={searchTerm} />
                            <Outlet />
                        </Col>
                    </Row>
                </Container>
            </>
        );
    }
}

export default Navigation;