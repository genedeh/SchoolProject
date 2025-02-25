import { useLocation } from "react-router-dom";
import { useState } from "react";
import { useQuery, useMutation } from "react-query";
import { Form, Button, Spinner, Col, Row, Card } from "react-bootstrap";
import { FaCheckCircle, FaCheckDouble, FaStickyNote } from "react-icons/fa";
import CenteredSpinner from "../../../Loading/CenteredSpinner.components";
import { ErrorAlert } from "../../../Alerts/ErrorAlert.components";
import { SuccessAlert } from "../../../Alerts/SuccessAlert.components";
import { ErrorMessageHandling } from "../../../../utils/ErrorHandler.utils";
import axios from "axios";

export const CreateStudentResult = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const studentName = queryParams.get("student_name");
    const classroomId = queryParams.get("classroom_id");
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("Authentication token is missing!");
    }

    const { data: student, isLoading: studentLoading, error: studentError } = useQuery({
        queryKey: ["student", studentName],
        queryFn: async () => {
            const response = await axios.get(`/api/users/?username=${studentName}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data.results[0];
        },
        enabled: !!studentName,
    });

    const { data: classroom, isLoading: classroomLoading, error: classroomError } = useQuery({
        queryKey: ["classroom", classroomId],
        queryFn: async () => {
            const response = await axios.get(`/api/classrooms/${classroomId}/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;

        },
        enabled: !!classroomId,
    });

    const [formData, setFormData] = useState({
        session: "",
        term: "",
        uploaded: false,
        assigned_student: student?.id,
        classroom: classroom?.id,
        scores: {},
        general_remarks: {
            sports: 2,
            gymnastics: 2,
            handling_of_tools: 2,
            creativity: 2,
            musical_skill: 2,
            dancing_skill: 2,
            drawing_and_painting: 2,
            communication: 2,
            affective: 0,
            self_control: 2,
            reliability: 2,
            neatness: 2,
            politness: 2,
            honesty: 2,
            interpersonal: 2,
            relationship: 2,
            punctuality: 2,
            team_spirit: 2,
            regularity: 2,
            leadership_traits: 2,
        },
        comments: {
            Admission_No: "",
            Times_School_Opened: "",
            Times_Present: "",
            No_In_Class: classroom?.students.length || "",
            Next_Term_Begins_ON: "",
            Class_Teachers_Comments: "",
            Principals_Comments: "",
        },
    });

    const termOptions = ["1st Term", "2nd Term", "3rd Term"];


    // Handle nested input changes
    const handleNestedChange = (parentField, key, value) => {
        setFormData((prev) => ({
            ...prev,
            [parentField]: {
                ...prev[parentField],
                [key]: value
            }
        }));
        console.log(formData)
    };

    const handleInputChange = (field, value) => {
        console.log(field, value)
        setFormData((prev) => ({
            ...prev,
            [field]: value
        }));
    };
    // Form submission
    const onSubmit = (e) => {
        e.preventDefault();
        createResult();
    };

    const { mutate: createResult, isLoading: posting, error: postError, isSuccess } = useMutation({
        mutationFn: async () => {
            const response = await axios.post("/api/create-student-result/", formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        },
    });

    if (studentLoading || classroomLoading) return <CenteredSpinner caption="Loading..." />;
    if (studentError) return <ErrorAlert heading="Error while fetching Student Information" message={ErrorMessageHandling(studentError, studentError)} />;
    if (classroomError) return <ErrorAlert heading="Error while fetching Classroom Information" message={ErrorMessageHandling(classroomError, classroomError)} />;

    return (
        <div className="shadow-lg border-0 p-4 mt-4">
            <h2 className="text-center mb-3">
                Create Result for {student?.username}
            </h2>
            {isSuccess && <SuccessAlert heading="Creation Successful" message="Result Created successfully!" />}

            <Form onSubmit={onSubmit} className="mt-3">
                {/* ✅ Student Info Section */}
                <Card className="p-3 mb-4 bg-light">
                    <Row>
                        <Col><strong>Student:</strong> {student?.username}</Col>
                        <Col><strong>Classroom:</strong> {classroom?.name}</Col>
                        <Form.Group controlId="term">
                            <Form.Label><strong>Term:</strong></Form.Label>
                            <Form.Select
                                name="term"
                                size="md"
                                required
                                value={formData.term || ""}
                                onChange={(e) => setFormData((prev) => ({ ...prev, term: e.target.value }))}
                            >
                                <option value="" disabled>Select Term</option>
                                {termOptions.map((term, index) => (
                                    <option key={index} value={term}>
                                        {term}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group controlId="session">
                            <Form.Label><strong>Session:</strong></Form.Label>
                            <Form.Control
                                name="session"
                                type="text"
                                size="md"
                                required
                                placeholder={`e.g. ${new Date().getFullYear()}/${new Date().getFullYear() + 1}`}
                                value={formData.session || ""}
                                onChange={(e) => setFormData((prev) => ({ ...prev, session: e.target.value }))}
                            />
                        </Form.Group>
                    </Row>
                </Card>



                {/* ✅ Scores Section */}
                <h4 className="mt-4 d-flex align-items-center gap-2 text-dark">
                    <FaCheckCircle className="text-success" />
                    Subjects & Scores  TEST (40) / EXAM (60)
                </h4>
                <hr />

                {student?.subjects.map((subject) => (
                    <Row key={subject.id} className="mb-3 p-3 rounded border bg-light shadow-sm">
                        <Col md={4} className="d-flex align-items-center">
                            <Form.Label className="fw-semibold">{subject.name.split("_")[1]}</Form.Label>
                        </Col>
                        <Col md={4}>
                            <Form.Control
                                type="number"
                                className="border-secondary"
                                value={formData.scores[subject.name.split("_")[1]]?.test || ""}
                                min={0}
                                max={40}
                                required
                                onChange={(e) =>
                                    handleNestedChange("scores", subject.name.split("_")[1], {
                                        ...formData.scores[subject.name.split("_")[1]],
                                        test: parseInt(e.target.value) || 0,
                                    })
                                }
                                placeholder="Test (Max 40)"
                            />
                        </Col>
                        <Col md={4}>
                            <Form.Control
                                type="number"
                                className="border-secondary"
                                value={formData.scores[subject.name.split("_")[1]]?.exam || ""}
                                min={0}
                                max={60}
                                required
                                onChange={(e) =>
                                    handleNestedChange("scores", subject.name.split("_")[1], {
                                        ...formData.scores[subject.name.split("_")[1]],
                                        exam: parseInt(e.target.value) || 0,
                                    })
                                }
                                placeholder="Exam (Max 60)"
                            />
                        </Col>
                    </Row>
                ))}

                {/* ✅ General Remarks */}
                <h4 className="mt-4 d-flex align-items-center gap-2 text-dark">
                    <FaCheckDouble className="text-primary" />
                    General Remarks
                </h4>
                <hr />

                {Object.keys(formData?.general_remarks || {}).map((remark, index) => (
                    <Row key={index} className="mb-3 p-3 rounded border bg-light shadow-sm">
                        <Col md={6} className="d-flex align-items-center">
                            <Form.Label className="fw-semibold text-secondary">
                                {remark.charAt(0).toUpperCase() + remark.slice(1)}
                            </Form.Label>
                        </Col>
                        <Col md={6}>
                            <Form.Control
                                type="number"
                                className="border-secondary"
                                value={formData.general_remarks[remark] || ""}
                                min={0}
                                max={5}
                                required
                                onChange={(e) =>
                                    handleNestedChange("general_remarks", remark, parseInt(e.target.value) || 0)
                                }
                                placeholder="Rating (Max 5)"
                            />
                        </Col>
                    </Row>
                ))}

                {/* ✅ Comments Section */}
                <h4 className="mt-4 d-flex align-items-center gap-2 text-dark">
                    <FaStickyNote className="text-info" />
                    Comments
                </h4>
                <hr />

                {Object.keys(formData?.comments || {}).map((comment, index) => {
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
                                        className="border-secondary"
                                        required
                                        value={formData.comments[comment] || ""}
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
                                <Form.Control
                                    as="textarea"
                                    rows={2}
                                    className="border-secondary"
                                    required
                                    value={formData.comments[comment] || ""}
                                    onChange={(e) => handleNestedChange("comments", comment, e.target.value)}
                                    placeholder={`Enter ${comment.replace("_", " ")}`}
                                />
                            </Col>
                        </Row>
                    )
                })}


                {/* Uploaded Toggle Button */}
                <div className="text-center mt-4">
                    <Button
                        variant={formData.uploaded ? "success" : "outline-secondary"}
                        onClick={() => handleInputChange("uploaded", !formData.uploaded)}
                        className="px-4 py-2 fw-semibold shadow-sm"
                    >
                        {formData.uploaded ? (
                            <>
                                <FaCheckCircle className="me-2" /> Uploaded
                            </>
                        ) : (
                            "Upload Result"
                        )}
                    </Button>
                </div>

                {/* ✅ Submit Button */}
                <div className="text-center mt-4">
                    <Button type="submit" variant="primary" className="px-4 py-2 fw-semibold shadow-sm" disabled={posting}>
                        {posting ? <Spinner animation="border" size="sm" className="me-2" /> : "Create Result"}
                    </Button>
                </div>
                <hr />
                {postError && <ErrorAlert heading="Error while Posting Result" message={ErrorMessageHandling(postError, postError)} >
                    {postError.response?.data?.error}
                </ErrorAlert>}

            </Form>
        </div>
    );
};
