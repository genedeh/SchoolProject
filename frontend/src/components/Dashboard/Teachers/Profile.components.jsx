import { useEffect, useState } from "react";
import { useUser } from "../../../contexts/User.contexts";
import { Container, Card, Row, Col, Button, Badge } from 'react-bootstrap';
import { GenderFemale, GenderMale, Telephone, GeoAlt } from "react-bootstrap-icons";
import { ProfileHeader, ScheduleTable, InfoCard, DocumentsSection, ColleaguesList } from "../ProfileTools/ProfileTools.components";
import axios from "axios";
import { Navigate } from "react-router-dom";
import ProfilePicture from "../../../images/ProfilePictureImage.images";

const TeacherProfile = () => {
    const { currentUser } = useUser();
    const { first_name, last_name, username, address, profile_picture, user_class, teaching_subjects,
        admission_number,
        birth_date, blood_group, boarding_status, disability_status, email, gender, genotype, home_town, local_government_area, migrated_sessions,
        nationality, parent_guardian_name, parent_guardian_email, parent_guardian_phone, phone_number, religion, is_student_or_teacher, is_superuser
    } = currentUser;


    if (!currentUser.is_student_or_teacher && currentUser) {
        return (
            <>
                <Container fluid className="p-4">
                    <Row>
                        <Col md={8}>
                            <ProfileHeader profile_picture={profile_picture} first_name={first_name} last_name={last_name} address={address} user_class={user_class} />
                            <hr />
                            <InfoCard admission_number={admission_number} birth_date={birth_date} blood_group={blood_group} boarding_status={boarding_status} disability_status={disability_status} email={email}
                                gender={gender} genotype={genotype} home_town={home_town} local_government_area={local_government_area} nationality={nationality} parent_guardian_email={parent_guardian_email}
                                parent_guardian_name={parent_guardian_name} parent_guardian_phone={parent_guardian_phone} phone_number={phone_number} religion={religion} is_student_or_teacher={is_student_or_teacher} is_superuser={is_superuser}
                            />
                        </Col>
                        <Col md={4}>
                            <ScheduleTable className="mt-3" />
                            <DocumentsSection className="mt-3" />
                            <ColleaguesList className="mt-3" />
                        </Col>
                    </Row>
                </Container>
            </>
        );
    } return (
        <Navigate to='/dashboard/home' />
    );
};

export default TeacherProfile;