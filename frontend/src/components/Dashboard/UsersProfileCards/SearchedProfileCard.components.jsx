import { Card, Button, Image, Badge } from "react-bootstrap";
import { BsThreeDots } from "react-icons/bs";
import { useState, useMemo } from 'react';
import { ProfileModal } from './UserProfileModal.components';
import NoProfilePicture from '../../../assets/NoProfilePicture.jpg'
import "./profilecard.styles.css"

const SearchedProfileCard = ({ user }) => {
    const { username, is_student_or_teacher, profile_picture_url, classes, classrooms, is_superuser } = user;
    const [show, setShow] = useState(false);

    const className = useMemo(() => (classes?.length ? classes[0].name : 'None'), [classes]);
    const classroomName = useMemo(() => (classrooms?.name ? classrooms.name : 'None'), [classrooms]);
    // const profilePictureUrl = useMemo(() => (profile_picture_url?.includes('null') ? NoProfilePicture : profile_picture_url), [profile_picture_url]);
    const isStudentOrTeacher = useMemo(() => (is_student_or_teacher ? 'Student' : 'Teacher'), [is_student_or_teacher]);
    const displayName = useMemo(() => (username?.includes('_') ? username?.replace('_', ' ') : username), [username]);

    const optimizedImageUrl = useMemo(() => {
        if (!profile_picture_url || profile_picture_url.includes("null")) return NoProfilePicture;

        // Example of Cloudinary transformation: q_auto, f_auto, w_100, h_100, c_fill for auto quality, format, size, and crop
        const [baseUrl, publicId] = profile_picture_url.split('/upload/');
        return `${baseUrl}/upload/q_auto,f_auto,w_100,h_100,c_fill/${publicId}`;
    }, [profile_picture_url]);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

        const badgeLabel = is_student_or_teacher
        ? 'Student'
        : is_superuser
            ? 'Admin'
            : 'Teacher';

    const badgeColor = is_student_or_teacher
        ? 'primary'
        : is_superuser
            ? 'success'
            : 'danger';


    return (
        <>
            <Card className="profile-card shadow-sm rounded p-3">
                <div className="profile-header d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                        <Image
                            src={optimizedImageUrl}
                            alt="Profile"
                            roundedCircle
                            className="profile-img"
                            loading="lazy"
                            onError={(e) => {
                                e.target.onerror = null; // Prevent infinite loop
                                e.target.src = NoProfilePicture; // Fallback image
                            }}
                        />
                        <div className="ms-3">
                            <h6 className="mb-0">{displayName}</h6>
                            <Badge bg={badgeColor}>{badgeLabel}</Badge>
                        </div>
                    </div>
                    <Button variant="outline-dark" onClick={handleShow}>
                        <BsThreeDots />
                    </Button>
                </div>

                {show && (
                    <ProfileModal
                        user={{ profile_picture_url: optimizedImageUrl, ...user }}
                        handleClose={handleClose}
                        show={show}
                        className={className}
                        classroomName={classroomName}
                    />
                )}
            </Card>
        </>
    );
};
export default SearchedProfileCard;