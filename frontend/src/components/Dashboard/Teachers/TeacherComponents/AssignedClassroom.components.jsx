import { useUser } from "../../../../contexts/User.contexts";
import { useState } from "react";
import { useQuery } from "react-query";
import { Navigate } from "react-router-dom";
import { Button, Card, ListGroup, Spinner } from "react-bootstrap";
import { BookmarkDashFill, PersonFillAdd } from "react-bootstrap-icons";
import { ErrorAlert } from "../../../Alerts/ErrorAlert.components";
import { ErrorMessageHandling } from "../../../../utils/ErrorHandler.utils";
import { CenteredSpinner } from "../../../Loading/CenteredSpinner.components";
import axios from "axios";
import { ResultTermModal } from "../ResultsTools/ResultTermsModal.components";
import {
  ClassroomPerformance,
  ResultCreationHandlerButton,
  ResultViewHandlerButton,
} from "../ResultsTools/ResultHandlerTools.components";

const fetchStudentResults = async (studentId, classroomId) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authentication token is missing!");
  }
  const { data } = await axios.get(
    `/api/get-student-result/?student_id=${studentId}&classroom_id=${classroomId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return data;
};

const fetchClassrooms = async ({ queryKey }) => {
  const [, classroomName] = queryKey;

  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authentication token is missing!");
  }

  const response = await axios.get(`/api/classrooms/?name=${classroomName}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.results;
};

