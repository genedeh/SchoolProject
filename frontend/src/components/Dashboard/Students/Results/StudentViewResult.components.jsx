import { useState, useContext } from "react";
import { UserContext } from "../../../../contexts/User.contexts"
import { useQuery } from "react-query";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { CenteredSpinner } from "../../../Loading/CenteredSpinner.components"
import { ErrorAlert } from "../../../Alerts/ErrorAlert.components"
import { ErrorMessageHandling } from "../../../../utils/ErrorHandler.utils";
import { Tab, Nav, Button } from "react-bootstrap";
import { ResultModal } from "./ResultModal.components";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, RadialBarChart, RadialBar, ResponsiveContainer,LineChart, CartesianGrid, Line } from "recharts";
const COLORS = ["#4caf50", "#00c853", "#d32f2f", "#3f51b5"];

// Function to determine WAEC-style grades
const getGrade = (score) => {
    if (score >= 75) return "A1";
    if (score >= 70) return "B2";
    if (score >= 65) return "B3";
    if (score >= 60) return "C4";
    if (score >= 55) return "C5";
    if (score >= 50) return "C6";
    if (score >= 45) return "D7";
    if (score >= 40) return "E8";
    return "F9";
};
// Function to fetch student result
const fetchStudentResults = async ({ queryKey }) => {
    const [, session, id] = queryKey; // Extract page number
    console.log(queryKey)
    const token = localStorage.getItem("token");

    if (!token) throw new Error("Authentication token is missing!");

    const response = await axios.get(
        `/api/get-student-result/?student_id=${id}&session=${session}`,
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );

    console.log(response); // Debugging purpose
    return response.data;
};

