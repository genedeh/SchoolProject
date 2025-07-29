import { ListGroup } from "react-bootstrap";
import { BsPersonCircle, BsGenderAmbiguous } from 'react-icons/bs';
import NoProfilePicture from '../../../../../assets/NoProfilePicture.jpg'
import { useMemo } from 'react';    
import './selectpopups.styles.css';

export const UserCardItemComponent = ({ user, clickHandler, selectedDisplay, children }) => {
    const { profile_picture_url, username, gender } = user;
    const optimizedImageUrl = useMemo(() => {
        if (!profile_picture_url || profile_picture_url === null || profile_picture_url.includes("null")) return NoProfilePicture;

        // Example of Cloudinary transformation: q_auto, f_auto, w_100, h_100, c_fill for auto quality, format, size, and crop
        const [baseUrl, publicId] = profile_picture_url.split('/upload/');
        return `${baseUrl}/upload/q_auto,f_auto,w_100,h_100,c_fill/${publicId}`;
    }, [profile_picture_url]);
    return (
        < ListGroup.Item
            className={`user-card d-flex justify-content-between align-items-center mt-2 ${selectedDisplay}`}
            onClick={() => {
                clickHandler(user);
            }}
        >
            <div className="d-flex align-items-center w-100 gap-3">
                {children}
                <div className="avatar">
                    <img
                        src={optimizedImageUrl}
                        className="rounded-circle"
                        alt={username}
                    />
                </div>
                <div className="flex-grow-1">
                    <div className="fw-bold d-flex align-items-center gap-1 text-capitalize">
                        <BsPersonCircle className="text-primary" />
                        {username}
                    </div>
                    <div className="text-muted small d-flex align-items-center gap-1">
                        <BsGenderAmbiguous />
                        {gender}
                    </div>
                </div>
            </div>
        </ListGroup.Item >
    )
};