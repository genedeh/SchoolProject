import React, { useState, useMemo } from "react";
import { Card, Badge, Image } from "react-bootstrap";
import { ProfileModal } from './UserProfileModal.components';
import NoProfilePicture from '../../../assets/NoProfilePicture.jpg'
import "./profilecard.styles.css"
import { useUser } from "../../../contexts/User.contexts";

const SearchedProfileCard = ({ user }) => {
    const { username, is_student_or_teacher, profile_picture_url, classes, classrooms, is_superuser } = user;
    const { currentUser } = useUser();
    const [show, setShow] = useState(false);

    const className = useMemo(() => (classes?.length ? classes[0].name : ''), [classes]);
    const classroomName = useMemo(() => (classrooms?.name ? classrooms.name : ''), [classrooms]);
    const displayName = useMemo(() => (username?.includes('_') ? username?.replace('_', ' ') : username), [username]);

    const optimizedImageUrl = useMemo(() => {
        if (!profile_picture_url || profile_picture_url === "null") return NoProfilePicture;
        const [baseUrl, publicId] = profile_picture_url.split('/upload/');
        if (!baseUrl || !publicId) return NoProfilePicture;
        return `${baseUrl}/upload/q_auto,f_auto,w_100,h_100,c_fill/${publicId}`;
    }, [profile_picture_url]);


    const handleShow = () => {
        if (currentUser.is_superuser) {
            setShow(true)
        } else {
            alert("You need to be an admin to see personal information of users.")
        }
    };
    const handleClose = () => setShow(false);

    return (
        <>
            <Card className="text-center p-3 shadow-sm profile-box" onClick={handleShow} style={{ cursor: 'pointer', borderRadius: "12px" }}>
                <div className="d-flex flex-column align-items-center">
                    <Image
                        src={optimizedImageUrl}
                        alt="Profile"
                        roundedCircle
                        className="mb-3"
                        width="80"
                        height="80"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = NoProfilePicture;
                        }}
                        style={{
                            objectFit: 'contain',
                            border: '2px solid var(--color-primary)',
                            borderRadius: '50%',
                        }}
                    />
                    <h6 className="fw-bold mb-1">{displayName}</h6>
                    <p className="text-muted mb-1">{classroomName || className || "No class"}</p>
                    <div className="my-2">
                        {is_student_or_teacher ? (
                            <Badge bg="primary">Student</Badge>
                        ) : is_superuser ? (
                            <Badge bg="success">Admin</Badge>
                        ) : (
                            <Badge bg="danger">Teacher</Badge>
                        )}
                    </div>
                    <div className="text-muted" style={{ fontSize: '0.85rem' }}>
                        @{username}
                    </div>
                </div>
            </Card>

            {show && (
                <ProfileModal
                    user={{ profile_picture_url: optimizedImageUrl, ...user }}
                    handleClose={handleClose}
                    show={show}
                    className={className}
                    classroomName={classroomName}
                />
            )}
        </>
    );
};

export default SearchedProfileCard;
