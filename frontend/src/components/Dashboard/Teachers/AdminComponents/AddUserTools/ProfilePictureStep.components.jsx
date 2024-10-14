import { useEffect, useState } from "react";
import { Image, Modal, Button, Form , ButtonGroup} from 'react-bootstrap';
import { Trash, Pencil } from "react-bootstrap-icons";

export const ProfilePictureStep = ({ formData, updateFormData, nextStep, prevStep }) => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [displayProfilePicture, setDisplayProfilePicture] = useState(null);

    // Handle file change event for updating the profile picture
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file)
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setDisplayProfilePicture(reader.result); // Display selected image
                updateFormData('profile_picture', file);
            };
            reader.readAsDataURL(file);
        }
        if (!selectedFile) return;
    };

    useEffect(() => {
        if (formData.profile_picture) {
            setSelectedFile(formData.profile_picture)
            const reader = new FileReader();
            reader.onload = () => {
                setDisplayProfilePicture(reader.result);
            };
            reader.readAsDataURL(formData.profile_picture);
        }
    },[])

    // Handle delete picture
    const handleDeletePicture = () => {
        updateFormData('profile_picture', null)
        setDisplayProfilePicture(null)
        setShowDeleteModal(false);
    };

    return (
        <Form className="m-5" >
            <div className="me-3">
                <Image
                    src={
                        displayProfilePicture ||
                        'http://127.0.0.1:8000/media/default_profile_images/default_image.jpeg' // Default placeholder image
                    }
                    roundedCircle
                    style={{ width: '200px', height: '200px', objectFit: 'cover' }}
                    className="mb-5"
                    alt="Profile"
                />
            </div>

            <ButtonGroup size="lg">
                <Button variant="outline-primary" className="me-2" onClick={() => document.getElementById('fileInput').click()}>
                    Change Profile Picture <Pencil />
                </Button>
                <Button variant="outline-danger" className="me-2" onClick={() => setShowDeleteModal(true)}>
                    Remove Profile Picture <Trash />
                </Button>
                

                <input
                    type="file"
                    id="fileInput"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                />
            </ButtonGroup>

            {/* Delete confirmation modal */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete Picture</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete your profile picture?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDeletePicture}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>

            <div className="d-flex justify-content-between mt-4">
                <Button variant="secondary" onClick={prevStep}>
                    Back
                </Button>
                <Button variant="primary" onClick={nextStep}>
                    Next
                </Button>
            </div>
        </Form>
    );
};
