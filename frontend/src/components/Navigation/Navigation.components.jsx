import { useContext, useState } from "react";
import { Outlet } from "react-router-dom";
import { UserContext } from "../../contexts/User.contexts";
import { Container, Row, Col, Button } from 'react-bootstrap';
import TopLevel from "./TopLevel.components";
import { StudentSidebar, TeacherSidebar } from "./Side_Navigation_Bar/SideBar.components";
import { useUsers } from "../../contexts/UsersList.contexts";
import SearchedProfileCard from "../Dashboard/UsersProfileCards/SearchedProfileCard.components";
import { ErrorAlert } from "../Alerts/ErrorAlert.components";
import { WarningAlert } from "../Alerts/WarningAlert.components";
import { ErrorMessageHandling } from "../../utils/ErrorHandler.utils";
import { LoadingOverlay } from "../Loading/LoadingOverlay.components";
import { CenteredSpinner } from "../Loading/CenteredSpinner.components";


const MainContent = ({ searchTerm, users, totalUsers, currentPage, prevPage, nextPage, goToPrevPage, goToNextPage, loading, usersError, usersIsError }) => {
    console.log(users);
    if (searchTerm.length === 0) {
        return <Outlet />;
    }

    return (
        <Container fluid>
            <Row className='m-2'>
                {loading && <CenteredSpinner caption="Fetching Users..." />}
                {usersIsError && <ErrorAlert heading="Error while fetching users" message={ErrorMessageHandling(usersIsError, usersError)} removable={true} />}
                {!loading && !usersIsError && users.length === 0 && (
                    <p>No users found!</p>
                )}
                {!loading && !usersIsError && users.length > 0 && (
                    users.map((user) => (<SearchedProfileCard key={user.id} user={user} />))
                )}
                
                <div className="d-flex justify-content-between align-items-center my-4">
                    <Button onClick={goToPrevPage} disabled={!prevPage || loading}>
                        Previous
                    </Button>
                    <span>Page {currentPage}</span>
                    <Button onClick={goToNextPage} disabled={!nextPage || loading}>
                        Next
                    </Button>
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

const ContentWrapper = ({ currentUser, searchTerm, users, totalUsers, currentPage, prevPage, nextPage, goToPrevPage, goToNextPage, loading, SearchHandler, usersError, usersIsError }) => (
    <Container fluid>
        <Row>
            <Sidebar currentUser={currentUser} />
            <Col md={10}>
                <TopLevel searchHandler={SearchHandler} term={searchTerm} />
                <MainContent
                    searchTerm={searchTerm}
                    users={users}
                    totalUsers={totalUsers}
                    currentPage={currentPage}
                    prevPage={prevPage}
                    nextPage={nextPage}
                    goToPrevPage={goToPrevPage}
                    goToNextPage={goToNextPage}
                    loading={loading}
                    usersIsError={usersIsError}
                    usersError={usersError}
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
        <ErrorAlert heading="User Data Fetch Error" message="We encountered an issue while retrieving your user information. Please try again shortly." removable={true}>
            <a href='/' className='me-3'>GO TO LOGIN PAGE</a>
        </ErrorAlert>
    );
};

const Navigation = () => {
    const { currentUser, error } = useContext(UserContext);
    const [searchTerm, setSearchTerm] = useState('');
    const {
        users,
        currentPage,
        nextPage,
        prevPage,
        loading,
        usersError,
        usersIsError,
        goToNextPage,
        goToPrevPage,
        setTerm,
        totalUsers,
        handleSearch,
    } = useUsers();

    const SearchHandler = (v) => {
        setSearchTerm(v);
        setTerm(v);
        // handleSearch();
    }

    if (!currentUser) {
        return error ? <ErrorDisplay error={error} /> : <LoadingOverlay loading={true} message="Fetching Necessary Information..." />;
    }

    return (
        <ContentWrapper
            currentUser={currentUser}
            searchTerm={searchTerm}
            users={users}
            totalUsers={totalUsers}
            currentPage={currentPage}
            prevPage={prevPage}
            nextPage={nextPage}
            goToPrevPage={goToPrevPage}
            goToNextPage={goToNextPage}
            loading={loading}
            usersError={usersError}
            usersIsError={usersIsError}
            SearchHandler={SearchHandler}
        />
    );
}

export default Navigation;