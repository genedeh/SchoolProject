import { ListGroup } from "react-bootstrap";
import { BsPersonCircle, BsGenderAmbiguous } from 'react-icons/bs';
import './selectpopups.styles.css';

export const UserCardItemComponent = ({ user, clickHandler, selectedDisplay, children }) => (
    < ListGroup.Item
        className={`user-card d-flex justify-content-between align-items-center mt-2 ${selectedDisplay}`}
        onClick={() => {
            console.log(`clicked ${user.username}`);
            clickHandler(user);
        }}
    >
        <div className="d-flex align-items-center w-100 gap-3">
            {children}
            <div className="avatar">
                <img
                    src={user.profile_picture_url || 'https://via.placeholder.com/40'}
                    className="rounded-circle"
                    alt={user.username}
                />
            </div>
            <div className="flex-grow-1">
                <div className="fw-bold d-flex align-items-center gap-1">
                    <BsPersonCircle className="text-primary" />
                    {user.username}
                </div>
                <div className="text-muted small d-flex align-items-center gap-1">
                    <BsGenderAmbiguous />
                    {user.gender}
                </div>
            </div>
        </div>
    </ListGroup.Item >
);