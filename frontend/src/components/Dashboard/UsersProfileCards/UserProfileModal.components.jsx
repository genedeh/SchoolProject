import React, { useEffect, useState } from "react";
import { Modal, Button, Form, InputGroup, Row, Col, Image, Badge, Card } from 'react-bootstrap';
import {
    FaUser,
    FaEnvelope,
    FaLock,
    FaMapMarkerAlt,
    FaPhone,
    FaBirthdayCake,
    FaCity,
    FaFlag,
    FaPrayingHands,
    FaTint,
    FaVial,
    FaAccessibleIcon,
    FaSchool,
    FaIdBadge,
    FaVenusMars,
    FaUserFriends,
    FaPencilAlt,
} from "react-icons/fa"; import { useUser } from "../../../contexts/User.contexts";
import { useMutation, useQueryClient } from "react-query";
import { CenteredSpinner } from '../../Loading/CenteredSpinner.components';
import { ErrorAlert } from '../../Alerts/ErrorAlert.components';
import { ErrorMessageHandling } from '../../../utils/ErrorHandler.utils'
import { STATESWITHLGAs } from '../../../utils/predefinedInformation.utils'
import NoProfilePicture from '../../../assets/NoProfilePicture.jpg'
import axios from "axios";

const iconMap = {
    first_name: <FaUser />,
    last_name: <FaUser />,
    email: <FaEnvelope />,
    password: <FaLock />,
    address: <FaMapMarkerAlt />,
    phone_number: <FaPhone />,
    birth_date: <FaBirthdayCake />,
    admission_number: <FaIdBadge />,
    parent_guardian_name: <FaUserFriends />,
    parent_guardian_phone: <FaPhone />,
    parent_guardian_email: <FaEnvelope />,
    home_town: <FaCity />,
    state_of_origin: <FaMapMarkerAlt />,
    local_government_area: <FaMapMarkerAlt />,
    nationality: <FaFlag />,
    religion: <FaPrayingHands />,
    blood_group: <FaTint />,
    genotype: <FaVial />,
    disability_status: <FaAccessibleIcon />,
    boarding_status: <FaSchool />,
    nin: <FaIdBadge />,
    gender: <FaVenusMars />,
};



