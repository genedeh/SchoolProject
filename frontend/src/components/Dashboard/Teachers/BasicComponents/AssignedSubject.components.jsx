import { useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../../../../contexts/User.contexts";
import { Card, Button, ListGroup, Accordion } from 'react-bootstrap';
import { GenderFemale, GenderMale } from "react-bootstrap-icons";
import axios from "axios";

export const AssignedSubjects = () => {
    const { currentUser } = useContext(UserContext);
    const [subjects, setSubjects] = useState([]);
    const fetchSubjects = async () => {
        await axios.post("api/get-subjects/", { "subject_ids": currentUser["teaching_subjects"] })
            .then((response) => {
                setSubjects(response.data)
            })
            .catch(error => {
                console.error("Failed to fetch subjects.");
            });
    }
    useEffect(() => {
        fetchSubjects()
    }, [currentUser])
    if (!currentUser.is_student_or_teacher && currentUser && !currentUser.is_admin) {
        if (subjects.length !== 0) {
            return (
                <div>
                    <center>
                        <hr /> <h3>Assigned Subjects</h3><hr />
                    </center>
                    <Accordion flush={true} className="m-3">
                        {subjects.map(({ name, students_offering, id }) =>
                        (
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
                                            ))) : ('NO Students Available')}
                                        </ListGroup>
                                    </Accordion.Body>
                                </Accordion.Item>

                            </Card>
                        ))}
                    </Accordion>
                </div>
            )
        } else {
            return (< h1 className="text-center"> No assigned subjects where found</h1 >)
        }

    } return (
        <Navigate to='/dashboard/home' />
    );
}