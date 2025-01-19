import { UserContext } from "../../../../contexts/User.contexts";
import { useContext } from "react";
import { useQuery } from "react-query";
import { Navigate } from "react-router-dom";
import { Card, Button, ListGroup, Accordion } from 'react-bootstrap';
import { GenderFemale, GenderMale } from "react-bootstrap-icons";
import { ErrorAlert } from "../../../Alerts/ErrorAlert.components";
import { ErrorMessageHandling } from "../../../../utils/ErrorHandler.utils";
import { CenteredSpinner } from "../../../Loading/CenteredSpinner.components"
import axios from "axios";



export const AssignedSubjects = () => {
    const { currentUser } = useContext(UserContext);

    const fetchSubjects = async () => {
        const token = localStorage.getItem("token");
        // console.log({ "subject_ids": currentUser["teaching_subjects"] })

        if (!token) {
            throw new Error("Authentication token is missing!");
        }

        const response = await axios.post(
            "api/get-subjects/", { "subject_ids": currentUser["teaching_subjects"] },
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );
        return response.data;
    };
    const { data, error, isError, isLoading } = useQuery(
        ["assigned_subjects", currentUser.teaching_subjects], // Query key
        fetchSubjects,
        {
            enabled: !!currentUser["teaching_subjects"],
            keepPreviousData: true,
            refetchOnWindowFocus: true,
            retry: 3,
            staleTime: 1000 * 60 * 5,
            cacheTime: 1000 * 60 * 10,
        }
    );



    if (!currentUser.is_student_or_teacher && currentUser && !currentUser.is_admin) {
        return (
            <div>
                <center>
                    <hr /> <h3>Assigned Subjects</h3><hr />
                </center>
                <Accordion flush={true} className="m-3">
                    {isLoading && <CenteredSpinner caption="Fetching Teaching Subjects..." />}
                    {isError && <ErrorAlert heading="Error while fetching teaching Subjects" message={ErrorMessageHandling(isError, error)} removable={true} />}
                    {!isLoading && !isError && data?.length === 0 && (
                        <p>No Teaching Subjects found!</p>
                    )}
                    {!isLoading && !isError && data.length > 0 && (
                        data?.map(({ id, name, students_offering }) => (
                            <Card key={id} className="mb-2">
                                <Accordion.Item eventKey={id}>
                                    <Accordion.Header eventKey={id} className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h5>{name.replace('_', ' ')}</h5>
                                        </div>

                                    </Accordion.Header>
                                    <Accordion.Body>
                                        <hr /><h5>Students</h5><hr />
                                        <ListGroup>
                                            {students_offering.length !== 0 ? (students_offering.map(({ id, username, gender, profile_picture }) => (
                                                <ListGroup.Item key={id} className="container">
                                                    <div className="d-flex align-items-center">
                                                        <div className="me-3">
                                                            <img
                                                                src={profile_picture == null ? ("https://via.placeholder.com/40") : (profile_picture)}
                                                                className="rounded-circle"
                                                                style={{ width: '40px', height: '40px' }}
                                                            />
                                                        </div>
                                                        <div>
                                                            <div>{username}</div>
                                                        </div>
                                                        {gender === 'male' ?
                                                            (<Button className="m-2" size="sm" variant='primary' style={{ 'borderColor': 'white' }}>
                                                                <GenderMale />
                                                            </Button>) :
                                                            (<Button className="m-2" size="sm" style={{ 'backgroundColor': 'pink', 'borderColor': 'white' }}>
                                                                <GenderFemale />
                                                            </Button>)}
                                                    </div>
                                                </ListGroup.Item>
                                            ))) : ('NO Student Available')}
                                        </ListGroup>
                                    </Accordion.Body>
                                </Accordion.Item>

                            </Card>
                        ))
                    )}
                </Accordion>
            </div>
        )

    } return (
        <Navigate to='/dashboard/home' />
    );
}