export const ProfileModal = ({ user, show, handleClose, className, classroomName }) => {
    const token = localStorage.getItem("token")
    const queryClient = useQueryClient()
    const { currentUser } = useUser();
    const { username, is_student_or_teacher, profile_picture_url, subjects, subject, birth_date, is_superuser } = user
    const current_date = new Date();

    const [isEditMode, setIsEditMode] = useState(false);
    const [formData, setFormData] = useState({ ...user, });
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedState, setSelectedState] = useState(formData.state_of_origin || '');
    const [localGovernments, setLocalGovernments] = useState([]);
    const [displayProfilePicture, setDisplayProfilePicture] = useState(null);


    if (!token) {
        throw new Error("Authentication token is missing!");
    }

    const toggleEditMode = () => {
        setIsEditMode(!isEditMode);
    };


    const renderInputGroup = (label, name, type = "text", as = "input", options = []) => (
        <Form.Group className="mb-3 grid-input">
            <Form.Label>{label}</Form.Label>
            <InputGroup>
                <InputGroup.Text>{iconMap[name]}</InputGroup.Text>
                {as === 'input' && type === "password" && (
                    <Form.Control
                        type={type}
                        name={name}
                        value={formData[name]}
                        onChange={handleInputChange}
                        disabled={!isEditMode}
                    />
                )}
                {as === "input" && type !== "password" && (
                    <Form.Control
                        type={type}
                        name={name}
                        placeholder={label ? `Enter ${label === "Disability Status" ? `Enter ${label} (None if not recorded)` : label}` : ""}
                        value={formData[name]}
                        onChange={handleInputChange}
                        disabled={!isEditMode}
                        required
                    />
                )}
                {as === "select" && (
                    <Form.Select
                        name={name}
                        value={formData[name]}
                        onChange={handleInputChange}
                        disabled={!isEditMode}
                        required
                    >
                        <option value="">Select {label}</option>
                        {options.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </Form.Select>
                )}
            </InputGroup>
        </Form.Group>
    );

    // Mutation for updating user
    const { mutate: updateUser, isLoading: isUpdating, error, isError } = useMutation(
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
            }
        }
    );

    // Mutation for deleting user
    const { mutate: deleteUser, isLoading: isDeleting, isError: isErrorDeleting, error: deletingError } = useMutation(
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
        if (name === "password" && value.length === 0) {
            delete formData["password"]
        }
        else {
            setFormData({ ...formData, [name]: value });
        }
    };

    useEffect(() => {
        setFormData({ ...formData, 'username': `${formData.first_name}_${formData.last_name}` })
    }, [formData])
    useEffect(() => {
        // Reset local government area when state changes
        setLocalGovernments(STATESWITHLGAs[formData.state_of_origin] || []);
    }
        , [formData.state_of_origin]);


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
        updateUser(formData);

    };

    // Handle state change and update LGAs
    const handleStateChange = (e) => {
        const state = e.target.value;
        setSelectedState(state);
        handleInputChange(e);
    };

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            deleteUser();
        }
    };

    return (
        <Modal
            show={show}
            onHide={() => {
                handleClose();
                setIsEditMode();
            }}

            fullscreen
            className="rounded-modal"
        >
            <Modal.Header closeButton className="bg-light border-0 rounded-top">
                <Modal.Title className="fw-bold">{isEditMode ? "Edit User" : "User Profile"}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-4 bg-white rounded-bottom">
                <div className="text-center mb-4 position-relative">
                    {isError && <ErrorAlert heading="User Update Error" message={ErrorMessageHandling(isError, error)} />}
                    {isErrorDeleting && <ErrorAlert heading="User Deletion Error" message={ErrorMessageHandling(isErrorDeleting, deletingError)} />}

                    <div className="position-relative d-inline-block">
                        <Image
                            src={
                                isEditMode
                                    ? (!displayProfilePicture
                                        ? (!profile_picture_url || profile_picture_url === "null" || profile_picture_url.includes('null')
                                            ? NoProfilePicture
                                            : profile_picture_url)
                                        : displayProfilePicture)
                                    : (!profile_picture_url || profile_picture_url === "null" || profile_picture_url.includes('null')
                                        ? NoProfilePicture
                                        : profile_picture_url)
                            }
                            loading="lazy"
                            onError={(e) => {
                                e.target.onerror = null; // Prevent infinite loop
                                e.target.src = NoProfilePicture; // Fallback image
                            }}
                            roundedCircle
                            className="shadow"
                            style={{ width: '150px', height: '150px', objectFit: 'cover', border: '4px solid #0d6efd' }}
                        />
                        {isEditMode && (
                            <>
                                <Button
                                    variant="light"
                                    className="position-absolute top-50 start-50 translate-middle"
                                    style={{
                                        width: "42px",
                                        height: "42px",
                                        borderRadius: "50%",
                                        padding: "0",
                                        backgroundColor: "#fff",
                                        boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                                    }}
                                    onClick={() => document.getElementById('fileInput').click()}
                                >
                                    <FaPencilAlt color="#0d6efd" />
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

                    <h4 className="mt-3 fw-bold">{username.replace('_', ' ')}</h4>
                    <h5 className="text-muted">
                        {is_student_or_teacher ? (
                            <Badge bg="primary">Student</Badge>
                        ) : is_superuser ? (
                            <Badge bg="success">Admin</Badge>
                        ) : (
                            <Badge bg="danger">Teacher</Badge>
                        )}
                    </h5>
                    <div className="mt-2 text-muted fw-semibold">Age • {current_date.getFullYear() - Number( birth_date && birth_date?.split('-')[0])}</div>
                    <div className="fw-semibold text-muted">
                        {is_student_or_teacher ? `Class • ${className}` : `Assigned Class • ${classroomName}`}
                    </div>
                </div>

                <Card className="mb-4 border-primary shadow-sm">
                    <Card.Body>
                        <Card.Title className="fw-bold mb-3">
                            {is_student_or_teacher ? "Offering Subjects" : "Teaching Subjects"}
                        </Card.Title>
                        {(subjects.length !== 0 ? subjects : subject).map(({ name, id }) => (
                            <Badge pill bg="primary" key={id} className="me-2 mb-2 ">
                                {name.replace('_', ' ')}
                            </Badge>
                        ))}
                    </Card.Body>
                </Card>

                {isUpdating || isDeleting ? (
                    <CenteredSpinner caption="Loading" />
                ) : (
                    <Form onSubmit={handleSave}>
                        <Row>
                            <Col md={6}>
                                {renderInputGroup("First Name", "first_name")}
                                {renderInputGroup("Last Name", "last_name")}
                                {renderInputGroup("Email", "email", "email")}
                                {isEditMode && renderInputGroup("Password", "password", "password")}
                                {renderInputGroup("Address", "address")}
                                <Form.Group className="mb-3 grid-input">
                                    <Form.Label>Phone Number</Form.Label>
                                    <InputGroup>
                                        <InputGroup.Text>{iconMap.phone_number}</InputGroup.Text>
                                        <Form.Control
                                            type="text"
                                            name="phone_number"
                                            value={formData.phone_number}
                                            pattern="^(070|080|081|090|091)\d{8}$"
                                            placeholder='Enter Phone Number'
                                            isInvalid={!validatePhoneNumber(formData.phone_number)}
                                            onChange={handleInputChange}
                                            disabled={!isEditMode}
                                            required
                                        />
                                    </InputGroup>
                                </Form.Group>
                                {renderInputGroup("Date of Birth", "birth_date", "date")}
                                {formData.is_student_or_teacher && (
                                    <>
                                        {renderInputGroup("Admission Number", "admission_number")}
                                        {renderInputGroup("Boarding Status", "boarding_status", "text", "select", [
                                            "Day",
                                            "Boarding",
                                        ])}
                                        {renderInputGroup("Parent Guardian Name", "parent_guardian_name")}
                                        <Form.Group className="mb-3 grid-input">
                                            <Form.Label>Parent Guardian Phone Number</Form.Label>
                                            <InputGroup>
                                                <InputGroup.Text>{iconMap.parent_guardian_phone}</InputGroup.Text>
                                                <Form.Control
                                                    type="text"
                                                    name="parent_guardian_phone"
                                                    value={formData.parent_guardian_phone}
                                                    pattern="^(070|080|081|090|091)\d{8}$"
                                                    placeholder='Enter Parent Guardian Phone Number'
                                                    isInvalid={
                                                        formData.parent_guardian_phone.length > 0 &&
                                                        !validatePhoneNumber(formData.parent_guardian_phone)
                                                    }
                                                    onChange={handleInputChange}
                                                    disabled={!isEditMode}
                                                    required
                                                />
                                            </InputGroup>
                                        </Form.Group>
                                        {renderInputGroup("Parent Guardian Email", "parent_guardian_email", "email")}
                                    </>
                                )}
                            </Col>

                            <Col md={6}>
                                {renderInputGroup("Home Town", "home_town")}
                                <Form.Group className="mb-3 grid-input">
                                    <Form.Label>State Of Origin</Form.Label>
                                    <InputGroup>
                                        <InputGroup.Text>{iconMap.state_of_origin}</InputGroup.Text>
                                        <Form.Select
                                            name="state_of_origin"
                                            value={selectedState}
                                            onChange={handleStateChange}
                                            disabled={!isEditMode}
                                            required
                                        >
                                            <option value="">Select a State</option>
                                            {Object.keys(STATESWITHLGAs).map((state) => (
                                                <option key={state} value={state}>
                                                    {state}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </InputGroup>
                                </Form.Group>
                                <Form.Group className="mb-3 grid-input">
                                    <Form.Label>Local Government Area</Form.Label>
                                    <InputGroup>
                                        <InputGroup.Text>{iconMap.local_government_area}</InputGroup.Text>
                                        <Form.Select
                                            name="local_government_area"
                                            value={formData.local_government_area}
                                            onChange={handleInputChange}
                                            required
                                            disabled={!isEditMode || !selectedState}
                                        >
                                            <option value="">Select LGA</option>
                                            {localGovernments.map((lga) => (
                                                <option key={lga} value={lga}>
                                                    {lga}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </InputGroup>
                                </Form.Group>
                                {renderInputGroup("Nationality", "nationality")}
                                {renderInputGroup("Religion", "religion")}
                                {renderInputGroup("Blood Group", "blood_group", "text", "select", [
                                    "A+",
                                    "A-",
                                    "B+",
                                    "B-",
                                    "AB+",
                                    "AB-",
                                    "O+",
                                    "O-",
                                ])}
                                {renderInputGroup("Genotype", "genotype", "text", "select", [
                                    "AA",
                                    "AS",
                                    "SS",
                                    "AC",
                                    "SC",
                                ])}
                                {renderInputGroup("Disability Status", "disability_status")}
                                <Form.Group className="mb-3 grid-input">
                                    <Form.Label>NIN</Form.Label>
                                    <InputGroup>
                                        <InputGroup.Text>{iconMap.nin}</InputGroup.Text>
                                        <Form.Control
                                            type="text"
                                            name="nin"
                                            value={formData.nin}
                                            placeholder='Enter NIN'
                                            isInvalid={!!formData.nin && (!/^\d{11}$/.test(formData.nin))
                                            }
                                            hint="NIN should be 11 digits"
                                            onChange={handleInputChange}
                                            disabled={!isEditMode}
                                            required
                                        />
                                    </InputGroup>
                                </Form.Group>
                                {renderInputGroup("Gender", "gender", "text", "select", ["male", "female"])}
                            </Col>
                        </Row>
                        {isEditMode && (
                            <div className="text-center mt-4">
                                <Button variant="success" size="lg" type="submit" className="save-btn w-100">
                                    Save Changes
                                </Button>
                            </div>
                        )}
                    </Form>
                )}
            </Modal.Body>

            <Modal.Footer className="bg-light justify-content-between">
                {(!currentUser.is_student_or_teacher && (currentUser.user_class === className || currentUser.is_superuser)) && (
                    <>
                        {!isEditMode && (
                            <Button onClick={toggleEditMode} variant="outline-primary">
                                Edit
                            </Button>
                        )}
                        <Button variant="outline-danger" onClick={handleDelete} disabled={isDeleting}>
                            Delete
                        </Button>
                    </>
                )}
                <Button variant="secondary" onClick={() => { handleClose(); setIsEditMode(); }}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

