import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../contexts/User.contexts";
import { Container, Card, Row, Col, Image, Button, Badge } from 'react-bootstrap';
import { GenderFemale, GenderMale, Telephone, GeoAlt } from "react-bootstrap-icons";
import axios from "axios";

const TeacherProfile = () => {
    const { currentUser } = useContext(UserContext);
    const [teachingSubjects, setTeachingSubjects] = useState([]);
    const { id, first_name, last_name, username, address, phone_number, email, profile_picture, birth_date, gender, user_class } = currentUser;
    console.log(currentUser.subjects)
    useEffect(() => {
        const fetchTeachingSubjects = async () => {
            if (currentUser) {
                try {
                    const respone = await axios.post("http://127.0.0.1:8000/api/offering-subjects/", { "students_offering": id })
                    setTeachingSubjects(respone.data.Subjects.replace('[', '').replace(']', '').split(','))
                } catch (err) {
                    console.log("Error: ", err)
                }
            } else {
                console.log('No User Found')
            }
        };
        fetchTeachingSubjects();
    }, [])
    return (
        <>
            <Container className="m-2">
                <Row>
                    <Col >
                        <Card className="m-2">
                            <Card.Header className="bg-gradient">
                                <div className="d-flex align-items-center">
                                    {profile_picture ? (<Image
                                        src={profile_picture.includes('http://') ? (profile_picture) : (`http://127.0.0.1:8000/media/${profile_picture}`)}
                                        roundedCircle
                                        width="100"
                                        height="100"
                                        className="me-3 "
                                        style={{ 'objectFit': 'cover' }}
                                    />) : (<Image
                                        src="http://127.0.0.1:8000/media/default_profile_images/default_image.jpeg"
                                        roundedCircle
                                        width="100"
                                        height="100"
                                        className="me-3 "
                                        style={{ 'objectFit': 'cover' }}
                                    />)}
                                    <div>
                                        <Card.Title className="mb-0 fw-bold">{first_name} {last_name}</Card.Title>
                                        <br />
                                        <Card.Subtitle className="text-muted"><GeoAlt className="me-2" /> {address}</Card.Subtitle>
                                        <div className="d-flex align-items-center mt-2">
                                            @   {username}
                                        </div>
                                        <div className="d-flex align-items-center mt-2">
                                            <Telephone className='me-2' />{phone_number}
                                        </div>
                                        <div className="d-flex align-items-center mt-2">
                                            {gender === 'male' ?
                                                (<Button className="m-2" size="sm" variant='primary' style={{ 'borderColor': 'white' }}>
                                                    <GenderMale />
                                                </Button>) :
                                                (<Button className="m-2" size="sm" style={{ 'backgroundColor': 'pink', 'borderColor': 'white' }}>
                                                    <GenderFemale />
                                                </Button>)}
                                        </div>
                                    </div>
                                </div>
                            </Card.Header>
                            <Card.Body className="d-flex justify-content-between">
                                <Button variant="outline-primary">{email}</Button>
                                <Button variant="outline-danger">{birth_date}</Button>
                                <Button variant="outline-success">Assigned Class • {user_class}</Button>
                            </Card.Body>
                        </Card>
                        <Card className="mb-4">
                            <Card.Body>
                                <Card.Title>Teaching Subjects</Card.Title>
                                {teachingSubjects.map(subject => (
                                    <Badge pill bg="primary" className="me-2 mb-2" key={subject.replace(`'`, '').replace(`'`, '')} >
                                        {subject.replace(`'`, '').replace(`'`, '')}
                                    </Badge>
                                ))}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
};

export default TeacherProfile;