import { Card, Button, Image, Badge } from "react-bootstrap";
import { BsThreeDots } from "react-icons/bs";
import { useState } from 'react';
import { ProfileModal } from './UserProfileModal.components';
import NoProfilePicture from '../../../assets/NoProfilePicture.jpg'
import "./profilecard.styles.css"

const SearchedProfileCard = ({ user }) => {
    const { username, is_student_or_teacher, profile_picture_url, classes, classrooms, is_superuser } = user;
    const [show, setShow] = useState(false);
    let className = "None"
    let classroomName = "None"
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    if (classes.length !== 0) {
        const dummy = classes[0]
        className = dummy.name
    }
    if (classrooms) {
        classroomName = classrooms.name
    }

    return (
        <>
            <Card className="profile-card shadow-sm rounded p-3">
                <div className="profile-header d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                        <Image
                            src={profile_picture_url.includes('null') ? NoProfilePicture : profile_picture_url}
                            alt="Profile"
                            roundedCircle
                            className="profile-img"
                        />
                        <div className="ms-3">
                            <h6 className="mb-0">{username.replace('_', ' ')}</h6>
                            <Badge bg={is_student_or_teacher ? "primary" : is_superuser ? "success" : "danger"}>
                                {is_student_or_teacher ? "Student" : is_superuser ? "Admin" : "Teacher"}
                            </Badge>
                        </div>
                    </div>
                    <Button variant="outline-dark" className="profile-action-btn" onClick={handleShow}>
                        <BsThreeDots />
                    </Button>
                </div>

                {/* Modal */}
                <ProfileModal user={user} handleClose={handleClose} show={show} className={className} classroomName={classroomName} />
            </Card>
        </>
    );
}

export default SearchedProfileCard;