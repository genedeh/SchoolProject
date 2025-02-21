import { useUser } from "../../../../contexts/User.contexts";
import { useState } from "react";
import { useQuery } from "react-query";
import { Navigate } from "react-router-dom";
import { Button, Card, ListGroup, Spinner, Modal } from "react-bootstrap";
import { PersonFillAdd, GenderMale, GenderFemale, EyeFill, XCircleFill } from "react-bootstrap-icons";
import { ErrorAlert } from "../../../Alerts/ErrorAlert.components";
import { ErrorMessageHandling } from "../../../../utils/ErrorHandler.utils";
import { CenteredSpinner } from "../../../Loading/CenteredSpinner.components"
import axios from "axios";
import { ResultModal } from "../../ResultModal.components";

const fetchStudentResults = async (studentId, classroomId) => {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("Authentication token is missing!");
    }
    const { data } = await axios.get(
        `/api/get-student-result/?student_id=${studentId}&classroom_id=${classroomId}`,
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
    return data;
};

const fetchClassrooms = async ({ queryKey }) => {
    const [, classroomName] = queryKey;

    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("Authentication token is missing!");
    }

    const response = await axios.get(
        `/api/classrooms/?name=${classroomName}`,
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
    return response.data.results;
};


export const AssignedClassrooms = () => {
    const { currentUser } = useUser();
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showOverlay, setShowOverlay] = useState(false);
    const [showResultModal, setShowResultModal] = useState(false);
    const [selectedTerm, setSelectedTerm] = useState(null);


    // Using React Query for data fetching
    const { data, error, isError, isLoading } = useQuery(
        ["assigned_classrooms", currentUser.user_class], // Query key
        fetchClassrooms,
        {
            enabled: !!currentUser.user_class,
            keepPreviousData: true,
            refetchOnWindowFocus: true,
            retry: 3,
            staleTime: 1000 * 60 * 5,
            cacheTime: 1000 * 60 * 10,
        }
    );

    const { data: studentResult, isLoading: isLoadingResult, isFetching: isFetchingResult, isError: isResultError, error: resultError, refetch } =
        useQuery(["studentResult", selectedStudent],
            () => fetchStudentResults(selectedStudent?.studentId, selectedStudent?.classroomId),
            { enabled: !!selectedStudent, onSuccess: () => setShowOverlay(true) }
        );


    if (!currentUser.is_student_or_teacher && currentUser && !currentUser.is_admin) {
        return (
            <div className="container">
                <center>
                    <hr />
                    <h3 className="text-primary fw-bold">📚 Assigned Classrooms</h3>
                    <hr />
                </center>

                {isLoading && <CenteredSpinner caption="Fetching Assigned Classrooms..." />}
                {isError && (
                    <ErrorAlert
                        heading="Error while fetching assigned classrooms"
                        message={ErrorMessageHandling(isError, error)}
                        removable
                    />
                )}

                {!isLoading && !isError && data.length === 0 && (
                    <p className="text-center text-muted">No Assigned Classrooms found!</p>
                )}

                {!isLoading && !isError && data.length > 0 && (
                    <>
                        {/* Add User Button */}
                        <div className="d-flex justify-content-end mb-4">
                            <Button size="lg" variant="primary" href="/dashboard/add-user">
                                <PersonFillAdd className="me-2" /> Add User
                            </Button>
                        </div>

                        <div>
                            {data.map(({ name, students }) => (
                                <div key={name} className="mb-4">
                                    <Card className="shadow-lg border-0 rounded">
                                        {/* Classroom Header with Gradient */}
                                        <div
                                            className="p-3 text-white fw-bold"
                                            style={{
                                                background: "linear-gradient(to right, #007bff, #00c6ff)",
                                                borderTopLeftRadius: "8px",
                                                borderTopRightRadius: "8px"
                                            }}
                                        >
                                            <h5 className="mb-0">{name.replace("_", " ")}</h5>
                                        </div>

                                        <Card.Body className="bg-white">
                                            <h6 className="fw-bold text-secondary mb-3">👩‍🎓 Students</h6>

                                            <ListGroup variant="flush">
                                                {students.length !== 0 ? (
                                                    students.map(({ id, username, profile_picture_url }) => (
                                                        <ListGroup.Item
                                                            key={id}
                                                            className="d-flex align-items-center justify-content-between border-0"
                                                            style={{ background: "#f8f9fa", borderRadius: "8px", marginBottom: "5px", padding: "10px" }}
                                                        >
                                                            <div className="d-flex align-items-center">
                                                                {/* Student Image */}
                                                                <img
                                                                    src={profile_picture_url || "https://via.placeholder.com/40"}
                                                                    className="rounded-circle border"
                                                                    style={{ width: "40px", height: "40px" }}
                                                                    alt="Profile"
                                                                />
                                                                <div className="ms-3">
                                                                    <div className="fw-semibold">{username.replace("_", " ")}</div>
                                                                </div>
                                                            </div>

                                                            {/* Gender & View Button */}
                                                            <div className="d-flex align-items-center">
                                                                {/* View Student Button */}
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline-dark"
                                                                    onClick={() => {
                                                                        const ClassroomId = data[0].id;
                                                                        setSelectedStudent({ studentId: id, classroomId: ClassroomId });
                                                                        // Show loading spinner before fetching
                                                                        refetch();
                                                                    }}
                                                                    disabled={isFetchingResult && isLoadingResult && selectedStudent?.studentId === id}
                                                                >
                                                                    {isFetchingResult && selectedStudent?.studentId === id ? (
                                                                        <Spinner animation="border" size="sm" />
                                                                    ) : (
                                                                        <>
                                                                            <EyeFill className="me-1" /> View Result
                                                                        </>
                                                                    )}
                                                                </Button>
                                                            </div>
                                                        </ListGroup.Item>
                                                    ))
                                                ) : (
                                                    <p className="text-muted">No Students Available</p>
                                                )}
                                            </ListGroup>
                                        </Card.Body>
                                    </Card>
                                </div>
                            ))}
                            {/* Show error if fetching student results fails */}
                            {isResultError && (
                                <div className="mt-3">
                                    <ErrorAlert
                                        heading="Error fetching student results"
                                        message={ErrorMessageHandling(isResultError, resultError)}
                                        removable
                                    />
                                </div>
                            )}

                            {/* Show fetched student result (for now, just logging it) */}
                            {studentResult && (
                                <div className="mt-4 text-center">
                                    <h5 className="text-success">Result Loaded Successfully ✅</h5>
                                    {/* <pre className="text-muted">{JSON.stringify(studentResult, null, 2)}</pre> */}
                                </div>
                            )}

                            <Modal
                                show={showOverlay}
                                onHide={() => setShowOverlay(false)}
                                centered
                                backdrop="static"
                                keyboard={false}
                                className="fade"
                            >
                                {/* Modal Background Blur Effect */}
                                <div className="modal-backdrop-blur"></div>

                                <Modal.Header className="bg-secondary text-white" closeButton>
                                    <Modal.Title>📜 Available Terms</Modal.Title>
                                </Modal.Header>

                                <Modal.Body>
                                    <ListGroup variant="flush">
                                        {studentResult?.terms &&
                                            Object.entries(studentResult.terms).map(([termName, termArray]) => {
                                                const term = termArray[0]; // Get first term object
                                                if (!term.uploaded) return null; // Hide if not uploaded

                                                return (
                                                    <ListGroup.Item key={termName} className="border-0 text-center">
                                                        <Button variant="dark" className="w-100 fw-bold" onClick={() => {
                                                            setSelectedTerm(termArray)
                                                            setShowResultModal(true)
                                                        }}>
                                                            {termName}
                                                        </Button>
                                                    </ListGroup.Item>
                                                );
                                            })}
                                    </ListGroup>
                                </Modal.Body>
                            </Modal>
                        </div>
                        <ResultModal show={showResultModal} handleClose={() => setShowResultModal(false)} result={selectedTerm} />
                    </>
                )}
            </div>
        )
    } return (
        <Navigate to='/dashboard/home' />
    );
}