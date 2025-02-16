import React from "react";
import { Modal, Button, Image, Table } from "react-bootstrap";
import { FaDownload } from "react-icons/fa";

export const ResultModal = ({ show, handleClose, result }) => {
    console.log(result)
    if (!result) return null;

    const { assigned_student, session, term, created_at, updated_at, scores, general_remarks, comments, classroom } = result[0];

    // Function to calculate total and grade
    const calculateGrade = (total) => {
        if (total >= 75) return "A1";
        if (total >= 70) return "B2";
        if (total >= 65) return "B3";
        if (total >= 60) return "C4";
        if (total >= 55) return "C5";
        if (total >= 50) return "C6";
        if (total >= 45) return "D7";
        if (total >= 40) return "E8";
        return "F9";
    };

    return (
        <Modal show={show} onHide={handleClose} fullscreen scrollable>
            <Modal.Header closeButton>
                <Modal.Title>Student Result</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {/* Student Info Section */}
                <div className="d-flex align-items-center mb-4">
                    <Image
                        src={assigned_student["profile_picture"]}
                        alt="Student Profile"
                        roundedCircle
                        width={80}
                        height={80}
                        className="me-3"
                    />
                    <div>
                        <h4>{assigned_student["username"]}</h4>
                        <p><strong>Session:</strong> {session}</p>
                        <p><strong>Term:</strong> {term}</p>
                        <p><strong>Class:</strong> {classroom["name"]}</p>
                        <p><strong>Created At:</strong> {new Date(created_at).toLocaleString()}</p>
                        <p><strong>Updated At:</strong> {new Date(updated_at).toLocaleString()}</p>
                    </div>
                </div>

                {/* Scores Table */}
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Subject</th>
                            <th>Test</th>
                            <th>Exam</th>
                            <th>Total</th>
                            <th>Grade</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(scores).map(([subject, { test, exam }]) => {
                            const total = test + exam;
                            return (
                                <tr key={subject}>
                                    <td>{subject}</td>
                                    <td>{test}</td>
                                    <td>{exam}</td>
                                    <td>{total}</td>
                                    <td>{calculateGrade(total)}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>

                {/* General Remarks */}
                <div className="mt-4">
                    <h5>General Remarks</h5>
                    {Object.entries(general_remarks).map(([remark, grade]) => (
                        <p key={remark}><strong>{remark}:</strong> {grade}</p>
                    ))}
                </div>

                {/* Comments */}
                <div className="mt-4">
                    <h5>Comments</h5>
                    {Object.entries(comments).map(([comment_type, comment]) => (
                        <p key={comment_type}><strong>{comment_type}:</strong> {comment}</p>
                    ))}
                </div>
            </Modal.Body>

            <Modal.Footer className="justify-content-between">
                <h6 className="text-muted">Ogunboyejo Adeola Memorial School</h6>
                <Button variant="success">
                    <FaDownload className="me-2" /> Save as Document
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
