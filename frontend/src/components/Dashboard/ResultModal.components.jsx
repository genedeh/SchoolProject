import React, { useState } from "react";
import { Modal, Table, Card, Image, Alert, Row, Col, Button, Spinner } from "react-bootstrap";
import { FaUser, FaCalendarAlt, FaBook, FaComments, FaStar, FaChartPie, FaFileDownload } from "react-icons/fa";
import { PieChart, Pie, Tooltip, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
// Colors for different grades
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF4560"];

// Function to calculate grade
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

// Function to render stars
const renderStars = (rating) => {
    const maxStars = 5;
    return (
        <>
            {[...Array(maxStars)].map((_, i) => (
                <FaStar key={i} className={i < rating ? "text-warning" : "text-muted"} />
            ))}
        </>
    );
};


export const ResultModal = ({ show, handleClose, result }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    if (!result) return null;



    const saveAsPDF = async (name, term, session) => {
        setLoading(true);
        setError(null);

        try {
            const element = document.getElementById("result-content");

            // Ensure the whole content is captured dynamically
            const canvas = await html2canvas(element, { scale: 2, useCORS: true });

            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");

            // Calculate height dynamically to fit large content
            const imgWidth = 210; // A4 page width in mm
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            let yPos = 10;
            if (imgHeight > 297) { // If the image is longer than one page
                let position = 0;
                while (position < imgHeight) {
                    pdf.addImage(imgData, "PNG", 0, yPos, imgWidth, imgHeight);
                    position += 297; // Move to the next page
                    if (position < imgHeight) pdf.addPage();
                }
            } else {
                pdf.addImage(imgData, "PNG", 0, 10, imgWidth, imgHeight);
            }

            pdf.save(`${name}_${session}_${term}_result.pdf`);
        } catch (err) {
            console.error("Error generating PDF:", err);
            setError("Failed to generate PDF. Please try again.");
        } finally {
            setLoading(false);
        }
    };


    const { assigned_student, session, term, created_at, updated_at, scores, general_remarks, comments, classroom } = result[0];

    // Process scores
    let totalScore = 0;
    let totalSubjects = Object.keys(scores).length;
    let subjectGrades = [];
    let bestSubject = { name: "", score: 0 };
    let weakestSubject = { name: "", score: 100 };

    Object.entries(scores).forEach(([subject, { test, exam }]) => {
        const total = test + exam;
        totalScore += total;
        if (total > bestSubject.score) bestSubject = { name: subject, score: total };
        if (total < weakestSubject.score) weakestSubject = { name: subject, score: total };
        subjectGrades.push({ subject, grade: total });
    });

    // Calculate overall percentage
    const overallPercentage = totalSubjects > 0 ? (totalScore / (totalSubjects * 100)) * 100 : 0;
    const overallGrade = calculateGrade(overallPercentage);

    return (
        <Modal show={show} onHide={handleClose} fullscreen scrollable>
            <Modal.Header closeButton>
                <Modal.Title>Student Result</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div id="result-content" className="position-relative">
                    {loading && (
                        <div className="loading-overlay">
                            <Spinner animation="border" variant="light" size="lg" />
                            <p className="text-white mt-2">Generating PDF...</p>
                        </div>
                    )}
                    {/* Student Info */}
                    <Card className="mb-4 shadow-lg border-0 rounded-4 p-3" style={{ background: "#f8f9fa" }}>
                        <Card.Body className="d-flex align-items-center">
                            {/* Profile Picture with Border */}
                            <Image
                                src={assigned_student["profile_picture"]}
                                roundedCircle
                                width={100}
                                height={100}
                                className="me-4 border border-3 border-primary shadow-sm"
                            />

                            {/* Student Details */}
                            <div className="flex-grow-1">
                                <h4 className="fw-bold text-dark mb-2">
                                    <FaUser className="me-2 text-primary" />
                                    {assigned_student["username"]}
                                </h4>

                                <div className="d-flex flex-wrap">
                                    <p className="me-4 mb-1 text-muted">
                                        <FaCalendarAlt className="me-2 text-secondary" />
                                        <strong>Session:</strong> <span className="text-dark">{session}</span>
                                    </p>

                                    <p className="me-4 mb-1 text-muted">
                                        <strong>Term:</strong> <span className="text-dark">{term}</span>
                                    </p>

                                    <p className="me-4 mb-1 text-muted">
                                        <strong>Class:</strong> <span className="text-dark">{classroom["name"]}</span>
                                    </p>
                                </div>

                                <p className="mb-1 text-muted">
                                    <strong>Created At:</strong> <span className="text-dark">{new Date(created_at).toLocaleString()}</span>
                                </p>

                                <p className="mb-0 text-muted">
                                    <strong>Updated At:</strong> <span className="text-dark">{new Date(updated_at).toLocaleString()}</span>
                                </p>
                            </div>
                        </Card.Body>
                    </Card>

                    {/* Scores Table */}
                    <Card className="mb-4 shadow-lg border-0 rounded-4">
                        {/* Header with Gradient Background */}
                        <Card.Header
                            className="text-white text-center fw-bold"
                            style={{ background: "linear-gradient(135deg, #1E3A8A, #2563EB)" }}
                        >
                            <FaBook className="me-2" /> Subject Scores
                        </Card.Header>

                        <Card.Body className="p-0">
                            <Table responsive className="mb-0">
                                {/* Table Head */}
                                <thead>
                                    <tr style={{ background: "#1E3A8A", color: "#ffffff", textTransform: "uppercase" }}>
                                        <th className="py-3">Subject</th>
                                        <th className="py-3">Test</th>
                                        <th className="py-3">Exam</th>
                                        <th className="py-3">Total</th>
                                        <th className="py-3">Grade</th>
                                    </tr>
                                </thead>

                                {/* Table Body */}
                                <tbody>
                                    {Object.entries(scores).map(([subject, { test, exam }], index) => {
                                        const total = test + exam;
                                        const grade = calculateGrade(total);

                                        // Determine row color
                                        let rowClass = "bg-light"; // Default
                                        if (total < 40) rowClass = "bg-danger text-white"; // Fail
                                        else if (total >= 75) rowClass = "bg-success text-white"; // Excellent
                                        else if (index % 2 === 0) rowClass = "bg-white"; // Alternating rows

                                        return (
                                            <tr key={subject} className={rowClass}>
                                                <td className="fw-bold">{subject}</td>
                                                <td className="text-center">{test}</td>
                                                <td className="text-center">{exam}</td>
                                                <td className="text-center fw-bold">{total}</td>
                                                <td className="text-center fw-bold" style={{ color: total >= 75 ? "green" : total < 40 ? "red" : "yellow" }}>
                                                    {grade}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>


                    {/* Analytics */}
                    <Card className="mb-4 shadow-lg border-0 rounded-4">
                        {/* Header with Gradient Background */}
                        <Card.Header
                            className="text-white text-center fw-bold"
                            style={{ background: "linear-gradient(135deg, #198754, #28A745)" }}
                        >
                            <FaChartPie className="me-2" /> Performance Analytics
                        </Card.Header>

                        <Card.Body>
                            <Row>
                                {/* Pie Chart (Overall Performance) */}
                                <Col md={6} className="text-center">
                                    <h6 className="fw-bold">Overall Performance</h6>
                                    <ResponsiveContainer width="100%" height={220}>
                                        <PieChart>
                                            <Pie
                                                data={[{ name: "Performance", value: overallPercentage }]}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={50}
                                                outerRadius={80}
                                                fill="#28A745"
                                                dataKey="value"
                                                label={({ value }) => `${value.toFixed(1)}%`}
                                            />
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <p className="mt-2"><strong>Overall Percentage:</strong> {overallPercentage.toFixed(2)}%</p>
                                    <p><strong>Overall Grade:</strong> {overallGrade}</p>
                                </Col>

                                {/* Bar Chart (Subject Grades) */}
                                <Col md={6} className="text-center">
                                    <h6 className="fw-bold">Subject Grades</h6>
                                    <ResponsiveContainer width="100%" height={220}>
                                        <BarChart data={subjectGrades} margin={{ left: 20, right: 20 }}>
                                            <XAxis
                                                dataKey="subject"
                                                angle={-90}
                                                textAnchor="end"
                                                height={80}
                                                interval={0}
                                                tick={{ fontSize: 12 }}
                                            />
                                            <YAxis />
                                            <Tooltip />
                                            <Bar dataKey="grade" fill="#1E88E5" barSize={30} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </Col>
                            </Row>

                            {/* Best & Weakest Subjects */}
                            <h6 className="mt-4 fw-bold">Best & Weakest Subjects</h6>
                            <Alert variant="success">
                                <strong>Best Subject:</strong> {bestSubject.name} ({bestSubject.score} Marks)
                            </Alert>
                            <Alert variant="danger">
                                <strong>Weakest Subject:</strong> {weakestSubject.name} ({weakestSubject.score} Marks)
                            </Alert>
                        </Card.Body>
                    </Card>


                    <Card className="mb-4 shadow-lg border-0 rounded-4">
                        <Card.Header className="bg-warning text-dark">
                            ⭐ General Remarks
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                {Object.entries(general_remarks).map(([remark, rating]) => (
                                    <Col md={6} key={remark} className="mb-2">
                                        <Alert variant="warning">
                                            <strong>{remark.toUpperCase()}:</strong> {rating}  {renderStars(rating)}
                                        </Alert>
                                    </Col>
                                ))}
                            </Row>
                        </Card.Body>
                    </Card>.

                    {/* Comments Section */}
                    <Card className="mb-4 shadow-lg border-0 rounded-4">
                        <Card.Header className="bg-primary text-white">
                            <FaComments className="me-2" /> Comments
                        </Card.Header>
                        <Card.Body>
                            {Object.entries(comments).map(([comment_type, comment]) => (
                                <Alert key={comment_type} variant="primary">
                                    <strong>{comment_type.toLocaleUpperCase()}:</strong> {comment}
                                </Alert>
                            ))}
                        </Card.Body>
                    </Card>
                </div>
            </Modal.Body>

            {/* Footer */}
            <Modal.Footer className="d-flex justify-content-between">
                <small className="text-muted">
                    © {new Date().getFullYear()} Ogunboyejo Adeola Memorial School. All rights reserved.
                </small>
                <Button variant="primary" onClick={() => saveAsPDF(result[0].assigned_student.username, result[0].term, result[0].session)} disabled={loading}>
                    <FaFileDownload className="me-2" /> {loading ? "Generating..." : "Save as PDF"}
                </Button>
            </Modal.Footer>

            {/* Error Alert */}
            {error && <div className="alert alert-danger text-center">{error}</div>}
            {/* Styles for loading overlay */}
            <style jsx>{`
                .loading-overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.7);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    z-index: 10;
                    border-radius: 5px;
                }
            `}</style>
        </Modal>
    );
};
