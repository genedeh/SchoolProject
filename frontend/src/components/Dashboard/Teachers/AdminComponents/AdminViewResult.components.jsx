import { useUser } from "../../../../contexts/User.contexts";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { useQuery } from "react-query";
import { useState } from "react";
import { Form, Button, InputGroup, Pagination, Alert } from "react-bootstrap";
import { Search } from "react-bootstrap-icons";
import CenteredSpinner from "../../../Loading/CenteredSpinner.components";
import { ErrorAlert } from "../../../Alerts/ErrorAlert.components";
import { ErrorMessageHandling } from "../../../../utils/ErrorHandler.utils";
import { UserCardItemComponent } from "./SelectPopUps/UserCardItem.components";
import { ResultSessionModal } from "./ResultPopUps/ResultSessionModal.components";

const fetchStudents = async (page, query) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Authentication token is missing!");

    const response = await axios.get(
        `/api/quick_users_view/?S=&page=${page}&username=${query.replace(/ /g, "")}`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
};

const fetchStudentResults = async ({ queryKey }) => {
    const [, id] = queryKey;
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Authentication token is missing!");

    const response = await axios.get(
        `/api/get-student-result/?student_id=${id}&session=`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
};

export const AdminViewResult = () => {
    const { currentUser } = useUser();
    const { is_admin } = currentUser;
    const [searchTerm, setSearchTerm] = useState("");
    const [tempSearchTerm, setTempSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [sessionModalShow, setSessionModalShow] = useState(false);
    const usersPerPage = 2;

    const { data: students, isLoading: studentsLoading, isError: studentsError } =
        useQuery(['students-result', currentPage, searchTerm], () => fetchStudents(currentPage, searchTerm), {
            enabled: !!searchTerm,
            retry: 3,
            keepPreviousData: false,
        });

    const { data: studentResultData, isFetching: studentResultFetching, error: studentResultError } =
        useQuery(["selected-student-result", selectedStudent?.id], fetchStudentResults, {
            enabled: !!selectedStudent?.id,
            keepPreviousData: true,
            refetchOnWindowFocus: false,
            retry: 3,
            staleTime: 1000 * 60 * 5,
            cacheTime: 1000 * 60 * 10,
            onSuccess: () => setSessionModalShow(true),
        });

    // Handle selecting a student
    const handleSelectStudent = (studentId, studentUsername) => {
        setSelectedStudent((prevId) => (prevId === studentId ? null : { id: studentId, username: studentUsername }));
        setSessionModalShow(true);
    };

    if (!is_admin) return <Navigate to='/dashboard/home' />;

    return (
        <div>
            <h1>Admin View Result</h1>

            {/* Search Bar */}
            <InputGroup>
                <Form.Control
                    className="me-auto"
                    placeholder='Search...'
                    value={tempSearchTerm}
                    onChange={(e) => setTempSearchTerm(e.target.value)}
                />
                <Button
                    variant='outline-primary'
                    onClick={() => {
                        setCurrentPage(1);
                        setSearchTerm(tempSearchTerm);
                    }}
                >
                    <Search className='me-2' />
                </Button>
            </InputGroup>

            {/* Loading State */}
            {studentsLoading && <CenteredSpinner caption="Fetching Students..." />}
            {studentsError && <ErrorAlert heading="Error While Fetching Students" message={ErrorMessageHandling(studentsError, studentsError)} />}

            {/* Student List */}
            {/* Student List */}
            {!studentsLoading && !studentsError && students?.results?.length > 0 ? (
                students.results.map((student) => (
                    <UserCardItemComponent
                        key={student.id}
                        user={student}
                        clickHandler={() => handleSelectStudent(student.id, student.username)}
                    />
                ))
            ) : (
                !searchTerm && (
                    <Alert variant="info" className="text-center mt-3">
                        🔍 Start by searching for a student.
                    </Alert>
                )
            )}

            {/* Result Modal */}
            <ResultSessionModal
                show={sessionModalShow}
                handleClose={() => setSessionModalShow(false)}
                student={selectedStudent}
                result={studentResultData}
                isLoading={studentResultFetching}
            />

            {/* Error Handling for Student Results */}
            {studentResultError && (
                <ErrorAlert heading="Error While Fetching Student Results" message={ErrorMessageHandling(studentResultError, studentResultError)} />
            )}

            {/* Pagination */}
            {searchTerm && students?.results?.length > 0 && (
                <Pagination className="justify-content-center">
                    <Pagination.Prev
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    />
                    <Pagination.Item active>{currentPage}</Pagination.Item>
                    <Pagination.Next
                        disabled={currentPage === Math.ceil(students?.count / usersPerPage)}
                        onClick={() => setCurrentPage((prev) => prev + 1)}
                    />
                </Pagination>
            )}

        </div>
    );
};
