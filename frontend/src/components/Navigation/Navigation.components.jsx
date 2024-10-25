import { useContext, useState } from "react";
import { Outlet } from "react-router-dom";
import { UserContext } from "../../contexts/User.contexts";
import { Container, Row, Col, Alert, Button, Spinner } from 'react-bootstrap';
import TopLevel from "./TopLevel.components";
import { StudentSidebar, TeacherSidebar } from "./Side_Navigation_Bar/SideBar.components";
import { UsersListContext } from "../../contexts/UsersList.contexts";
import SearchedProfileCard from "../Dashboard/SearchedProfileCard.components";
import { ErrorAlert } from "../Alerts/ErrorAlert.components";
import { WarningAlert } from "../Alerts/WarningAlert.components";


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

    const SearchHandler = (e) => {
        setSearchTerm(e.target.value);
        setTerm(e.target.value.replace(/ /g, ""));
        setCurrentPage(1);
    }
    if (error === "No token found") {
        return (
            <WarningAlert heading="Missing Permission" message="Endevour to login before you can access this page." >
                <Alert.Link href='/' className='me-3'>GO TO LOGIN PAGE</Alert.Link>
            </WarningAlert>
        );
    } else if (error) {
        return (
            <ErrorAlert heading="Failed Request" message="Failed to fetch user data." >
                <Alert.Link href='/' className='me-3'>GO TO LOGIN PAGE</Alert.Link>
            </ErrorAlert>
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
                                    (
                                        <ErrorAlert
                                            message={`We couldn't find any results matching user " ${searchTerm} ".`}
                                            heading={"Oops! No Results Found"}
                                        />
                                    )}
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