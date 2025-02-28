import { useState } from "react";
import { Button, Spinner, Row, Col, Form, Card, Container, ListGroup, Table, Image, ProgressBar, Badge } from "react-bootstrap";
import { EyeFill, PlusCircleFill } from "react-bootstrap-icons";
import { FaStar, FaCheckCircle, FaUpload } from "react-icons/fa";

export const ResultViewHandlerButton = ({ queryKeys, refetch, setSelectedStudent, selectedStudent, id, loading }) => {
    return (
        <Button
            size="sm"
            variant="outline-dark"
            onClick={() => {
                setSelectedStudent({ ...queryKeys });
                // Show loading spinner before fetching
                refetch();
            }}
            disabled={loading.isFetchingResult && loading.isLoadingResult && selectedStudent?.studentId === id}
        >
            {loading.isFetchingResult && selectedStudent?.studentId === id ? (
                <Spinner animation="border" size="sm" />
            ) : (
                <>
                    <EyeFill className="me-1" /> View Result
                </>
            )}
        </Button>
    );
}

export const ResultCreationHandlerButton = ({ studentName, classroomID }) => {
    return (
        <>
            < Button
                size="sm"
                variant="outline-success"
                onClick={() => {
                    const url = `/dashboard/create-student-result/?student_name=${studentName}&classroom_id=${classroomID}`;
                    window.open(url, "_blank"); // Open in new tab
                }}
                className="me-2"
            > <PlusCircleFill className="me-1" /> Add Result</Button >
        </>
    );
}


const StarRating = ({ value, onChange }) => {
    const [rating, setRating] = useState(value || 0);

    const handleClick = (index) => {
        const newRating = index + 1 === rating ? 0 : index + 1;
        setRating(newRating);
        onChange(newRating);
    };

    return (
        <div>
            {[...Array(5)].map((_, index) => (
                <FaStar
                    key={index}
                    size={24}
                    color={index < rating ? "#ffc107" : "#e4e5e9"}
                    onClick={() => handleClick(index)}
                    style={{ cursor: "pointer", marginRight: 5 }}
                />
            ))}
        </div>
    );
};

export const ResultSubjectScoresDisplay = ({ subject, handleNestedChange, scores }) => {
    const { id, name } = subject;
    return (
        <Row key={id} className="mb-3 p-3 rounded border bg-light shadow-sm">
            <Col md={4} className="d-flex align-items-center">
                <Form.Label className="fw-semibold">{name.split("_")[1]}</Form.Label>
            </Col>
            <Col md={4}>
                <Form.Control
                    type="number"
                    className="border-primary shadow-sm"
                    value={scores[name.split("_")[1]]?.test || ""}
                    min={0}
                    max={40}
                    required
                    onChange={(e) =>
                        handleNestedChange("scores", name.split("_")[1], {
                            ...scores[name.split("_")[1]],
                            test: parseInt(e.target.value) || 0,
                        })
                    }
                    placeholder="Test (Max 40)"
                />
            </Col>
            <Col md={4}>
                <Form.Control
                    type="number"
                    className="border-primary shadow-sm"
                    value={scores[name.split("_")[1]]?.exam || ""}
                    min={0}
                    max={60}
                    required
                    onChange={(e) =>
                        handleNestedChange("scores", name.split("_")[1], {
                            ...scores[name.split("_")[1]],
                            exam: parseInt(e.target.value) || 0,
                        })
                    }
                    placeholder="Exam (Max 60)"
                />
            </Col>
        </Row>
    );
};


export const ResultGeneralRemarks = ({ remark, index, general_remarks, handleNestedChange }) => {
    return (
        <Row key={index} className="mb-3 p-3 rounded border bg-light shadow-sm">
            <Col md={12} className=" align-items-center">
                <Row className="p-3 rounded border bg-light shadow-sm align-items-center">
                    <Col xs={6} className="d-flex align-items-center">
                        <span className="fw-semibold text-secondary">
                            {remark.charAt(0).toUpperCase() + remark.slice(1)}
                        </span>
                    </Col>
                    <Col md={6} >
                        <StarRating
                            value={general_remarks[remark] || 0}
                            onChange={(value) => handleNestedChange("general_remarks", remark, value)}
                        />
                    </Col>
                </Row>
            </Col>
        </Row>
    )
};

