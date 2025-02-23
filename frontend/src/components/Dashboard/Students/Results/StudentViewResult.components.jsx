import { useState } from "react";
import { useUser } from "../../../../contexts/User.contexts"
import { useQuery } from "react-query";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { CenteredSpinner } from "../../../Loading/CenteredSpinner.components"
import { ErrorAlert } from "../../../Alerts/ErrorAlert.components"
import { ErrorMessageHandling } from "../../../../utils/ErrorHandler.utils";
import { Tab, Nav, Button } from "react-bootstrap";
import { ResultModal } from "../../Teachers/ResultsTools/ResultModal.components";
import { getGrade, GradeDistributionComponent, SubjectScoreDistribution, TermPerformance } from "../../../../utils/AnalyticalHandler.utils";
// Function to fetch student result
const fetchStudentResults = async ({ queryKey }) => {
    const [, session, id] = queryKey; // Extract page number
    const token = localStorage.getItem("token");

    if (!token) throw new Error("Authentication token is missing!");

    const response = await axios.get(
        `/api/get-student-result/?student_id=${id}&session=${session}`,
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
    return response.data;
};

const StudentViewResult = () => {
    const { currentUser } = useUser();
    const [showModal, setShowModal] = useState(false);
    const [studentResult, setStudentResult] = useState();
    const [selectedSession, setSelectedSession] = useState("");


    // React Query for fetching data with pagination
    const { data, error, isLoading, isError, isFetching } = useQuery(
        ["student-result", selectedSession, currentUser.id], // Include page in query key
        fetchStudentResults,
        {
            onSuccess: (data) => {
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
                {isFetching && <CenteredSpinner caption="Fetching Results..." />}
                {isError && <ErrorAlert heading="Error while fetching results" message={ErrorMessageHandling(isError, error)} removable={true} />}

                {!isLoading && !isFetching && !isError && (
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

                                const subjectAggregatedStats = {}; // Object to store aggregated subject scores

                                Object.entries(data.terms).forEach(([termName, termData]) => {
                                    let termTotal = 0;
                                    let termSubjects = 0;

                                    termData.forEach(result => {
                                        if (result.scores && result.uploaded) {
                                            if (!termData || termData.length === 0) {
                                                termDetails.push({ term: termName, avg: null, subjects: 0 });
                                                return;
                                            }

                                            Object.keys(result.scores).forEach(subject => {
                                                let score = result.scores[subject].exam + result.scores[subject].test;

                                                // Aggregate scores for each subject
                                                if (!subjectAggregatedStats[subject]) {
                                                    subjectAggregatedStats[subject] = { totalScore: 0, count: 0 };
                                                }

                                                subjectAggregatedStats[subject].totalScore += score;
                                                subjectAggregatedStats[subject].count += 1;

                                                totalScore += score;
                                                totalSubjects++;
                                                termTotal += score;
                                                termSubjects++;

                                                let grade = getGrade(score);
                                                gradeDistribution[grade] = (gradeDistribution[grade] || 0) + 1;

                                                if (!subjectScores[subject]) {
                                                    subjectScores[subject] = [];
                                                }
                                                subjectScores[subject].push(score);
                                            });
                                        }
                                    });

                                    let termAvg = termSubjects > 0 ? (termTotal / termSubjects).toFixed(2) : 0;
                                    if (termAvg !== 0) {
                                        termAverages.push({ term: termName, avg: termAvg });
                                        termDetails.push({ term: termName, avg: termAvg, subjects: termSubjects });
                                    }
                                });

                                // Convert aggregated subject scores into final subjectStats array
                                Object.keys(subjectAggregatedStats).forEach(subject => {
                                    let avgScore = subjectAggregatedStats[subject].totalScore / subjectAggregatedStats[subject].count;

                                    subjectStats.push({
                                        subject: subject, // Keep only subject name (remove term details)
                                        score: (avgScore / 100) * 100, // Convert to percentage
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
                                                <GradeDistributionComponent gradeDistribution={gradeDistribution} />
                                            </div>
                                        </div>

                                        {/* 🔹 Performance Trend */}
                                        <div className="col-md-12 mt-4">
                                            <div className="p-3 shadow rounded text-center">
                                                <h6>📊 Performance Over Terms</h6>
                                                <TermPerformance termAverages={termAverages} />
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
                                                <SubjectScoreDistribution subjectStats={subjectStats} />
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