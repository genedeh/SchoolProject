import React from "react";
import { Card, ListGroup, Badge, Row, Col } from "react-bootstrap";
import ProfilePicture from "../../../images/ProfilePictureImage.images";

// Profile Header Component
export const ProfileHeader = ({ profile_picture, first_name, last_name, address, user_class }) => {
    return (
        <Card className="p-4 d-flex flex-row align-items-center">
            <Row>
                <Col md={6}>
                    <ProfilePicture profilePicture={profile_picture} />
                </Col>
                <Col md={6}>
                    <div>
                        <h4 className="mb-1">{first_name} {last_name}</h4>
                        <p className="text-muted mb-1">{address}</p>
                        <div className="d-flex gap-2">
                            <button className="btn btn-light text-bold">{user_class}</button>
                        </div>
                    </div>
                </Col>
            </Row>
        </Card >
    );
};

// Info Card Component
export const InfoCard = ({ admission_number, birth_date, blood_group, boarding_status, disability_status, email, gender, genotype, home_town, local_government_area, parent_guardian_name, parent_guardian_email, parent_guardian_phone, phone_number, religion, is_student_or_teacher, is_superuser }) => {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };
    return (
        <Card className="p-3">
            <h6 className="text-muted">Personal Info</h6>
            <ListGroup variant="flush">
                <ListGroup.Item><strong>Date of Birth:</strong> {formatDate(birth_date)}</ListGroup.Item>
                <ListGroup.Item><strong>Blood Type:</strong> {blood_group || "No record"}</ListGroup.Item>
                <ListGroup.Item><strong>Geno Type:</strong> {genotype || "No record"}</ListGroup.Item>
                <ListGroup.Item><strong>Phone Number:</strong> {phone_number}</ListGroup.Item>
                <ListGroup.Item><strong>Email:</strong> {email}</ListGroup.Item>
                <ListGroup.Item><strong>Disability Status:</strong> {disability_status || "No record"}</ListGroup.Item>
                <ListGroup.Item><strong>Gender:</strong> {gender.toLocaleUpperCase()}</ListGroup.Item>
                <ListGroup.Item><strong>Home Town:</strong> {home_town || "No record"}</ListGroup.Item>
                <ListGroup.Item><strong>LGA:</strong> {local_government_area || "No record"}</ListGroup.Item>
                <ListGroup.Item><strong>Religion:</strong> {religion || "No record"}</ListGroup.Item>
                {is_student_or_teacher &&
                    <>
                        <ListGroup.Item><strong>Boarding Status:</strong> {boarding_status}</ListGroup.Item>
                        <ListGroup.Item><strong>Admission Number:</strong> {admission_number || "No record"}</ListGroup.Item>
                        <ListGroup.Item><strong>Parent Guardian Name:</strong> {parent_guardian_name || "No record"}</ListGroup.Item>
                        <ListGroup.Item><strong>Parent Guardian Email:</strong> {parent_guardian_email || "No record"}</ListGroup.Item>
                        <ListGroup.Item><strong>Parent Guardian Phone Number:</strong> {parent_guardian_phone || "No record"}</ListGroup.Item>
                    </>
                }
            </ListGroup>

        </Card>
    );
};



const SessionCard = ({ session }) => {
    return (
        <Card className="mb-3 shadow-sm rounded border-1">
            <Card.Body>
                <Card.Title className="text-dark">{session} Session</Card.Title>
            </Card.Body>
        </Card>
    );
};

const SubjectCard = ({ subject }) => {
    return (
        <Card className="mb-3 shadow-sm rounded border-1">
            <Card.Body>
                <Card.Title className="d-flex justify-content-between align-items-center">
                    <Badge bg="success">{subject}</Badge>
                </Card.Title>
            </Card.Body>
        </Card>
    );
};

// Documents Section
export const DocumentsSection = ({ is_student_or_teacher, migrated_sessions, offering_subjects, teaching_subjects }) => {
    return (
        <Card className="p-3">
            <div className="py-4">
                {is_student_or_teacher ? (
                    <>
                        <h3 className="text-center text-primary mb-4">Sessions & Subjects</h3>

                        {/* Sessions Section */}
                        <h4 className="text-secondary">Migrated Sessions</h4>
                        <Row>
                            {migrated_sessions.map((session) => (
                                <Col key={session}>
                                    <SessionCard session={session} />
                                </Col>
                            ))}
                        </Row>

                        {/* Subjects Section */}
                        <h4 className="text-secondary mt-4">Offering Subjects</h4>
                        <Row>
                            {offering_subjects.map((subject) => (
                                <Col key={subject}>
                                    <SubjectCard subject={subject} />
                                </Col>
                            ))}
                        </Row>
                    </>
                ) : (
                    <>
                        <h4 className="text-secondary mt-4">Teaching Subjects</h4>
                        <br />
                        <Row>
                            {teaching_subjects.map((subject) => (
                                <Col key={subject}>
                                    <SubjectCard subject={subject} />
                                </Col>
                            ))}
                        </Row>
                    </>
                )}
            </div>
        </Card>
    );
};

