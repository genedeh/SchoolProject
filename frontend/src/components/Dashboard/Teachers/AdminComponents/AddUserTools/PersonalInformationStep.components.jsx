import { useEffect, useState } from "react";
import { Form, Button, Row, Col, InputGroup } from "react-bootstrap";
import { FaCalendar, FaHome, FaUser, FaPhone, FaEnvelope, FaIdCard, FaGlobeAfrica, FaCity, FaBook, FaTint, FaIdBadge, FaUsers, FaUniversalAccess } from "react-icons/fa";
import { STATESWITHLGAs } from "../../../../../utils/predefinedInformation.utils";

export const PersonalInfromationStep = ({ formData, updateFormData, nextStep, prevStep }) => {
    const [errors, setErrors] = useState({
        phoneNumber: '',
        phoneNumber2: ''
    });
    const [selectedState, setSelectedState] = useState(formData.state_of_origin || '');
    const [localGovernments, setLocalGovernments] = useState([]);

    // Validate Nigerian phone number format (e.g., starts with 070, 080, 081, 090, 091, and has 11 digits)
    const validatePhoneNumber = (number) => {
        const nigerianPhoneRegex = /^(070|080|081|090|091)\d{8}$/;
        return nigerianPhoneRegex.test(number);
    };

    // Handle form input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        updateFormData(name, value);
        // Validate phone number if the field is being modified
        if (name === 'phone_number') {
            setErrors({
                ...errors,
                phoneNumber: validatePhoneNumber(value)
                    ? ''
                    : 'Invalid Nigerian phone number format.',
            });
        }
        if (name === 'parent_guardian_phone') {
            setErrors({
                ...errors,
                phoneNumber2: validatePhoneNumber(value)
                    ? ''
                    : 'Invalid Nigerian phone number format.',
            });
        }
        // Handle other fields as needed
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        if (errors.phoneNumber) {
            alert('Please correct the errors before submitting the form.');
        } else {
            nextStep();
        }

    };

    // Handle state change and update LGAs
    const handleStateChange = (e) => {
        const state = e.target.value;
        setSelectedState(state);
        handleInputChange(e);
    };
    useEffect(() => {
        // Reset local government area when state changes
        setLocalGovernments(STATESWITHLGAs[formData.state_of_origin] || []);
    }
        , [formData.state_of_origin]);

    return (
        <Form onSubmit={handleSubmit} className="p-4 rounded shadow-sm bg-light">
            <h3 className="mb-4 text-center fw-bold">User Details Form</h3>

            <Row className="g-3">
                {/* Birth Date */}
                <Col md={6}>
                    <Form.Group controlId="birthDate">
                        <Form.Label><FaCalendar className="me-2" /> Birth Date</Form.Label>
                        <Form.Control
                            type="date"
                            name="birth_date"
                            value={formData.birth_date}
                            onChange={handleInputChange}
                            required
                        />
                    </Form.Group>
                </Col>

                {/* Address */}
                <Col md={6}>
                    <Form.Group controlId="address">
                        <Form.Label><FaHome className="me-2" /> Address</Form.Label>
                        <Form.Control
                            type="text"
                            name="address"
                            placeholder="Enter your address"
                            value={formData.address}
                            onChange={handleInputChange}
                            required
                        />
                    </Form.Group>
                </Col>

                {/* NIN */}
                <Col md={6}>
                    <Form.Group controlId="nin">
                        <Form.Label><FaUniversalAccess className="me-2" /> NIN</Form.Label>
                        <Form.Control
                            type="text"
                            name="nin"
                            placeholder="Enter your NIN"
                            value={formData.nin}
                            onChange={handleInputChange}
                            required
                        />
                    </Form.Group>
                </Col>
                {/* Admission Number */}

                {formData.is_student_or_teacher && (
                    < Col md={6}>
                        <Form.Group controlId="admissionNumber">
                            <Form.Label><FaIdCard className="me-2" /> Admission Number</Form.Label>
                            <Form.Control
                                type="text"
                                name="admission_number"
                                placeholder="Enter your Admission Number"
                                value={formData.admission_number}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                    </Col>
                )}


                {formData.is_student_or_teacher &&
                    (
                        <>
                            {/* Parent/Guardian Name */}
                            <Col md={6}>
                                <Form.Group controlId="parentGuardianName">
                                    <Form.Label><FaUser className="me-2" /> Parent/Guardian Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="parent_guardian_name"
                                        placeholder="Enter Parent/Guardian Name"
                                        value={formData.parent_guardian_name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>

                            {/* //  Parent/Guardian Phone Number */}
                            <Col md={6}>
                                <Form.Group controlId="parentGuardianPhone">
                                    <Form.Label><FaPhone className="me-2" /> Parent/Guardian Phone</Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                            type="tel"
                                            name="parent_guardian_phone"
                                            placeholder="08012345678"
                                            pattern="^(070|080|081|090|091)\d{8}$"
                                            value={formData.parent_guardian_phone}
                                            onChange={handleInputChange}
                                            isInvalid={!!errors.phoneNumber2}
                                            required
                                        />
                                        <Form.Control.Feedback type="invalid">{errors.phoneNumber2}</Form.Control.Feedback>
                                    </InputGroup>
                                </Form.Group>
                            </Col>
                            {/* Parent/Guardian Email */}
                            <Col md={6}>
                                <Form.Group controlId="parentGuardianEmail">
                                    <Form.Label><FaEnvelope className="me-2" /> Parent/Guardian Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        name="parent_guardian_email"
                                        placeholder="Enter Parent/Guardian Email"
                                        value={formData.parent_guardian_email}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </>
                    )}
                {/* Student Phone Number */}
                <Col md={6}>
                    <Form.Group controlId="phoneNumber">
                        <Form.Label><FaPhone className="me-2" /> Phone Number</Form.Label>
                        <InputGroup>
                            <Form.Control
                                type="tel"
                                name="phone_number"
                                placeholder="08012345678"
                                pattern="^(070|080|081|090|091)\d{8}$"
                                value={formData.phone_number}
                                onChange={handleInputChange}
                                isInvalid={!!errors.phoneNumber}
                                required
                            />
                            <Form.Control.Feedback type="invalid">{errors.phoneNumber}</Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                </Col>


                <Col md={6}>
                    <Form.Group controlId="stateOfOrigin">
                        <Form.Label><FaGlobeAfrica className="me-2" /> State of Origin</Form.Label>
                        <Form.Select
                            name="state_of_origin"
                            value={selectedState}
                            onChange={handleStateChange}
                            required
                        >
                            <option value="">Select a State</option>
                            {Object.keys(STATESWITHLGAs).map((state) => (
                                <option key={state} value={state}>{state}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Col>

                {/* Local Government Area */}
                <Col md={6}>
                    <Form.Group controlId="localGovernmentArea">
                        <Form.Label><FaGlobeAfrica className="me-2" /> Local Government Area</Form.Label>
                        <Form.Select
                            name="local_government_area"
                            value={formData.local_government_area}
                            onChange={handleInputChange}
                            required
                            disabled={!selectedState} // Disable until state is selected
                        >
                            <option value="">Select LGA</option>
                            {localGovernments.map((lga) => (
                                <option key={lga} value={lga}>{lga}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Col>

                {/* Home Town */}
                <Col md={6}>
                    <Form.Group controlId="homeTown">
                        <Form.Label><FaCity className="me-2" /> Home Town</Form.Label>
                        <Form.Control
                            type="text"
                            name="home_town"
                            placeholder="Enter your Home Town"
                            value={formData.home_town}
                            onChange={handleInputChange}
                            required
                        />
                    </Form.Group>
                </Col>

                {/* Religion */}
                <Col md={6}>
                    <Form.Group controlId="religion">
                        <Form.Label><FaBook className="me-2" /> Religion</Form.Label>
                        <Form.Control
                            type="text"
                            name="religion"
                            placeholder="Enter your Religion"
                            value={formData.religion}
                            onChange={handleInputChange}
                            required
                        />
                    </Form.Group>
                </Col>

                {/* Blood Group & Genotype */}
                <Col md={6}>
                    <Form.Group controlId="bloodGroup">
                        <Form.Label><FaTint className="me-2" /> Blood Group</Form.Label>
                        <Form.Select
                            name="blood_group"
                            value={formData.blood_group}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select Blood Group</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                        </Form.Select>
                    </Form.Group>
                </Col>

                <Col md={6}>
                    <Form.Group controlId="genotype">
                        <Form.Label><FaIdBadge className="me-2" /> Genotype</Form.Label>
                        <Form.Select
                            name="genotype"
                            value={formData.genotype}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select Genotype</option>
                            <option value="AA">AA</option>
                            <option value="AS">AS</option>
                            <option value="SS">SS</option>
                            <option value="AC">AC</option>
                            <option value="SC">SC</option>
                        </Form.Select>
                    </Form.Group>
                </Col>

                {/* Gender Selection */}
                <Col md={6}>
                    <Form.Group controlId="gender">
                        <Form.Label><FaUsers className="me-2" /> Gender</Form.Label>
                        <Form.Check type="radio" label="Male" name="gender" value="male" checked={formData.gender === 'male'} onChange={handleInputChange} required />
                        <Form.Check type="radio" label="Female" name="gender" value="female" checked={formData.gender === 'female'} onChange={handleInputChange} required />
                    </Form.Group>
                </Col>
            </Row>

            {/* Buttons */}
            <div className="d-flex justify-content-between footer mt-5">
                <Button variant="secondary" onClick={prevStep} className="custom-btn2"> Back </Button>
                <Button type="submit" className="custom-btn"> Next </Button>
            </div>
        </Form>
    );
};
