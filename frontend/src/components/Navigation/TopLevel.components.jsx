import { Stack, Form, Image, Button, InputGroup } from 'react-bootstrap'
import { UserContext } from '../../contexts/User.contexts';
import { useContext } from 'react';
import { UsersListContext } from '../../contexts/UsersList.contexts';

const TopLevel = ({ searchHandler, term }) => {
    const { currentUser, setCurrentUser } = useContext(UserContext);
    const { setUsersList } = useContext(UsersListContext);
    const { profile_picture } = currentUser;
    const logoutHandler = () => {
        localStorage.removeItem('token');
        setCurrentUser(null);
        setUsersList([]);
    }
    return (
        <>
            <Stack direction="horizontal" gap={1} className='container-input'>
                <Form.Control className="me-auto" placeholder='Enter Student Or Teacher Username...' value={term} onChange={searchHandler} />
                <Image
                    src={profile_picture ? (profile_picture) : ("http://127.0.0.1:8000/media/default_profile_images/default_image.jpeg")}
                    roundedCircle
                    width="35"
                    height="32"
                    className="me-2 "
                    style={{ 'objectFit': 'cover' }}
                />
                <div>
                    <div><Button onClick={logoutHandler} size='sm' variant="outline-primary">Logout</Button></div>
                </div>

            </Stack>
        </>
    )
};

export default TopLevel;