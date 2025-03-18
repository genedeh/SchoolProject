import React from "react";
import { Card, Table, ProgressBar, Image, ListGroup, Badge, Container, Row, Col } from "react-bootstrap";
import { Pencil, Link45deg } from "react-bootstrap-icons";
import ProfilePicture from "../../../images/ProfilePictureImage.images";

// Profile Header Component
export const ProfileHeader = ({ profile_picture, first_name, last_name, address, user_class }) => {
    return (
        <Card className="p-4 d-flex flex-row align-items-center">
            <ProfilePicture profilePicture={profile_picture} />
            <div>
                <h4 className="mb-1">{first_name} {last_name}</h4>
                <p className="text-muted mb-1">{address}</p>
                <div className="d-flex gap-2">
                    <button className="btn btn-light text-bold">{user_class}</button>
                </div>
            </div>
        </Card >
    );
};

// Info Card Component
export const InfoCard = ({ admission_number, birth_date, blood_group, boarding_status, disability_status, email, gender, genotype, home_town, local_government_area, nationality, parent_guardian_name, parent_guardian_email, parent_guardian_phone, phone_number, religion, is_student_or_teacher, is_superuser }) => {
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
                <ListGroup.Item><strong>Nationality:</strong> {nationality || "No record"}</ListGroup.Item>
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

// Schedule Table Component
export const ScheduleTable = () => {
    return (
        <Card className="p-3">
            <h6>Schedule</h6>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Time</th>
                        <th>Monday</th>
                        <th>Tuesday</th>
                        <th>Wednesday</th>
                        <th>Thursday</th>
                        <th>Friday</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>09:00</td>
                        <td>Room A100</td>
                        <td>Room A101</td>
                        <td>Room A102</td>
                        <td>Room A103</td>
                        <td>Room A104</td>
                    </tr>
                    <tr>
                        <td>10:00</td>
                        <td>Room B200</td>
                        <td>Room B201</td>
                        <td>Room B202</td>
                        <td>Room B203</td>
                        <td>Room B204</td>
                    </tr>
                </tbody>
            </Table>
        </Card>
    );
};


// Documents Section
export const DocumentsSection = () => {
    return (
        <Card className="p-3">
            <h6>Documents</h6>
            <div className="d-flex flex-wrap gap-2">
                <Badge pill bg="secondary">Birth Certificate</Badge>
                <Badge pill bg="primary">Form 100</Badge>
                <Badge pill bg="warning">Contract</Badge>
            </div>
        </Card>
    );
};

// Colleagues List Component
export const ColleaguesList = () => {
    return (
        <Card className="p-3">
            <h6>Colleagues</h6>
            <div className="d-flex gap-2">
                <Image src="https://via.placeholder.com/40" roundedCircle />
                <Image src="https://via.placeholder.com/40" roundedCircle />
                <Image src="https://via.placeholder.com/40" roundedCircle />
            </div>
        </Card>
    );
};

