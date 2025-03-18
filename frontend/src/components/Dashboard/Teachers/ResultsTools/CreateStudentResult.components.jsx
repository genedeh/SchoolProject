import { useLocation, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useUser } from "../../../../contexts/User.contexts";
import { useQuery, useMutation } from "react-query";
import { Form, Button, Spinner, Col, Row, Card } from "react-bootstrap";
import { FaCheckCircle, FaCheckDouble, FaStickyNote } from "react-icons/fa";
import { ResultComments, ResultGeneralRemarks, ResultSubjectScoresDisplay, ResultUploadButton } from "./ResultHandlerTools.components";
import CenteredSpinner from "../../../Loading/CenteredSpinner.components";
import { ErrorAlert } from "../../../Alerts/ErrorAlert.components";
import { SuccessAlert } from "../../../Alerts/SuccessAlert.components";
import { ErrorMessageHandling } from "../../../../utils/ErrorHandler.utils";
import axios from "axios";
import { use } from "react";


const fetchClassrooms = async ({ queryKey }) => {
    const [, page] = queryKey;
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Authentication token is missing!");

    const response = await axios.get(`/api/classrooms/?page=${page}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data; // Django default pagination format
};


export const CreateStudentResult = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const { currentUser } = useUser();
    const studentName = queryParams.get("student_name");
    const classroomId = queryParams.get("classroom_id");
    const [student_Id, setStudent_Id] = useState(null);
    const [page, setPage] = useState(1);
    const token = localStorage.getItem("token");

    const { data: student, isLoading: studentLoading, error: studentError, refetch } = useQuery({
        queryKey: ["student", studentName],
        queryFn: async () => {
            const response = await axios.get(`/api/users/?username=${studentName}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data.results.length === 0) {
                throw new Error("No student found.");
            }

            setStudent_Id(response.data.results[0].id);
            return response.data.results[0];
        },
        enabled: !!studentName,
    });

    const { data: classroom, isFetching: classroomLoading, error: classroomError } = useQuery({
        queryKey: ["classroom", classroomId],
        queryFn: async () => {
            const response = await axios.get(`/api/classrooms/${classroomId}/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;

        },
        enabled: !!classroomId,
    });

    const {
        data: classroomsData,
        isLoading,
        isError,
        error,
    } = useQuery(["classrooms", page], fetchClassrooms, {
        keepPreviousData: true, // Ensures smooth pagination experience
        staleTime: 1000 * 60 * 5, // Caches data for 5 mins
    });

    const [formData, setFormData] = useState({
        session: "",
        term: "",
        uploaded: false,
        assigned_student: student?.id,
        classroom: classroomId,
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
        if (!student_Id) {
            refetch();
        }
        e.preventDefault();
        console.log(formData);
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

    useEffect(() => {
        if (student) {
            setStudent_Id(student.id);
            setFormData((prev) => ({
                ...prev,
                assigned_student: student.id,
            }));
        }
    }, [student]);

    if (studentLoading || classroomLoading) return <CenteredSpinner caption={student_Id ? "Loading Student Information...": "Reloading Student Id"} />;
    if (studentError) return <ErrorAlert heading="Error while fetching Student Information" message={ErrorMessageHandling(studentError, studentError)} />;
    if (classroomError) return <ErrorAlert heading="Error while fetching Classroom Information" message={ErrorMessageHandling(classroomError, classroomError)} />;

    if (currentUser && !currentUser.is_student_or_teacher) {

        return (
            <div className="shadow-md border-0 p-4 mt-4">
                <h2 className="text-center mb-3">
                    Create Result for {student?.username}
                </h2>
                {isSuccess && <SuccessAlert heading="Creation Successful" message="Result Created successfully!" />}

                <Form onSubmit={onSubmit} className="mt-3">
                    {/* ✅ Student Info Section */}
                    <Card className="p-4 mb-4 bg-white rounded">
                        <Row className="mb-3">
                            <Col><strong>Student:</strong> {student?.username}</Col>
                            {classroomId && <Col><strong>Classroom:</strong> {classroom?.name}</Col>}
                        </Row>
                        <Row className="gy-3">
                            {currentUser?.is_admin && (
                                <>
                                    <Col md={6}>
                                        <Form.Group controlId="classroom">
                                            <Form.Label className="fw-semibold">Classroom</Form.Label>
                                            {isError && (
                                                <ErrorAlert heading="Error Loading Classrooms" message={error.message} />
                                            )}

                                            <Form.Select
                                                name="classroom"
                                                size="md"
                                                className="border-primary shadow-sm"
                                                required
                                                disabled={isLoading}
                                                value={formData.classroom || ""}
                                                onChange={(e) =>
                                                    setFormData((prev) => ({ ...prev, classroom: e.target.value }))
                                                }
                                            >
                                                <option value="" disabled>
                                                    {isLoading ? "Loading classrooms..." : "Select Classroom"}
                                                </option>
                                                {classroomsData?.results?.map((classroom) => (
                                                    <option key={classroom.id} value={classroom.id}>
                                                        {classroom.name}
                                                    </option>
                                                ))}
                                            </Form.Select>

                                            {/* Pagination Controls */}
                                            <Row className="mt-2">
                                                <Col className="d-flex justify-content-between">
                                                    <Button
                                                        variant="outline-primary"
                                                        size="sm"
                                                        disabled={!classroomsData?.previous}
                                                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                                                    >
                                                        Previous
                                                    </Button>
                                                    <span>Page {page}</span>
                                                    <Button
                                                        variant="outline-primary"
                                                        size="sm"
                                                        disabled={!classroomsData?.next}
                                                        onClick={() => setPage((prev) => prev + 1)}
                                                    >
                                                        Next
                                                    </Button>
                                                </Col>
                                            </Row>

                                            {isLoading && <CenteredSpinner caption="Fetching Classrooms..." />}
                                        </Form.Group>
                                    </Col>
                                </>
                            )}
                            <Col md={6}>
                                <Form.Group controlId="term">
                                    <Form.Label className="fw-semibold">Term</Form.Label>
                                    <Form.Select
                                        name="term"
                                        size="md"
                                        className="border-primary shadow-sm"
                                        required
                                        value={formData.term || ""}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, term: e.target.value }))}
                                    >
                                        <option value="" disabled>Select Term</option>
                                        {termOptions.map((term, index) => (
                                            <option key={index} value={term}>{term}</option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>
                            </Col>

                            <Col md={6}>
                                <Form.Group controlId="session">
                                    <Form.Label className="fw-semibold">Session</Form.Label>
                                    <Form.Control
                                        name="session"
                                        type="text"
                                        size="md"
                                        className="border-primary shadow-sm"
                                        required
                                        placeholder={`e.g. ${new Date().getFullYear()}/${new Date().getFullYear() + 1}`}
                                        value={formData.session || ""}
                                        onChange={(e) => setFormData((prev) => ({ ...prev, session: e.target.value }))}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Card>



                    {/* ✅ Scores Section */}
                    <h4 className="mt-4 d-flex align-items-center gap-2 text-dark">
                        <FaCheckCircle className="text-success" />
                        Subjects & Scores  TEST (40) / EXAM (60)
                    </h4>
                    <hr />

                    {student?.subjects.map((subject) => (
                        <ResultSubjectScoresDisplay subject={subject} handleNestedChange={handleNestedChange} scores={formData.scores} />
                    ))}

                    {/* ✅ General Remarks */}
                    <h4 className="mt-4 d-flex align-items-center gap-2 text-dark">
                        <FaCheckDouble className="text-primary" />
                        General Remarks
                    </h4>
                    <hr />
                    {Object.keys(formData?.general_remarks || {}).map((remark, index) => (
                        <ResultGeneralRemarks remark={remark} index={index} general_remarks={formData?.general_remarks} handleNestedChange={handleNestedChange} />
                    ))}

                    {/* ✅ Comments Section */}
                    <h4 className="mt-4 d-flex align-items-center gap-2 text-dark">
                        <FaStickyNote className="text-info" />
                        Comments
                    </h4>
                    <hr />

                    {Object.keys(formData?.comments || {}).map((comment, index) => (
                        <ResultComments comment={comment} index={index} comments={formData?.comments} handleNestedChange={handleNestedChange} />
                    ))}


                    {/* Uploaded Toggle Button */}
                    <ResultUploadButton uploaded={formData?.uploaded} handleInputChange={handleInputChange} />

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
            </div >
        );
    } else {
        return <Navigate to="/dashboard/home" />;
    }
};
