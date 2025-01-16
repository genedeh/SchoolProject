import { ListGroup } from "react-bootstrap";

export const UserCardItemComponent = ({ user, clickHandler, selectedDisplay }) => (
    <ListGroup.Item className={`d-flex justify-content-between align-items-center container 
                            ${selectedDisplay}`}
        onClick={() => {
            console.log(`clicked ${user.username}`)
            clickHandler(user);
        }}
        >
        <div className="d-flex align-items-center">
            <div className="me-3">
                <img
                    src={!user.profile_picture_url ? ("https://via.placeholder.com/40") : (user.profile_picture_url)}
                    className="rounded-circle"
                    alt={user.username}
                    style={{ width: '40px', height: '40px' }}
                />
            </div>
            <div>
                <div>{user.username}</div>
                <div className="text-muted">{user.gender}</div>
            </div>
        </div>
    </ListGroup.Item>
);