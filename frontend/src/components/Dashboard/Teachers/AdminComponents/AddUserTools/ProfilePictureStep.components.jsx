import { useEffect, useState } from "react";
import { Image, Button, Modal } from "react-bootstrap";
import { Pencil, Trash } from "react-bootstrap-icons";
import './AddUser.styles.css';
import NoProfilePicture from '../../../../../assets/NoProfilePicture.jpg';

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
    }, [])

    // Handle delete picture
    const handleDeletePicture = () => {
        updateFormData('profile_picture', null)
        setDisplayProfilePicture(null)
        setShowDeleteModal(false);
    };

    return (
        <>
            <div className="profile-container">
                {/* Profile Picture Container */}
                <div className="profile-picture-wrapper">
                    <Image
                        src={displayProfilePicture || NoProfilePicture}
                        roundedCircle
                        className="profile-image"
                        alt="Profile"
                    />

                    {/* Edit Icon */}
                    <div className="edit-icon" onClick={() => document.getElementById("fileInput").click()}>
                        <Pencil size={20} />
                    </div>
                </div>

                {/* Hidden File Input */}
                <input
                    type="file"
                    id="fileInput"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                />

                {/* Remove Button */}
                <Button variant="outline-danger m-3" onClick={() => setShowDeleteModal(true)}>
                    <Trash className="" />
                </Button>

                {/* Delete Confirmation Modal */}
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


            </div>
            {/* Navigation Buttons */}
            <div className="d-flex justify-content-between footer">
                <Button variant="secondary" onClick={prevStep}>
                    Back
                </Button>
                <Button variant="primary" onClick={nextStep}>
                    Next
                </Button>
            </div>
        </ >
    );
};