// Function to fetch classroom performance
const fetchClassroomPerformance = async (classroomId) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authentication token is missing!");
  }
  const response = await axios.get(
    `/api/classroom-performance/?classroom_id=${classroomId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return response.data; // Assume this returns performance stats
};

export const AssignedClassrooms = () => {
  const { currentUser } = useUser();
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [classroomId, setClassroomId] = useState(null);

  // Using React Query for data fetching
  const { data, error, isError, isLoading } = useQuery(
    ["assigned_classrooms", currentUser.user_class], // Query key
    fetchClassrooms,
    {
      enabled: !!currentUser.user_class,
      keepPreviousData: true,
      refetchOnWindowFocus: true,
      retry: 3,
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 10,
    }
  );

  const {
    data: studentResult,
    isLoading: isLoadingResult,
    isFetching: isFetchingResult,
    isError: isResultError,
    error: resultError,
    refetch,
  } = useQuery(
    ["studentResult", selectedStudent],
    () =>
      fetchStudentResults(
        selectedStudent?.studentId,
        selectedStudent?.classroomId
      ),
    {
      enabled: !!selectedStudent,
      onSuccess: () => setShowOverlay(true),
      refetchOnWindowFocus: false,
      retry: 1,
    }
  );
  // **Second Query**: Fetch classroom performance (Runs only if classroomId exists)
  const {
    data: performanceData,
    isLoading: isPerfLoading,
    isFetching: isPerfFetching,
    isError: isPerfError,
    error: perfError,
  } = useQuery(
    ["classroom-performance", classroomId],
    () => fetchClassroomPerformance(classroomId), // Fetch function
    {
      enabled: !!classroomId, // Only fetch if classroomId is available
      retry: 1,
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 10,
      onSuccess: () => {
      },
    }
  );

  if (
    !currentUser.is_student_or_teacher &&
    currentUser &&
    !currentUser.is_superuser
  ) {
    return (
      <div>
        <center>
          <hr />
          <h3 className="text-primary fw-bold">📚 Assigned Classrooms</h3>
          <hr />
        </center>

        {isLoading && (
          <CenteredSpinner caption="Fetching Assigned Classrooms..." />
        )}
        {isError && (
          <ErrorAlert
            heading="Error while fetching assigned classrooms"
            message={ErrorMessageHandling(isError, error)}
            removable
          />
        )}

        {!isLoading && !isError && data.length === 0 && (
          <p className="text-center text-muted">
            No Assigned Classrooms found!
          </p>
        )}

        {isPerfError && (
          <ErrorAlert
            heading="Error fetching classroom performance"
            message={ErrorMessageHandling(isPerfError, perfError)}
            removable
          />
        )}

        {!isLoading && !isError && data.length > 0 && (
          <>
            {/* Add User Button */}
            <div className="d-grid gap-2 m-4">
              <Button
                size="lg"
                variant="outline-primary"
                href="/dashboard/add-user"
                className="mb-3 custom-btn"
              >
                <PersonFillAdd className="me-2" /> Add New Student (Ensure To
                only Select Your Class)
              </Button>
            </div>

            {performanceData && (
              <ClassroomPerformance performanceData={performanceData} />
            )}
            <div className="m-4">
              <Button
                size="lg"
                className="mb-3 custom-btn3"
                variant="outline-success"
                onClick={() => {
                  setClassroomId(data[0].id);
                }}
                disabled={isPerfFetching || isPerfLoading}
              >
                <BookmarkDashFill className="me-2" /> View Classroom Performance{" "}
                {isPerfFetching || isPerfLoading ? (
                  <Spinner animation="border" size="sm" className="ml-2" />
                ) : (
                  ""
                )}
              </Button>
            </div>

            <div>
              {data.map(({ id: classId, name, students }) => (
                <div key={classId} className="mb-4">
                  <Card className="border-0">
                    {/* Classroom Header with Gradient */}
                    <div
                      className="p-3 text-light fw-bold bg-primary"
                      style={{
                        borderTopLeftRadius: "8px",
                        borderTopRightRadius: "8px",
                      }}
                    >
                      <h5 className="mb-0">{name.replace("_", " ")}</h5>
                    </div>

                    <Card.Body className="bg-white">
                      <h6 className="fw-bold text-secondary mb-3">
                        👩‍🎓 Students
                      </h6>

                      <ListGroup variant="flush">
                        {students.length !== 0 ? (
                          students.map(
                            ({ id, username, profile_picture_url }) => (
                              <ListGroup.Item
                                key={id}
                                className="d-flex align-items-center justify-content-between border-0"
                                style={{
                                  background: "#f8f9fa",
                                  borderRadius: "8px",
                                  marginBottom: "5px",
                                  padding: "10px",
                                }}
                              >
                                <div className="d-flex align-items-center">
                                  {/* Student Image */}
                                  <img
                                    src={
                                      profile_picture_url ||
                                      "https://via.placeholder.com/40"
                                    }
                                    className="rounded-circle border"
                                    style={{ width: "40px", height: "40px" }}
                                    alt="Profile"
                                  />
                                  <div className="ms-3">
                                    <div className="fw-semibold">
                                      {username.replace("_", " ")}
                                    </div>
                                  </div>
                                </div>

                                {/* Gender & View Button */}
                                      <div className="d-flex gap-3">
                                          <ResultCreationHandlerButton
                                              studentName={username}
                                              classroomID={classId}
                                              studentId={id}
                                          />

                                          <ResultViewHandlerButton
                                              queryKeys={{
                                                  studentId: id,
                                                  classroomId: classId,
                                              }}
                                              refetch={refetch}
                                              setSelectedStudent={setSelectedStudent}
                                              selectedStudent={selectedStudent}
                                              id={id}
                                              loading={{
                                                  isFetchingResult,
                                                  isLoadingResult,
                                              }}
                                          />
                                      </div>

                              </ListGroup.Item>
                            )
                          )
                        ) : (
                          <p className="text-muted">No Students Available</p>
                        )}
                      </ListGroup>
                    </Card.Body>
                  </Card>
                </div>
              ))}
              {/* Show error if fetching student results fails */}
              {isResultError && (
                <div className="mt-3">
                  <ErrorAlert
                    heading="Error fetching student results"
                    message={ErrorMessageHandling(isResultError, resultError)}
                    removable
                  />
                </div>
              )}

              {/* Show fetched student result (for now, just logging it) */}
              {studentResult && (
                <div className="mt-4 text-center">
                  <h5 className="text-success">
                    Result Loaded Successfully ✅
                  </h5>
                </div>
              )}
              <ResultTermModal
                showOverlay={showOverlay}
                setShowOverlay={setShowOverlay}
                studentResult={studentResult}
              />
            </div>
          </>
        )}
      </div>
    );
  }
  return <Navigate to="/dashboard/home" />;
};
