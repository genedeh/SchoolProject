import { useState } from "react";
import { Image, Modal, Button, Form } from 'react-bootstrap';
import { Trash, Pencil } from "react-bootstrap-icons";

export const ProfilePictureStep = ({ formData, updateFormData, nextStep, prevStep }) => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Handle file change event for updating the profile picture
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                updateFormData('profile_picture', reader.result); // Display selected image
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle delete picture
    const handleDeletePicture = () => {
        updateFormData('profile_picture', null)
        setShowDeleteModal(false);
    };

    return (
        <Form className="m-5" >
            <div className="me-3">
                <Image
                    src={
                        formData.profile_picture ||
                        'http://127.0.0.1:8000/media/default_profile_images/default_image.jpeg' // Default placeholder image
                    }
                    roundedCircle
                    style={{ width: '200px', height: '200px', objectFit: 'cover' }}
                    className="mb-5"
                    alt="Profile"
                />
            </div>

            <div >
                <Button variant="primary" className="me-2" onClick={() => document.getElementById('fileInput').click()}>
                    Change Profile Picture <Pencil />
                </Button>

                <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
                    Remove Profile Picture <Trash />
                </Button>

                <input
                    type="file"
                    id="fileInput"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                />
            </div>

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
                    Continue
                </Button>
            </div>
        </Form>
    );
};