export const ResultComments = ({ comment, comments, index, handleNestedChange }) => {
    if (comment === "Next_Term_Begins_ON") {
        return (
            <Row key={index} className="mb-3 p-3 rounded border bg-light shadow-sm">
                <Col md={4} className="d-flex align-items-center">
                    <Form.Label className="fw-semibold text-secondary">
                        {comment.replace("_", " ")}
                    </Form.Label>
                </Col>
                <Col md={6}>
                    <Form.Control
                        type="date"
                        className="border-primary shadow-sm p-3 rounded"
                        required
                        value={comments[comment] || ""}
                        onChange={(e) => handleNestedChange("comments", comment, e.target.value)}
                        placeholder={`Enter ${comment.replace("_", " ")}`}
                    />
                </Col>
            </Row>
        )
    }
    return (
        <Row key={index} className="mb-3 p-3 rounded border bg-light shadow-sm">
            <Col md={4} className="d-flex align-items-center">
                <Form.Label className="fw-semibold text-secondary">
                    {comment.charAt().toUpperCase() + comment.slice(1)}
                </Form.Label>
            </Col>
            <Col md={6}>
                <Form.Group controlId="comments">
                    <Form.Label className="fw-semibold">Comments</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        className="border-primary shadow-sm p-3 rounded"
                        required
                        value={comments[comment] || ""}
                        onChange={(e) => handleNestedChange("comments", comment, e.target.value)}
                        placeholder={`Enter ${comment.replace("_", " ")}`}
                    />
                </Form.Group>
            </Col>
        </Row>
    )
};


export const ResultUploadButton = ({ uploaded, handleInputChange }) => {
    const [isHovered, setIsHovered] = useState(false);
    return (
        <div className="text-center mt-4">
            <Button
                variant={uploaded ? "success" : "primary"}
                onClick={() => handleInputChange("uploaded", !uploaded)}
                className="px-5 py-3 fw-bold shadow-lg rounded-pill d-flex align-items-center gap-2"
                size="lg"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                    transform: isHovered ? "scale(1.05)" : "scale(1)",
                    transition: "transform 0.2s ease-in-out",
                }}
            >
                {uploaded ? (
                    <>
                        <FaCheckCircle className="text-white" /> Uploaded
                    </>
                ) : (
                    <>
                        <FaUpload className="text-white" /> Upload Result
                    </>
                )}
            </Button>
        </div>
    );
};

export const ClassroomPerformance = ({ performanceData }) => {
    return (
        <Container className="mt-5">
            <Row className="mb-4">
                {/* Student Performance Table */}
                <Col md={8}>
                    <Card className="shadow-sm rounded-3 border-0">
                        <Card.Header className="bg-dark text-white text-center">
                            <h4>📊 Student Performance</h4>
                        </Card.Header>
                        <Card.Body className="p-4">
                            <Table striped bordered hover responsive className="text-center align-middle">
                                <thead className="table-secondary">
                                    <tr>
                                        <th>#</th>
                                        <th>Profile</th>
                                        <th>Student Name</th>
                                        <th>Overall %</th>
                                        <th>Position</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {performanceData.students_performance.map((student, index) => (
                                        <tr key={student.student_id}>
                                            <td>{index + 1}</td>
                                            <td>
                                                <Image src={student.profile_picture_url} roundedCircle width={45} height={45} className="shadow-sm" />
                                            </td>
                                            <td className="fw-bold">{student.username}</td>
                                            <td className="text-primary fw-semibold">{student.overall_percentage.toFixed(2)}%</td>
                                            <td className="fw-bold"><Badge>{student.position}</Badge></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Best Per Subject */}
                <Col md={4}>
                    <Card className="shadow-sm rounded-3 border-0">
                        <Card.Header className="bg-primary text-white text-center">
                            <h4>🏆 Best Per Subject</h4>
                        </Card.Header>
                        <Card.Body className="p-3">
                            <ListGroup variant="flush">
                                {Object.entries(performanceData.best_per_subject).map(([subject, { student, score }]) => (
                                    <ListGroup.Item key={subject} className="d-flex justify-content-between">
                                        <span className="fw-bold">{subject}:</span>
                                        <span className="text-success">{student} ({score})</span>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};
