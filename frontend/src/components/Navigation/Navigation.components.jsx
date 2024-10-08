import { useContext, useState } from "react";
import { Outlet } from "react-router-dom";
import { UserContext } from "../../contexts/User.contexts";
import { Container, Row, Col, Alert, Button, Image, Spinner } from 'react-bootstrap';
import TopLevel from "./TopLevel.components";
import { StudentSidebar, TeacherSidebar } from "./Side_Navigation_Bar/SideBar.components";
import { UsersListContext } from "../../contexts/UsersList.contexts";
import SearchedProfileCard from "../Dashboard/SearchedProfileCard.components";
import { SignDeadEnd } from 'react-bootstrap-icons';
import { ErrorModal } from "../ErrorHandling/ErrorModal.components";


const Navigation = () => {
    const { currentUser, error } = useContext(UserContext);
    const [searchTerm, setSearchTerm] = useState('');
    const {
        usersList,
        currentPage,
        totalUsers,
        nextPage,
        prevPage,
        goToNextPage,
        goToPrevPage, setCurrentPage, setTerm
    } = useContext(UsersListContext);
    const [show, setShow] = useState(true);
    const handleClose = () => setShow(false);

    const SearchHandler = (e) => {
        setSearchTerm(e.target.value);
        setTerm(e.target.value);
        setCurrentPage(1);
    }
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
                                        <Row className='m-2'>
                                            {usersList.map((user) => (
                                                <SearchedProfileCard key={user.id} user={user} />
                                            ))}
                                            <div className="d-flex justify-content-between align-items-center my-4">
                                                <Button onClick={goToPrevPage} disabled={!prevPage}>
                                                    Previous
                                                </Button>
                                                <span>Page {currentPage}</span>
                                                <Button onClick={goToNextPage} disabled={!nextPage}>
                                                    Next
                                                </Button>
                                            </div>

                                            <p>Total Users: {totalUsers}</p>
                                        </Row>
                                    )
                                    :
                                    (<Row className='m-3'>
                                        <Col md={6}>
                                            <Image
                                                src="https://via.placeholder.com/400x300.png?text=404+Not+Found"
                                                alt="404 Not Found"
                                                fluid
                                                className="mb-4"
                                            />
                                            <h2>Oops! No Results Found</h2>
                                            <p className="text-muted">
                                                We couldn't find any results matching your search.
                                            </p>
                                        </Col>
                                    </Row>)}
                            </Container>
                        </Col>
                    </Row>
                </Container >
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