const StudentViewResult = () => {
    const { currentUser } = useContext(UserContext);
    const [showModal, setShowModal] = useState(false);
    const [studentResult, setStudentResult] = useState();
    const [selectedSession, setSelectedSession] = useState("");
    const [studentResults, setStudentResults] = useState([]);
    const [sessionData, setSessionData] = useState([]);


    // React Query for fetching data with pagination
    const { data, error, isLoading, isError, isFetching } = useQuery(
        ["student-result", selectedSession, currentUser.id], // Include page in query key
        fetchStudentResults,
        {
            onSuccess: (data) => {
                setSessionData(data);
                setSelectedSession(data?.session);
            },
            keepPreviousData: true,
            refetchOnWindowFocus: true,
            retry: 3,
            staleTime: 1000 * 60 * 5,
            cacheTime: 1000 * 60 * 10,
        }
    );


    if (currentUser && currentUser.is_student_or_teacher) {
        return (
            <div>
                <h2 className="m-4">📊 Student Results Dashboard</h2>

                {isLoading && <CenteredSpinner caption="Fetching Results..." />}
                {isError && <ErrorAlert heading="Error while fetching results" message={ErrorMessageHandling(isError, error)} removable={true} />}

                {!isLoading && !isError && (
                    <div className="mt-4">
                        <div className="p-4 bg-light shadow rounded mb-4 text-center">
                            <h5 className="fw-bold">📊 Analytical Overview: {selectedSession}</h5>

                            {selectedSession && data.terms ? (() => {
                                let totalScore = 0;
                                let totalSubjects = 0;
                                let subjectScores = {};
                                let subjectStats = [];
                                let termAverages = [];
                                let gradeDistribution = { A1: 0, B2: 0, B3: 0, C4: 0, C5: 0, C6: 0, D7: 0, E8: 0, F9: 0 };
                                let termDetails = [];

                                Object.entries(data.terms).forEach(([termName, termData]) => {
                                    

                                    let termTotal = 0;
                                    let termSubjects = 0;

                                    termData.forEach(result => {
                                        if (result.scores && result.uploaded ) {
                                            if (!termData || termData.length === 0) {
                                                termDetails.push({ term: termName, avg: null, subjects: 0 });
                                                return;
                                            }
                                            Object.keys(result.scores).forEach(subject => {
                                                let score = result.scores[subject].exam + result.scores[subject].test;
                                                totalScore += score;
                                                totalSubjects++;
                                                termTotal += score;
                                                termSubjects++;

                                                subjectStats.push({
                                                    "subject": `${subject} (${termName})`,
                                                    score: (score / 100) * 100, // Convert to percentage
                                                });

                                                let grade = getGrade(score);
                                                gradeDistribution[grade] += 1;

                                                if (!subjectScores[subject]) {
                                                    subjectScores[subject] = [];
                                                }
                                                subjectScores[subject].push(score);
                                            });
                                        }
                                        let termAvg = termSubjects > 0 ? (termTotal / termSubjects).toFixed(2) : 0;
                                        if (termAvg !== 0) {
                                        
                                            termAverages.push({ term: termName, avg: termAvg });
                                            termDetails.push({ term: termName, avg: termAvg, subjects: termSubjects });
                                        }
                                        console.log(termAvg, termAverages, termDetails)
                                    });

                                });

                                let avgScore = totalSubjects > 0 ? (totalScore / totalSubjects).toFixed(2) : 0;

                                let bestSubject = Object.keys(subjectScores).reduce((best, subject) => {
                                    let avg = subjectScores[subject].reduce((a, b) => a + b, 0) / subjectScores[subject].length;
                                    return avg > (best.avg || 0) ? { name: subject, avg: avg.toFixed(2) } : best;
                                }, {});

                                let worstSubject = Object.keys(subjectScores).reduce((worst, subject) => {
                                    let avg = subjectScores[subject].reduce((a, b) => a + b, 0) / subjectScores[subject].length;
                                    return avg < (worst.avg || 100) ? { name: subject, avg: avg.toFixed(2) } : worst;
                                }, {});

                                let bestTerm = termDetails.reduce((best, term) => (term.avg > (best.avg || 0) ? term : best), {});
                                let worstTerm = termDetails.reduce((worst, term) => (term.avg < (worst.avg || 100) ? term : worst), {});

                                // if (worstTerm.avg === bestTerm.avg) {
                                //     worstTerm.term = null
                                //     worstTerm.avg = null
                                // }

                                return (
                                    <div className="row">
                                        {/* 🔹 Missing Terms Alert */}
                                        <div className="col-md-12">
                                            {termDetails.some(term => term.avg === null) && (
                                                <p className="text-danger">⚠️ Some terms have missing results.</p>
                                            )}
                                        </div>

                                        {/* 🔹 Overall Stats */}
                                        <div className="col-md-4">
                                            <div className="p-3 shadow rounded text-center">
                                                <h6>📈 Overall Average</h6>
                                                <h3 className="text-primary">{avgScore}%</h3>
                                                <h3 className="text-muted font-bold">{getGrade(avgScore)}</h3>
                                            </div>
                                        </div>

                                        {/* 🔹 Grade Distribution */}
                                        <div className="col-md-8">
                                            <div className="p-3 shadow rounded text-center">
                                                <h6>📊 Grade Distribution</h6>
                                                <ResponsiveContainer width="100%" height={250}>
                                                    <BarChart data={Object.keys(gradeDistribution).map(grade => ({ grade, count: gradeDistribution[grade] }))}>
                                                        <XAxis dataKey="grade" />
                                                        <YAxis />
                                                        <Tooltip />
                                                        <Bar dataKey="count" fill={COLORS[Math.floor(Math.random() * COLORS.length)]} />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>

                                        {/* 🔹 Performance Trend */}
                                        <div className="col-md-12 mt-4">
                                            <div className="p-3 shadow rounded text-center">
                                                <h6>📊 Performance Over Terms</h6>
                                                <ResponsiveContainer width="100%" height={250}>
                                                    <LineChart data={termAverages}>
                                                        <CartesianGrid strokeDasharray="3 3" />
                                                        <XAxis dataKey="term" />
                                                        <YAxis />
                                                        <Tooltip />
                                                        <Line type="monotone" dataKey="avg" stroke={COLORS[Math.floor(Math.random() * COLORS.length)]} strokeWidth={2} />
                                                    </LineChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>

                                        {/* 🔹 Best & Worst Subjects */}
                                        <div className="col-md-6">
                                            <div className="p-3 shadow rounded text-center">
                                                <h6>🏆 Best Subject</h6>
                                                <h5>{bestSubject.name || "N/A"}</h5>
                                                <p>Avg Score: {bestSubject.avg || "N/A"}%</p>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="p-3 shadow rounded text-center">
                                                <h6>📉 Worst Subject</h6>
                                                <h5>{worstSubject.name || "N/A"}</h5>
                                                <p>Avg Score: {worstSubject.avg || "N/A"}%</p>
                                            </div>
                                        </div>

                                        {/* 🔹 Best & Worst Term */}
                                        <div className="col-md-6">
                                            <div className="p-3 shadow rounded text-center">
                                                <h6>🏆 Best Term</h6>
                                                <h5>{bestTerm.term || "N/A"}</h5>
                                                <p>Avg Score: {bestTerm.avg || "N/A"}%</p>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="p-3 shadow rounded text-center">
                                                <h6>📉 Worst Term</h6>
                                                <h5>{worstTerm.term || "N/A"}</h5>
                                                <p>Avg Score: {worstTerm.avg || "N/A"}%</p>
                                            </div>
                                        </div>

                                        <div className="col-md-12 mt-4">
                                            <div className="p-3 shadow rounded text-center">
                                                <h6>📊 Subject Score Distribution</h6>
                                                <ResponsiveContainer width="100%" height={400}>
                                                    <BarChart
                                                        layout="vertical"  // This makes it a horizontal bar chart
                                                        data={subjectStats}
                                                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                                    >
                                                        <XAxis type="number" domain={[0, 100]} />
                                                        <YAxis dataKey="subject" type="category" width={100} />
                                                        <Tooltip />
                                                        <Bar
                                                            dataKey="score"
                                                            fill={COLORS[Math.floor(Math.random() * COLORS.length)]}
                                                            barSize={20}
                                                        />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })() : <p className="text-muted">No data available.</p>}
                        </div>
                        {/* 🔹 Session Selection */}
                        <Tab.Container activeKey={selectedSession} onSelect={(k) => setSelectedSession(k)}>
                            <Nav variant="tabs" className="mb-3">
                                {data.available_sessions.map((session) => (
                                    <Nav.Item key={session}>
                                        <Nav.Link eventKey={session}>{session}</Nav.Link>
                                    </Nav.Item>
                                ))}
                            </Nav>

                            {/* 🔹 Term Selection */}
                            <Tab.Content>
                                {data.available_sessions.map((session) => (
                                    <Tab.Pane eventKey={session} key={session}>
                                        <div className="p-3 border rounded">
                                            <h6 className="fw-bold">📄 Available Terms for {session}</h6>

                                            {data.terms ? (
                                                Object.keys(data.terms).map((term) => {
                                                    if (data.terms[term][0].uploaded) {
                                                        return (
                                                            <Button
                                                                key={term}
                                                                variant="outline-primary"
                                                                className="m-2"
                                                                onClick={() => {
                                                                    setStudentResult(data.terms[term])
                                                                    setShowModal(true)
                                                                }}
                                                            >
                                                                {term}
                                                            </Button>
                                                        );
                                                    }
                                                })
                                            ) : (
                                                <p className="text-muted">No results uploaded for this session.</p>
                                            )}
                                        </div>
                                    </Tab.Pane>
                                ))}
                            </Tab.Content>
                        </Tab.Container>
                    </div>
                )}
                {/* 🔹 Result Modal */}
                <ResultModal show={showModal} handleClose={() => setShowModal(false)} result={studentResult} />
            </div>
        )
    } else {
        return (
            <Navigate to='/dashboard/home' />
        );
    };
};

export default StudentViewResult;