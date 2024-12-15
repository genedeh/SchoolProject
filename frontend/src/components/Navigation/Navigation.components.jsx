import { useContext, useState } from "react";
import { Outlet } from "react-router-dom";
import { UserContext } from "../../contexts/User.contexts";
import { Container, Row, Col, Button, Spinner } from 'react-bootstrap';
import TopLevel from "./TopLevel.components";
import { StudentSidebar, TeacherSidebar } from "./Side_Navigation_Bar/SideBar.components";
import { UsersListContext } from "../../contexts/UsersList.contexts";
import SearchedProfileCard from "../Dashboard/SearchedProfileCard.components";
import { ErrorAlert } from "../Alerts/ErrorAlert.components";
import { WarningAlert } from "../Alerts/WarningAlert.components";
import { LoadingOverlay } from "../Loading/LoadingOverlay.components";

const MainContent = ({ searchTerm, usersList, totalUsers, currentPage, prevPage, nextPage, goToPrevPage, goToNextPage, loading }) => {
    if (searchTerm.length === 0) {
        return <Outlet />;
    }

    return (
        <Container fluid>
            <Row className='m-2'>
                {loading ? (<LoadingOverlay loading={loading}/>)
                    : (
                        usersList.length !== 0 ? ((
                            usersList.map((user) => (
                                <SearchedProfileCard key={user.id} user={user} />
                            ))
                        )) : (
                            <ErrorAlert
                                message={`We couldn't find any results matching user "${searchTerm}".`}
                                heading="Oops! No Results Found"
                            />
                        )

                    )}
                <div className="d-flex justify-content-between align-items-center my-4">
                    <Button onClick={goToPrevPage} disabled={!prevPage}>Previous</Button>
                    <span>Page {currentPage}</span>
                    <Button onClick={goToNextPage} disabled={!nextPage}>Next</Button>
                </div>
                <p>Total Users: {totalUsers}</p>
            </Row>
        </Container>
    );
};

const Sidebar = ({ currentUser }) => (
    <Col md={2} className="bg-light">
        {currentUser.is_student_or_teacher ? <StudentSidebar /> : <TeacherSidebar />}
    </Col>
);

const ContentWrapper = ({ currentUser, searchTerm, usersList, totalUsers, currentPage, prevPage, nextPage, goToPrevPage, goToNextPage, loading, SearchHandler }) => (
    <Container fluid>
        <Row>
            <Sidebar currentUser={currentUser} />
            <Col md={10}>
                <TopLevel searchHandler={SearchHandler} term={searchTerm} />
                <MainContent
                    searchTerm={searchTerm}
                    usersList={usersList}
                    totalUsers={totalUsers}
                    currentPage={currentPage}
                    prevPage={prevPage}
                    nextPage={nextPage}
                    goToPrevPage={goToPrevPage}
                    goToNextPage={goToNextPage}
                    loading={loading}
                />
            </Col>
        </Row>
    </Container>
);

const ErrorDisplay = ({ error }) => {
    if (error === "No token found") {
        return (
            <WarningAlert heading="Missing Permission" message="Please log in to access this page.">
                <a href='/' className='me-3'>GO TO LOGIN PAGE</a>
            </WarningAlert>
        );
    }

    return (
        <ErrorAlert heading="User Data Fetch Error" message="We encountered an issue while retrieving your user information. Please try again shortly.">
            <a href='/' className='me-3'>GO TO LOGIN PAGE</a>
        </ErrorAlert>
    );
};

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
        goToPrevPage, setCurrentPage, setTerm, loading
    } = useContext(UsersListContext);

    const SearchHandler = (e) => {
        setSearchTerm(e.target.value);
        setTerm(e.target.value.replace(/ /g, ""));
        setCurrentPage(1);
    }

    if (!currentUser) {
        return error ? <ErrorDisplay error={error} /> : <LoadingOverlay loading={true} message="Fetching Necessary Information..." />;
    }

    return (
        <ContentWrapper
            currentUser={currentUser}
            searchTerm={searchTerm}
            usersList={usersList}
            totalUsers={totalUsers}
            currentPage={currentPage}
            prevPage={prevPage}
            nextPage={nextPage}
            goToPrevPage={goToPrevPage}
            goToNextPage={goToNextPage}
            loading={loading}
            SearchHandler={SearchHandler}
        />
    );
}

export default Navigation;