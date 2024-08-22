import { useContext } from "react";
import { UserContext } from "../../../../contexts/User.contexts";
import { Navigate } from "react-router-dom";
import { SubjectsContext } from "../../../../contexts/Subjects.contexts";
import { Accordion, Card, Button, ListGroup } from 'react-bootstrap'

export const Subjects = () => {
    const { currentUser } = useContext(UserContext);
    const { subjects } = useContext(SubjectsContext);

    if (!currentUser.is_student_or_teacher && currentUser && currentUser.is_admin) {
        if (subjects.length !== 0) {
            return (
                // <div>
                //     {subjects.map(({ assigned_teacher, id, name, students_offering}) => (
                //         <p key={id}>{name}
                //             {assigned_teacher ? (assigned_teacher.username.replace('_', ' ')) : ("NO ASSIGNED TEACHER")}
                //             {students_offering.length === 0 ? ("No student") :
                //                 (students_offering.map(student => {
                //                     return student.username;
                //                 }))}
                //         </p>
                //     ))}
                // </div>
                <Accordion flush={true} className="m-3">
                    {subjects.map(({ assigned_teacher, id, name, students_offering }) => (
                        <Card key={id} className="mb-2">
                            <Accordion.Item eventKey={id.toString()}>
                                <Accordion.Header eventKey={id.toString()} className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h5>{name.replace('_', ' ')}</h5>
                                        <small className="text-muted">Teacher: {assigned_teacher ? (assigned_teacher.username.replace('_', ' ')) : ("NO ASSIGNED TEACHER")}</small>
                                    </div>
                                    <Button className="m-4" variant="outline-danger" >Delete</Button>
                                </Accordion.Header>
                                <Accordion.Body>
                                    <ListGroup>
                                        {students_offering.length !== 0 ? (students_offering.map((student) => (
                                            <ListGroup.Item key={student.id}>
                                                {student.username}
                                            </ListGroup.Item>
                                        ))) : ('NO Student Available')}
                                    </ListGroup>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Card>
                    ))}
                </Accordion>
            );
        } else {
            return (<div>Loading...</div>)
        }
    } return (
        <Navigate to='/dashboard/home' />
    );
}