import { Modal, Button, ListGroup, Spinner } from "react-bootstrap";
import { ClockHistory, XCircle, CheckCircle, Calendar3 } from "react-bootstrap-icons";
import CenteredSpinner from "../../../../Loading/CenteredSpinner.components";
import { ResultTermModal } from "../../ResultsTools/ResultTermsModal.components";
import { ErrorAlert } from "../../../../Alerts/ErrorAlert.components";
import { ErrorMessageHandling } from "../../../../../utils/ErrorHandler.utils";
import axios from "axios";
import { useQuery } from "react-query";
import { useEffect, useState } from "react";
import { ResultCreationHandlerButton } from "../../ResultsTools/ResultHandlerTools.components";

const fetchStudentResults = async ({ queryKey }) => {
    const [, session, studentId] = queryKey;
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Authentication token is missing!");

    const response = await axios.get(
        `/api/get-student-result/?student_id=${studentId}&session=${session}`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
};

export const ResultSessionModal = ({ show, handleClose, result, student, isLoading }) => {
    const [selectedSession, setSelectedSession] = useState(null);
    const [selectedResult, setSelectedResult] = useState(null);
    const [showOverlay, setShowOverlay] = useState(false);

    useEffect(() => {
        if (show) {
            setSelectedSession(null);
            setSelectedResult(null);
            setShowOverlay(false);
        }
    }, [show]);

    const { data: studentResultData, isFetching: isFetchingResult, isError, error, refetch } = useQuery(
        ["selected-student-result", selectedSession, student?.id],
        fetchStudentResults,
        {
            enabled: !!selectedSession,
            retry: 3,
            refetchOnWindowFocus: false,
            onSuccess: (data) => {
                setSelectedResult(data);
                setShowOverlay(true);
                setSelectedSession(null);
            },
        }
    );

    const handleSessionClick = (session) => {
        setSelectedSession(session);
        if (selectedSession) {
            refetch();
        }
        setSelectedResult(null);
        setShowOverlay(false);
    };

    return (
        <Modal show={show} onHide={handleClose} centered fullscreen scrollable>
            <Modal.Header closeButton>
                <Modal.Title>
                    <ClockHistory className="me-2 text-primary" /> Result Sessions
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ResultCreationHandlerButton studentId={student?.id} admin={true} studentName={student?.username} />
                {isError && <ErrorAlert heading="Error Fetching Results" message={ErrorMessageHandling(isError, error)} />}

                {isFetchingResult && <CenteredSpinner caption="Loading Student Results..." />}
                {isLoading && <CenteredSpinner caption="Loading Sessions..." />}


                {!isFetchingResult && !isLoading && result?.available_sessions?.length > 0 ? (
                    <ListGroup className="mt-3">
                        {result?.available_sessions?.map((session) => (
                            <ListGroup.Item
                                key={session}
                                className={`d-flex justify-content-between align-items-center ${selectedResult?.session === session ? "border border-primary shadow-sm" : ""}`}
                            >
                                <div>
                                    <Calendar3 className="me-2 text-secondary" />
                                    <strong>{session}</strong>
                                </div>
                                <Button
                                    variant={selectedResult?.session === session ? "primary" : "outline-primary"}
                                    onClick={() => handleSessionClick(session)}
                                    disabled={selectedSession === session && isFetchingResult}
                                >
                                    {selectedSession === session && isFetchingResult ? (
                                        <>
                                            <Spinner as="span" animation="border" size="sm" role="status" />
                                            {" Loading..."}
                                        </>
                                    ) : (
                                        "View Result"
                                    )}
                                </Button>
                            </ListGroup.Item>

                        ))}
                    </ListGroup>
                ) : (
                    !isLoading && (
                        <div className="text-center mt-3 text-muted">
                            <XCircle className="me-2" /> No available sessions.
                        </div>
                    )
                )}

                <ResultTermModal showOverlay={showOverlay} setShowOverlay={setShowOverlay} studentResult={selectedResult} />
            </Modal.Body>
            <Modal.Footer className="d-flex justify-content-between">
                <small className="text-muted">
                    © {new Date().getFullYear()} Ogunboyejo Adeola Memorial School. All rights reserved.
                </small>
                <Button variant="secondary" onClick={handleClose}>
                    <XCircle className="me-2" /> Close
                </Button>
                {selectedResult && (
                    <Button variant="success" onClick={() => setShowOverlay(true)}>
                        <CheckCircle className="me-2" /> View Full Result
                    </Button>
                )}
            </Modal.Footer>
        </Modal>
    );
};
