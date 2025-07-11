import React, { useEffect, useState } from "react";
import { useUser } from "../../../../contexts/User.contexts";
import { useMutation } from "react-query";
import { CenteredSpinner } from "../../../Loading/CenteredSpinner.components"
import { ErrorAlert } from "../../../Alerts/ErrorAlert.components"
import { ErrorMessageHandling } from "../../../../utils/ErrorHandler.utils"
import { Modal, Table, Card, Image, Alert, Row, Col, Button } from "react-bootstrap";
import { FaUser, FaCalendarAlt, FaBook, FaComments, FaStar, FaChartPie, FaFileDownload, FaUserGraduate, FaPencilAlt, FaTrashAlt } from "react-icons/fa";
import { PieChart, Pie, Tooltip, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import axios from "axios";
import logo from "../../../../assets/logo512.png";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import NoProfilePicture from "../../../../assets/NoProfilePicture.jpg";

// Grade calculator
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


export const generateResultPDF = async (result, overallPercentage) => {
    const pdf = new jsPDF();

    const student = result.assigned_student;
    const classroom = result.classroom;
    const comments = result.comments;


    // 1. Header: School Info
    if (logo) {
        pdf.addImage(logo, "PNG", 14, 10, 20, 23);
    }
    pdf.setFontSize(16);
    pdf.text("Ogunboyejo Adeola Memorial Schools", 38, 18);
    pdf.setFontSize(10);
    const contactText = "4,6 & 8 Akpofure Street, Off Araromi Road, Adamo, Ikorodu, Lagos.\nTel: 0802 501 9519, 0806 215 6593\nE-mail: ogunboyejoadeolaschools25@gmail.com";

    const lines = contactText.split("\n");
    let startY = 24;
    lines.forEach((line) => {
        pdf.text(line, 38, startY);
        startY += 5; // space between lines
    });
    pdf.line(10, 40, 200, 40); // Line below header

    // 2. Student Details
    pdf.setFontSize(12);
    pdf.text(`Name: ${student.username.replace("_", " ")}`, 14, 44);
    pdf.text(`Class: ${classroom.name}`, 90, 44);
    pdf.text(`Term: ${result.term}`, 14, 50);
    pdf.text(`Session: ${result.session}`, 90, 50);
    pdf.text(`Admission No: ${comments.Admission_No}`, 14, 56);
    pdf.text(`No in Class: ${comments.No_In_Class}`, 90, 56);
    pdf.text(`Next Term: ${comments.Next_Term_Begins_ON}`, 14, 62);
    pdf.text(`Attendance: ${comments.Times_Present}/${comments.Times_School_Opened}`, 90, 62);

    // 3. Scores Table
    const scoresTable = Object.entries(result.scores).map(([subject, data]) => {
        const total = data.test + data.exam;
        const grade = calculateGrade(total);
        return [subject, data.test, data.exam, total, grade];
    });

    autoTable(pdf, {
        startY: 65,
        head: [["Subject", "Test", "Exam", "Total", "Grade"]],
        body: scoresTable,
        styles: { halign: "center" },
        headStyles: { fillColor: [0, 51, 102], textColor: [255, 255, 255] },
    });

    // 4. Comments Table (Left middle)
    let commentY = pdf.lastAutoTable.finalY + 10;
    pdf.setFontSize(12);
    pdf.text("Teacher's Comment:", 14, commentY);
    pdf.setFontSize(10);
    pdf.text(comments.Class_Teachers_Comments || "N/A", 14, commentY + 6);

    commentY += 15;
    pdf.setFontSize(12);
    pdf.text("Principal's Comment:", 14, commentY);
    pdf.setFontSize(10);
    pdf.text(comments.Principals_Comments || "N/A", 14, commentY + 6);

    pdf.setFontSize(16);
    pdf.text("Percentage:", 14, commentY + 14);
    pdf.setFontSize(15);
    pdf.text(Math.floor(overallPercentage) + "%" || "N/A", 14, commentY + 22);

    pdf.setFontSize(16);
    pdf.text("Overall Grade:", 14, commentY + 28);
    pdf.setFontSize(15);
    pdf.text(calculateGrade(Math.floor(overallPercentage)) || "N/A", 14, commentY + 36);


    // 5. General Remarks (Right side - Table style)
    let remarkY = pdf.lastAutoTable.finalY + 10;
    let x = 120;
    pdf.setFontSize(12);
    pdf.text("General Remarks", x, remarkY);
    remarkY += 4;

    // Table headers
    pdf.setDrawColor(0);
    pdf.setFillColor(230, 230, 230); // Light gray header
    pdf.rect(x, remarkY, 70, 7, "F");
    pdf.setFontSize(10);
    pdf.text("Trait", x + 2, remarkY + 5);
    pdf.text("Rating", x + 45, remarkY + 5);
    remarkY += 7;

    // Table rows
    Object.entries(result.general_remarks).forEach(([trait, value]) => {
        const label = trait.replace(/_/g, " ");
        const stars = value + " "

        // Row box
        pdf.setFillColor(255, 255, 255);
        pdf.rect(x, remarkY, 70, 7, "F");

        // Text inside row
        pdf.setTextColor(0);
        pdf.text(label, x + 2, remarkY + 5);
        pdf.text(stars, x + 45, remarkY + 5);
        remarkY += 7;
    });


    // 6. Grade Scale (Table style on far left)
    let gradeX = 14; // Far left
    let gradeY = 250;

    pdf.setFontSize(12);
    pdf.text("Grade Scale", gradeX, gradeY);
    gradeY += 4;

    // Draw header
    pdf.setFillColor(230, 230, 230); // Light gray
    pdf.rect(gradeX, gradeY, 50, 7, "F");
    pdf.setFontSize(10);
    pdf.text("Grade", gradeX + 2, gradeY + 5);
    pdf.text("Range", gradeX + 28, gradeY + 5);
    gradeY += 7;

    // Grade scale rows
    const scale = [
        ["A1", "75 - 100"],
        ["B2", "70 - 74"],
        ["B3", "65 - 69"],
        ["C4", "60 - 64"],
        ["C5", "55 - 59"],
        ["C6", "50 - 54"],
        ["D7", "45 - 49"],
        ["E8", "40 - 44"],
        ["F9", "0 - 39"],
    ];

    scale.forEach(([grade, range]) => {
        // Draw row background
        pdf.setFillColor(255, 255, 255); // White row
        pdf.rect(gradeX, gradeY, 50, 7, "F");

        // Write text
        pdf.text(grade, gradeX + 2, gradeY + 5);
        pdf.text(range, gradeX + 28, gradeY + 5);

        gradeY += 7;
    });


    // Save
    pdf.save(`${student.username}_${result.session}_${result.term}_result.pdf`);
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
    const { currentUser } = useUser();

    const { mutate, isLoading, isError, error: resultDeleteError, isSuccess } = useMutation(
        async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("Authentication token is missing!");
            }
            return await axios.delete(
                `/api/update-student-result/${result[0]?.id}/`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
        }
    );
    useEffect(() => {
        if (isSuccess) {
            alert("Result Deleted Successfully");
            handleClose();
        }
    }, [isSuccess, handleClose]);
    if (!result) return null;
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
        <Modal show={show} onHide={handleClose} fullscreen scrollable >
            <Modal.Header closeButton className="bg-primary text-white">
                <Modal.Title>
                    <FaUserGraduate className="me-2" /> Student Result
                </Modal.Title>
            </Modal.Header>

            <Modal.Body className="bg-light px-3 px-md-5" id="result-content" >
                <div className="text-end my-3 d-flex footer justify-content-end gap-5">
                    {!currentUser.is_student_or_teacher && (
                        <Button
                            size="sm"
                            variant="outline-primary"
                            className="fw-bold custom-btn"
                            onClick={() => {
                                const encodedResult = encodeURIComponent(JSON.stringify(result[0]));
                                const url = `/dashboard/update-student-result/${assigned_student.username}_${term}_session?data=${encodedResult}`;
                                window.open(url, "_blank");
                            }}
                            disabled={!result[0]}
                        >
                            <FaPencilAlt className="me-2" /> Update Result
                        </Button>
                    )}
                    {currentUser.is_superuser && (
                        <Button
                            size="sm"
                            variant="outline-danger"
                            className="fw-bold custom-btn5"
                            onClick={() => {
                                if (window.confirm("Are you sure you want to delete this result?")) {
                                    mutate();
                                }
                            }}
                            disabled={!result[0]}
                        >
                            <FaTrashAlt className="me-2" /> Delete Result
                        </Button>
                    )}
                </div>

                <div id="result-content" className="position-relative">


                    {isLoading && (
                        <CenteredSpinner
                            caption={`Deleting ${assigned_student?.username} ${term} of session ${session} classroom: ${classroom?.name} Result`}
                        />
                    )}

                    {isError && (
                        <ErrorAlert
                            heading="Error while deleting Result"
                            message={ErrorMessageHandling(isError, resultDeleteError)}
                        />
                    )}

                    {/* Student Info */}
                    <Card className="mb-4 border-0 rounded-4 shadow-sm bg-white">
                        <Card.Body className="d-flex flex-column flex-md-row align-items-center gap-3">
                            <Image
                                src={!assigned_student["profile_picture"] || assigned_student["profile_picture"] === 'null' || assigned_student["profile_picture"].endsWith('null')
                                    ? NoProfilePicture
                                    : assigned_student["profile_picture"]}
                                roundedCircle
                                width={150}
                                height={150}
                                style={{ objectFit: "cover" }}
                                className="shadow-lg border border-2 border-primary"
                            />
                            <div className="flex-grow-1">
                                <h4 className="fw-bold text-dark mb-2">
                                    <FaUser className="me-2 text-primary" />
                                    {assigned_student["username"]}
                                </h4>
                                <div className="d-flex flex-wrap text-muted">
                                    <p className="me-4 mb-1">
                                        <FaCalendarAlt className="me-2 text-secondary" />
                                        <strong>Session:</strong> {session}
                                    </p>
                                    <p className="me-4 mb-1">
                                        <strong>Term:</strong> {term}
                                    </p>
                                    <p className="me-4 mb-1">
                                        <strong>Class:</strong> {classroom["name"]}
                                    </p>
                                </div>
                                <p className="mb-1">
                                    <strong>Created:</strong>{" "}
                                    <span className="text-dark">{new Date(created_at).toLocaleString()}</span>
                                </p>
                                <p className="mb-0">
                                    <strong>Updated:</strong>{" "}
                                    <span className="text-dark">{new Date(updated_at).toLocaleString()}</span>
                                </p>
                            </div>
                        </Card.Body>
                    </Card>

                    {/* Subject Scores */}
                    <Card className="mb-4 border-0 rounded-4 shadow-sm">
                        <Card.Header className="text-white text-center fw-bold" style={{ background: "linear-gradient(135deg, var(--color-primary), #2563EB)" }}>
                            <FaBook className="me-2" /> Subject Scores
                        </Card.Header>
                        <Card.Body className="p-0">
                            <Table responsive hover className="mb-0">
                                <thead style={{ backgroundColor: "var(--color-primary)", color: "#fff" }}>
                                    <tr>
                                        <th className="py-3">Subject</th>
                                        <th className="py-3 text-center">Test</th>
                                        <th className="py-3 text-center">Exam</th>
                                        <th className="py-3 text-center">Total</th>
                                        <th className="py-3 text-center">Grade</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(scores).map(([subject, { test, exam }], index) => {
                                        const total = test + exam;
                                        const grade = calculateGrade(total);
                                        let rowClass = total < 40
                                            ? "table-danger"
                                            : total >= 75
                                                ? "table-success"
                                                : index % 2 === 0
                                                    ? "table-light"
                                                    : "table-white";
                                        return (
                                            <tr key={subject} className={rowClass}>
                                                <td className="fw-bold">{subject}</td>
                                                <td className="text-center">{test}</td>
                                                <td className="text-center">{exam}</td>
                                                <td className="text-center fw-bold">{total}</td>
                                                <td className="text-center fw-bold text-success">
                                                    {grade}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>

                    {/* Analytics Section */}
                    <Card className="mb-4 border-0 rounded-4 shadow-sm">
                        <Card.Header
                            className="text-white text-center fw-bold"
                            style={{ background: "linear-gradient(135deg, var(--color-success), #198754)" }}
                        >
                            <FaChartPie className="me-2" /> Performance Analytics
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col md={6} className="text-center mb-3">
                                    <h6 className="fw-bold">Overall Performance</h6>
                                    <ResponsiveContainer width="100%" height={220}>
                                        <PieChart>
                                            <Pie
                                                data={[{ name: "Performance", value: overallPercentage }]}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={50}
                                                outerRadius={80}
                                                fill="var(--color-success)"
                                                dataKey="value"
                                                label={({ value }) => `${value.toFixed(1)}%`}
                                            />
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <p><strong>Overall:</strong> {overallPercentage.toFixed(2)}%</p>
                                    <p><strong>Grade:</strong> {overallGrade}</p>
                                </Col>
                                <Col md={6} className="text-center">
                                    <h6 className="fw-bold">Subject Grades</h6>
                                    <ResponsiveContainer width="100%" height={220}>
                                        <BarChart data={subjectGrades} margin={{ left: 20, right: 20 }}>
                                            <XAxis dataKey="subject" angle={-90} textAnchor="end" height={80} interval={0} tick={{ fontSize: 12 }} />
                                            <YAxis />
                                            <Tooltip />
                                            <Bar dataKey="grade" fill="var(--color-primary)" barSize={30} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </Col>
                            </Row>
                            <h6 className="mt-4 fw-bold">Best & Weakest Subjects</h6>
                            <Alert variant="success">
                                <strong>Best:</strong> {bestSubject.name} ({bestSubject.score} Marks)
                            </Alert>
                            <Alert variant="danger">
                                <strong>Weakest:</strong> {weakestSubject.name} ({weakestSubject.score} Marks)
                            </Alert>
                        </Card.Body>
                    </Card>

                    {/* General Remarks */}
                    <Card className="mb-4 border-0 rounded-4 shadow-sm">
                        <Card.Header className="bg-warning text-dark">
                            ⭐ General Remarks
                        </Card.Header>
                        <Card.Body>
                            <Row xs={1} md={2} className="g-3">
                                {Object.entries(general_remarks).map(([remark, rating]) => (
                                    <Col key={remark}>
                                        <Alert
                                            style={{
                                                color: "var(--color-dark)",
                                                textTransform: "capitalize",
                                                textWrap: "wrap",
                                            }}
                                            variant="warning border border-3 border-dark"
                                            className="d-flex align-items-center justify-content-between"
                                        >
                                            <div>
                                                <strong>{remark.replace("_", " ")}:</strong>
                                            </div>
                                            <div>{renderStars(rating)}</div>
                                        </Alert>
                                    </Col>
                                ))}
                            </Row>
                        </Card.Body>
                    </Card>

                    {/* Comments */}
                    <Card className="mb-4 border-0 rounded-4 shadow-sm">
                        <Card.Header className="bg-primary text-white">
                            <FaComments className="me-2" /> Comments
                        </Card.Header>
                        <Card.Body>
                            <Row xs={1} md={2} className="g-3">

                                {Object.entries(comments).map(([comment_type, comment]) => (
                                    <Col key={comment_type}>
                                        <Alert style={{
                                            color: "var(--color-dark)",
                                            textTransform: "capitalize",
                                            textWrap: "wrap",
                                        }}
                                            variant="primary border border-3 border-dark"
                                            className="d-flex ">
                                            <strong >{comment_type.replace('_', ' ')} : </strong> <span>{comment}</span>
                                        </Alert>
                                    </Col>
                                ))}
                            </Row>
                        </Card.Body>
                    </Card>
                </div>
            </Modal.Body>

            {/* Footer */}
            <Modal.Footer className="d-flex flex-column flex-md-row justify-content-between align-items-center">
                <small className="text-muted text-center text-md-start mb-2 mb-md-0">
                    © {new Date().getFullYear()} Ogunboyejo Adeola Memorial School. All rights reserved.
                </small>
                <Button
                    variant="primary"
                    onClick={() => {
                        generateResultPDF(result[0], overallPercentage)
                            .then(() => {
                                setLoading(false)
                            })
                            .catch((error) => {
                                console.error("Error generating PDF:", error);
                                setLoading(false)
                            });
                    }}
                    disabled={loading}
                >
                    <FaFileDownload className="me-2" />
                    {loading ? "Generating..." : "Save as PDF"}
                </Button>
            </Modal.Footer>


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
        </Modal >
    );
};
