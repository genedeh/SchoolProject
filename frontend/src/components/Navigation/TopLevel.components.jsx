import { Stack, Form, Image, Button, InputGroup } from 'react-bootstrap'
import { UserContext } from '../../contexts/User.contexts';
import { useContext, useState } from 'react';
import { UsersListContext } from '../../contexts/UsersList.contexts';
import { Search } from 'react-bootstrap-icons';

const TopLevel = ({ searchHandler, term }) => {
    const { currentUser, setCurrentUser } = useContext(UserContext);
    const { setUsersList } = useContext(UsersListContext);
    const { profile_picture } = currentUser;
    const [searchTerm, setSearchTerm] = useState(term);

    const changeSearchTerm = (e) => {
        setSearchTerm(e.target.value.replace(/ /g, ""))
    }
    const logoutHandler = () => {
        localStorage.removeItem('token');
        setCurrentUser(null);
        setUsersList([]);
    }
    return (
        <>
            <Stack direction="horizontal" gap={1} className='container-input'>
                <InputGroup >
                    <Form.Control className="me-auto" placeholder='Enter Student Or Teacher Username...' value={searchTerm} onChange={changeSearchTerm} />
                    <Button variant='outline-primary' onClick={() => searchHandler(searchTerm)}>
                        <Search className='me-2' />
                    </Button>
                </InputGroup>
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