import { useLocation, Navigate } from "react-router-dom";
import { Container, Form, Button, Row, Col, Card, Spinner } from "react-bootstrap";
import { useMutation } from "react-query";
import axios from "axios";
import React, { useState } from "react";
import { ErrorAlert } from "../../../Alerts/ErrorAlert.components";
import { SuccessAlert } from "../../../Alerts/SuccessAlert.components";
import { ErrorMessageHandling } from "../../../../utils/ErrorHandler.utils";
import { useUser } from "../../../../contexts/User.contexts";
import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa"; // 🎨 Import Icons
import { ResultComments, ResultGeneralRemarks, ResultSubjectScoresDisplay, ResultUploadButton } from "./ResultHandlerTools.components";

const UpdateStudentResult = () => {
    const { currentUser } = useUser();
    const location = useLocation();

    // Decode result object from query string
    const queryParams = new URLSearchParams(location.search);
    const resultData = queryParams.get("data");

    let initialResult = null;
    try {
        initialResult = resultData ? JSON.parse(decodeURIComponent(resultData)) : null;
    } catch (error) {
        console.error("Error parsing JSON:", error);
        initialResult = null;
    }

    // Form state
    const [formData, setFormData] = useState({
        assigned_student: initialResult?.assigned_student.id || null,
        classroom: initialResult?.classroom.id || null,
        comments: initialResult?.comments || {},
        general_remarks: initialResult?.general_remarks || {},
        scores: initialResult?.scores || {},
        session: initialResult?.session || null,
        term: initialResult?.term || null,
        uploaded: initialResult?.uploaded || false
    });

    // Handle input changes
    const handleInputChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    // Handle nested input changes
    const handleNestedChange = (parentField, key, value) => {
        setFormData((prev) => ({
            ...prev,
            [parentField]: {
                ...prev[parentField],
                [key]: value
            }
        }));
    };

    // PATCH request to update student result
    const { mutate, isLoading, isError, error, isSuccess } = useMutation(
        async (updatedData) => {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("Authentication token is missing!");
            }

            return await axios.patch(
                `/api/update-student-result/${initialResult?.id}/`,
                updatedData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
        }
    );

    // Form submission
    const onSubmit = (e) => {
        e.preventDefault();
        mutate(formData);
    };

    if (!initialResult) {
        return <p className="text-center text-danger">No result data found!</p>;
    }

    if (currentUser && !currentUser.is_student_or_teacher) {
        return (
            <Container className="mt-4">
                <Card className="shadow-lg border-0 p-4">
                    <Card.Body>
                        <h2 className="text-center mb-3">
                            Update Result for {initialResult?.assigned_student?.username}
                        </h2>

                        {/* ✅ Success / Error Alerts */}
                        {isError && <ErrorAlert heading="Update Failed" message={ErrorMessageHandling(isError, error)} >
                            {error.response?.data?.error}
                        </ErrorAlert>}
                        {isSuccess && <SuccessAlert heading="Update Successful" message="Result updated successfully!" />}

                        <Form onSubmit={onSubmit} className="mt-3">
                            {/* ✅ Student Info Section */}
                            <Card className="p-3 mb-4 bg-light">
                                <Row>
                                    <Col><strong>Student:</strong> {initialResult?.assigned_student?.username}</Col>
                                    <Col><strong>Classroom:</strong> {initialResult?.classroom?.name}</Col>
                                    <Col><strong>Session:</strong> {formData?.session}</Col>
                                    <Col><strong>Term:</strong> {formData?.term}</Col>
                                </Row>
                            </Card>

                            {/* ✅ Scores Section */}
                            <h4 className="mt-4 d-flex align-items-center gap-2 text-dark">
                                <FaCheckCircle className="text-success" />
                                Subjects & Scores  TEST (40) / EXAM (60)
                            </h4>
                            <hr />

                            {Object.keys(formData?.scores || {}).map((subject, index) => (
                                <ResultSubjectScoresDisplay subject={{ name: `${initialResult?.classroom?.name}_${subject}`, id: index }} scores={formData?.scores} handleNestedChange={handleNestedChange} />
                            ))}

                            {/* ✅ General Remarks */}
                            <h4 className="mt-4 d-flex align-items-center gap-2 text-dark">
                                <FaExclamationTriangle className="text-warning" />
                                General Remarks
                            </h4>
                            <hr />

                            {Object.keys(formData?.general_remarks || {}).map((remark, index) => (
                                <ResultGeneralRemarks remark={remark} index={index} general_remarks={formData?.general_remarks} handleNestedChange={handleNestedChange} />
                            ))}

                            {/* ✅ Comments Section */}
                            <h4 className="mt-4 text-dark">Comments</h4>
                            <hr />

                            {Object.keys(formData?.comments || {}).map((comment, index) => (
                                <ResultComments comment={comment} index={index} comments={formData?.comments} handleNestedChange={handleNestedChange} />
                            ))}


                            {/* Uploaded Toggle Button */}
                            <ResultUploadButton uploaded={formData?.uploaded} handleInputChange={handleInputChange} />
                            {/* ✅ Submit Button */}
                            <div className="text-center mt-4">
                                <Button type="submit" variant="primary" className="px-4 py-2 fw-semibold shadow-sm custom-btn" disabled={isLoading}>
                                    {isLoading ? <Spinner animation="border" size="sm" className="me-2" /> : "Update Result"}
                                </Button>
                            </div>

                        </Form>
                    </Card.Body>
                </Card>
            </Container>
        );
    } else {
        return <Navigate to="/dashboard/home" />;
    }
};

export default UpdateStudentResult;
