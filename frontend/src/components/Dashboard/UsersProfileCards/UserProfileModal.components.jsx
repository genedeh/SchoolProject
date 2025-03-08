import React, { useEffect, useState } from "react";
import { Modal, Button, Image, Badge, Card, Alert, Form } from "react-bootstrap";
import { useUser } from "../../../contexts/User.contexts";
import { FaPencilAlt } from "react-icons/fa";
import { useMutation, useQueryClient } from "react-query";
import { CenteredSpinner } from '../../Loading/CenteredSpinner.components';
import axios from "axios";


export const ProfileModal = ({ user, show, handleClose, className, classroomName }) => {
    const token = localStorage.getItem("token")
    const queryClient = useQueryClient()
    const { currentUser } = useUser();
    const { username, is_student_or_teacher, profile_picture_url, subjects, subject, birth_date, is_superuser } = user;
    const current_date = new Date();

    const [isEditMode, setIsEditMode] = useState(false);
    const [formData, setFormData] = useState({ ...user, });
    const [error, setError] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [displayProfilePicture, setDisplayProfilePicture] = useState(null);
    console.log(user)


    if (!token) {
        throw new Error("Authentication token is missing!");
    }

    const toggleEditMode = () => {
        setIsEditMode(!isEditMode);
        setError(null);
    };

    // Mutation for updating user
    const { mutate: updateUser, isLoading: isUpdating } = useMutation(
        async (updatedData) => {
            const response = await axios.put(`/api/users/${user.id}/`, updatedData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`
                    },
                }
            );
            return response.data;
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["users"]); // Refresh user data
                setIsEditMode(false);
                handleClose(); // Close modal on success
            },
            onError: (err) => {
                setError(err.response?.data?.message || "Failed to update user");
            },
        }
    );

    // Mutation for deleting user
    const { mutate: deleteUser, isLoading: isDeleting } = useMutation(
        async () => {
            await axios.delete(`/api/users/${user.id}/`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(["users"]); // Refresh user data
                handleClose(); // Close modal on success
            },
            onError: (err) => {
                setError(err.response?.data?.message || "Failed to delete user");
            },
        }
    );

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file)
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setDisplayProfilePicture(reader.result); // Display selected image
                setFormData({ ...formData, 'profile_picture': file });
            };
            reader.readAsDataURL(file);
        }
        if (!selectedFile) return;
    };

    const validatePhoneNumber = (number) => {
        const nigerianPhoneRegex = /^(070|080|081|090|091)\d{8}$/;
        return nigerianPhoneRegex.test(number);
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name == "password" && value.length == 0) {
            console.log("Gone")
            delete formData["password"]
        }
        else {
            setFormData({ ...formData, [name]: value });
        }
    };

    useEffect(() => {
        setFormData({ ...formData, 'username': `${formData.first_name}_${formData.last_name}` })
    }, [formData.first_name, formData.last_name])


    const handleSave = (e) => {
        e.preventDefault()
        delete formData["classes"]
        delete formData["classrooms"]
        delete formData["id"]
        delete formData["subject"]
        delete formData["subjects"]
        delete formData["profile_picture_url"]
        delete formData["is_student_or_teacher"]
        delete formData["is_superuser"]
        if (validatePhoneNumber(formData.phone_number)) {
            updateUser(formData);
        } else {
            setError("Invalid Nigerian Phone Number")
        }
    };

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            deleteUser();
        }
    };

    return (
        <Modal show={show} onHide={() => {
            handleClose();
            setIsEditMode();
        }} centered size="lg" style={{ 'borderRadius': '1rem' }}>
            <Modal.Header closeButton>
                <Modal.Title>{isEditMode ? "Edit User" : "User Profile"}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center" style={{ backgroundColor: 'white' }}>
                <div className="position-relative d-inline-block">
                    <Image
                        src={isEditMode ? (!displayProfilePicture ? profile_picture_url : displayProfilePicture) : (profile_picture_url)}
                        roundedCircle
                        style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                        className="mb-3" />
                    {isEditMode && (
                        <>
                            <Button
                                variant="light"
                                className="position-absolute top-50 start-50 translate-middle"
                                style={{
                                    width: "40px",
                                    height: "40px",
                                    borderRadius: "50%",
                                    padding: "0",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    backgroundColor: "#ffffff",
                                    boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                                }}
                                onClick={() => document.getElementById('fileInput').click()}

                            >
                                <FaPencilAlt color="#007bff" />
                            </Button>
                            <input
                                type="file"
                                id="fileInput"
                                accept="image/*"
                                onChange={handleFileChange}
                                style={{ display: 'none' }}

                            />
                        </>
                    )}
                </div>
                <h4>{username.replace('_', ' ')}</h4>
                <h5 className="text-muted">{is_student_or_teacher ? (
                    <Badge bg="primary">Student</Badge>
                ) :
                    (is_superuser ? <Badge bg="success">Admin</Badge>
                        : <Badge bg="danger">Teacher</Badge>)}</h5>
                <h4 className="text-muted fw-bold">Age • {current_date.getFullYear() - Number(birth_date.split('-')[0])}</h4>
                <p className='fw-bold text-muted'>{is_student_or_teacher ? (`Class • ${className}`) : (`Assigned Class • ${classroomName}`)}</p>
                <Card className="mb-4 border-1 border-primary">
                    <Card.Body>
                        <Card.Title>{is_student_or_teacher ? ("Offering Subjects") : ('Teaching Subjects')}</Card.Title>
                        {subjects.length !== 0 ? (
                            subjects.map(({ name, id }) => (
                                <Badge pill bg="primary" key={id} className="me-2 mb-2" >
                                    {name.replace(`'`, '').replace(`'`, '')}
                                </Badge>
                            ))) : (
                            subject.map(({ name, id }) => (
                                <Badge pill bg="primary" key={id} className="me-2 mb-2" >
                                    {name.replace(`'`, '').replace(`'`, '')}
                                </Badge>
                            ))
                        )}
                    </Card.Body>
                </Card>
                <hr />
                {isUpdating || isDeleting ? (
                    <CenteredSpinner caption="Loading" />
                ) : (
                    <Form onSubmit={handleSave}>
                        <Form.Group className="mb-3">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleInputChange}
                                disabled={!isEditMode}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleInputChange}
                                disabled={!isEditMode}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                disabled={!isEditMode}
                                required
                            />
                        </Form.Group>
                        {isEditMode && (
                            <Form.Group className="mb-3">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    placeholder="Enter new password"
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                        )}
                        <Form.Group className="mb-3">
                            <Form.Label>Address</Form.Label>
                            <Form.Control
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                disabled={!isEditMode}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control
                                type="text"
                                name="phone_number"
                                value={formData.phone_number}
                                onChange={handleInputChange}
                                disabled={!isEditMode}
                                required
                            />
                            <hr />
                            {error && <Alert variant="danger">{error}</Alert>}
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Date of Birth</Form.Label>
                            <Form.Control
                                type="date"
                                name="birth_date"
                                value={formData.birth_date}
                                onChange={handleInputChange}
                                disabled={!isEditMode}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Gender</Form.Label>
                            <Form.Select
                                name="gender"
                                value={formData.gender}
                                onChange={handleInputChange}
                                disabled={!isEditMode}
                                required
                            >
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </Form.Select>
                        </Form.Group>
                        <div className="d-grid gap-2 m-4">
                            {isEditMode &&
                                <Button variant="success" className="lg" type="submit" disabled={isUpdating}>
                                    Save Changes
                                </Button>}
                        </div>
                    </Form>
                )}

                <hr />
            </Modal.Body>
            <Modal.Footer>
                {!currentUser.is_student_or_teacher ?
                    (
                        currentUser.user_class === className || currentUser.is_admin ? (
                            <>
                                {!isEditMode &&
                                    <Button onClick={toggleEditMode}>
                                        Edit
                                    </Button>
                                }
                                <Button variant="danger" onClick={handleDelete} disabled={isDeleting}>
                                    Delete
                                </Button>
                            </>
                        ) : ('')
                    )
                    : ('')}
                <Button variant="secondary" onClick={() => {
                    handleClose();
                    setIsEditMode();
                }}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

