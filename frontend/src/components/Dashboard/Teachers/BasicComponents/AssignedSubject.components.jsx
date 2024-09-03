import { useContext, useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../../../../contexts/User.contexts";
import { UsersListContext } from "../../../../contexts/UsersList.contexts"
import { SubjectsContext } from "../../../../contexts/Subjects.contexts"
import { Card, Spinner, Button, ListGroup, Accordion } from 'react-bootstrap'
import { GenderFemale, GenderMale } from "react-bootstrap-icons"
import axios from "axios";

export const AssignedSubjects = () => {
    const { currentUser } = useContext(UserContext);
    const teacherId = currentUser["id"]
    const [subjectList, setSubjectList] = useState([]);
    const { subjects } = useContext(SubjectsContext); // Access the list of users from context

    // Fetch subjects assigned to a teacher
    useEffect(() => {
        const fetchSubjects = () => {
            console.log(currentUser["teaching_subjects"])
            console.log(subjects)
            const subject = subjects.filter(subject => {
                return currentUser["teaching_subjects"].includes(subject.id)
            })
            console.log(subject)
            setSubjectList([subjectList, ...subject])
        };
        console.log(teacherId)
        fetchSubjects();
    }, []);

    if (!currentUser.is_student_or_teacher && currentUser && !currentUser.is_admin) {
        if (subjectList.length !== 0) {
            return (
                <div>
                    <center>
                       <hr /> <h3>Assigned Subjects</h3><hr />
                    </center>
                    <Accordion flush={true} className="m-3">
                        {subjects.map(({ id, name, students_offering }) => (
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
                                            {students_offering && students_offering.length !== 0 ? (students_offering.map(({ id, username, gender }) => (
                                                <ListGroup.Item key={id}>
                                                    {username.replace('_', ' ')}
                                                    {gender === 'male' ?
                                                        (<Button className="m-2" size="sm" variant='primary' style={{ 'borderColor': 'white' }}>
                                                            <GenderMale />
                                                        </Button>) :
                                                        (<Button className="m-2" size="sm" style={{ 'backgroundColor': 'pink', 'borderColor': 'white' }}>
                                                            <GenderFemale />
                                                        </Button>)}
                                                </ListGroup.Item>
                                            ))) : ('NO Student Available')}
                                        </ListGroup>
                                    </Accordion.Body>
                                </Accordion.Item>

                            </Card>
                        ))}
                    </Accordion>
                </div>
            )
        } else {
            return (<Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>)
        }

    } return (
        <Navigate to='/dashboard/home' />
    );
}