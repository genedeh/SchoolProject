import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../../../../contexts/User.contexts";
import { SubjectsContext } from "../../../../contexts/Subjects.contexts"
import { Card, Spinner, Button, ListGroup, Accordion, Image } from 'react-bootstrap'
import { GenderFemale, GenderMale } from "react-bootstrap-icons"

export const AssignedSubjects = () => {
    const { currentUser } = useContext(UserContext);
    const { subjects } = useContext(SubjectsContext); // Access the list of users from context

    if (!currentUser.is_student_or_teacher && currentUser && !currentUser.is_admin) {
        if (subjects.length !== 0) {
            return (
                <div>
                    <center>
                        <hr /> <h3>Assigned Subjects</h3><hr />
                    </center>
                    <Accordion flush={true} className="m-3">
                        {subjects.map((subject) => {
                            const { id, name, students_offering } = subject;
                            if (currentUser["teaching_subjects"].includes(id)) {
                                return (
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
                                                    {students_offering && students_offering.length !== 0 ? (students_offering.map(({ id, username, gender,profile_picture }) => (
                                                        <ListGroup.Item key={id}>
                                                            {profile_picture ? (<Image
                                                                src={profile_picture.includes('http://') ? (profile_picture) : (`http://127.0.0.1:8000/media/${profile_picture}`)}
                                                                roundedCircle
                                                                style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                                                className="me-3" />)
                                                                : (<Image
                                                                    src="http://127.0.0.1:8000/media/default_profile_images/default_image.jpeg"
                                                                    roundedCircle
                                                                    style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                                                    className="me-3" />)
                                                            }
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
                                )
                            }
                        })}
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