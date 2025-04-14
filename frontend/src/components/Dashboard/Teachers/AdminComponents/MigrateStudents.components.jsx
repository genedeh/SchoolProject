import { useState } from "react";
import { Button, Form, Card, Container, Row, Col, Spinner } from "react-bootstrap";
import { useUser } from "../../../../contexts/User.contexts";
import { useMigrateStudents } from "../../../../utils/MigrateStudents.utils";
import { Navigate } from "react-router-dom";
import { SuccessAlert } from "../../../Alerts/SuccessAlert.components";
import { WarningAlert } from "../../../Alerts/WarningAlert.components";
import { ErrorAlert } from "../../../Alerts/ErrorAlert.components";
import CenteredSpinner from "../../../Loading/CenteredSpinner.components";

const MigrateStudents = () => {
    const [session, setSession] = useState("");
    const migrateStudents = useMigrateStudents();
    const { currentUser } = useUser();

    const handleMigrate = (e) => {
        e.preventDefault();
        migrateStudents.mutate(session);
    };

    // Redirect if user is not an admin
    if (!currentUser.is_student_or_teacher && currentUser && currentUser.is_superuser) {
        return (
            <Container>
                <h4 className="mt-4">Migrate Students</h4>
                <Form onSubmit={handleMigrate} className="mb-4">
                    <Form.Group>
                        <Form.Label>Select Session</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter Session (e.g. 2025)"
                            value={session}
                            required
                            onChange={(e) => setSession(e.target.value)}
                            autoFocus
                            autoComplete="off"
                        />
                    </Form.Group>
                    <Button type="submit" disabled={migrateStudents.isLoading} className="mt-3 custom-btn">
                        {migrateStudents.isLoading ? <Spinner animation="border" size="sm" /> : "Migrate"}
                    </Button>
                </Form>

                {migrateStudents.isLoading && <CenteredSpinner caption="Loading..." />}

                {/* Show migration results */}
                {migrateStudents.isSuccess && (
                    <div>
                        <h5 className="mt-4">Migration Results</h5>

                        {/* Success Message */}
                        {migrateStudents.data?.failed_students == 0 &&
                            <SuccessAlert heading="Students migration Success" message={`Successfully migrated ${migrateStudents.data.migrated} students for session ${migrateStudents.data.session}.`} />
                        }
                        {migrateStudents.data?.failed_students.length > 0 &&
                            <WarningAlert heading="Students migration Warning" message={` Successfully migrated ${migrateStudents.data.migrated} and ${migrateStudents.data.failed_students.length} failed students for session ${migrateStudents.data.session}.`} />
                        }
                        {/* Failed Students */}
                        {migrateStudents.data.failed_students.length > 0 && (
                            <>
                                <h6>Failed Students</h6>
                                <Row>
                                    {migrateStudents.data.failed_students.map((student, index) => (
                                        <Col md={4} key={index} className="mb-3">
                                            <Card bg="danger" text="white" className="custom-btn5">
                                                <Card.Body className="d-flex align-items-center">
                                                    {/* Profile Picture */}
                                                    <img
                                                        src={student.profile_picture_url || "/default-profile.png"}
                                                        alt={student.username}
                                                        className="rounded-circle me-3"
                                                        style={{ width: "50px", height: "50px", objectFit: "cover" }}
                                                    />

                                                    <div>
                                                        <Card.Title>{student.username?.replace("_", " ")}</Card.Title>
                                                        <Card.Text>
                                                            <strong>Class:</strong> {student.classes?.[0] || "N/A"} <br />
                                                            <strong>Issue:</strong> {student.issue} <br />
                                                            {student.failed_subject && (
                                                                <>
                                                                    <strong>Subject:</strong> {student.failed_subject}
                                                                </>
                                                            )}
                                                        </Card.Text>
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>
                            </>
                        )}

                        {migrateStudents.data.failed_transfers.length > 0 && (
                            <>
                                <h6>Failed Transfers</h6>
                                <Row>
                                    {migrateStudents.data.failed_transfers.map((subject, index) => (
                                        <Col md={4} key={index} className="mb-3">
                                            <Card bg="danger" text="white" className="custom-btn5 shadow-lg">
                                                <Card.Body className="d-flex align-items-center">

                                                    <div>
                                                        <Card.Title>{subject.student?.replace("_", " ")}</Card.Title>
                                                        <Card.Text>
                                                            <strong>Classroom:</strong> {subject.classroom || "N/A"} <br />
                                                            <strong>Failed Subject:</strong> {subject.failed_subject|| "N/A"} <br />
                                                            <strong>Issue:</strong> {subject.reason} <br />
                                                        </Card.Text>
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>
                            </>
                        )}


                    </div>
                )}

                {/* Error Handling */}
                {migrateStudents.isError && (
                    <ErrorAlert heading="Students migration Error" message={migrateStudents.error.message || "Something went wrong!"} />
                )}
            </Container>
        );
    }

    return <Navigate to="/dashboard/home" />;
};

export default MigrateStudents;
