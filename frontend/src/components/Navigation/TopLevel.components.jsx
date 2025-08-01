import { Stack, Form, Image, Button, InputGroup } from 'react-bootstrap'
import { useUser } from '../../contexts/User.contexts';
import NoProfilePicture from '../../assets/NoProfilePicture.jpg'
import { useState } from 'react';
import { Search } from 'react-bootstrap-icons';
import logo from '../../assets/logo512.png'

const TopLevel = ({ searchHandler, term }) => {
    const { currentUser, setCurrentUser } = useUser();
    const [searchTerm, setSearchTerm] = useState(term);
    const { profile_picture } = currentUser;

    const changeSearchTerm = (e) => {
        setSearchTerm(e.target.value.replace(/ /g, ""))
    }
    const logoutHandler = () => {
        localStorage.removeItem('token');
        setCurrentUser(null);
    }
    return (
        <>
            <Stack direction="horizontal" gap={1} className="container-input align-items-center">
                {/* Placeholder for Logo */}
                <div className="logo-container me-2" style={{ flex: 1 }}>
                    <Image
                        src={logo} // Replace with the actual path to your logo
                        alt="Logo"
                        className="logo-image"
                        loading="lazy"
                        width="50"
                        height="45"
                        style={{
                            maxWidth: '120px', // Set appropriate width for your logo
                            objectFit: 'cover',
                            height: 'auto',
                        }}
                    />
                </div>

                <InputGroup className="w-100">
                    <Form.Control
                        className="me-auto"
                        placeholder="Enter Student Or Teacher Username..."
                        value={searchTerm}
                        onChange={changeSearchTerm}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                searchHandler(searchTerm)
                            }
                        }}
                    />
                    <Button variant="outline-primary" className="custom-btn" onClick={() => searchHandler(searchTerm)}>
                        <Search className="me-2" />
                    </Button>
                </InputGroup>

                <Image
                    src={!profile_picture || profile_picture === 'null' || profile_picture.endsWith('null')
                        ? NoProfilePicture
                        : profile_picture}
                    loading="lazy"
                    className="me-2 responsive-profile-img"
                    alt="Profile Picture"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = NoProfilePicture;
                    }}
                    style={{
                        objectFit: 'cover',
                        border: '2px solid var(--color-primary)',
                        borderRadius: '50%',
                    }}
                />


                <div>
                    <Button onClick={logoutHandler} size="sm" variant="outline-primary" className="custom-btn">
                        Logout
                    </Button>
                </div>
            </Stack>

        </>
    )
};

export default TopLevel;