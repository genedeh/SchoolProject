import { useState } from "react";
import { Form, Button, InputGroup, Row, Col } from "react-bootstrap";

export const PersonalInfromationStep = ({ formData, updateFormData, nextStep, prevStep }) => {
    const [errors, setErrors] = useState({
        phoneNumber: '',
        phoneNumber2: ''
    });

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
    return (
        <Form onSubmit={handleSubmit} className="p-4 rounded shadow-sm bg-light">
            <h3 className="mb-4 text-center">User Details Form</h3>

            {/* Birth Date Field */}
            <Form.Group controlId="birthDate" className="mb-3">
                <Form.Label>Birth Date</Form.Label>
                <Form.Control
                    type="date"
                    name="birth_date"
                    value={formData.birth_date}
                    onChange={handleInputChange}
                    required
                />
            </Form.Group>

            {/* Address Field */}
            <Form.Group controlId="address" className="mb-3">
                <Form.Label>Address</Form.Label>
                <Form.Control
                    type="text"
                    name="address"
                    placeholder="Enter your address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                />
            </Form.Group>

            { /* Admission Number Field */}
            <Form.Group controlId="address" className="mb-3">
                <Form.Label>Admission Number</Form.Label>
                <Form.Control
                    type="text"
                    name="admission_number"
                    placeholder="Enter your Admission Number"
                    value={formData.admission_number}
                    onChange={handleInputChange}
                    required
                />
            </Form.Group>

            {/* Parent/Guardian Name Field */}
            <Form.Group controlId="parentGuardianName" className="mb-3">
                <Form.Label>Parent/Guardian Name</Form.Label>
                <Form.Control
                    type="text"
                    name="parent_guardian_name"
                    placeholder="Enter Parent/Guardian Name"
                    value={formData.parent_guardian_name}
                    onChange={handleInputChange}
                    required
                />
            </Form.Group>

            {/* Parent/Guardian Phone Number Field */}
            <Form.Group controlId="parentGuardianPhone" className="mb-3">
                <Form.Label>Parent/Guardian Phone Number</Form.Label>
                <InputGroup hasValidation>
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
                    <Form.Control.Feedback type="invalid">
                        {errors.phoneNumber2}
                    </Form.Control.Feedback>
                </InputGroup>
            </Form.Group>

            {/* Phone Number Field */}
            <Form.Group controlId="phoneNumber" className="mb-3">
                <Form.Label>Phone Number (Nigerian Format)</Form.Label>
                <InputGroup hasValidation>
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
                    <Form.Control.Feedback type="invalid">
                        {errors.phoneNumber}
                    </Form.Control.Feedback>
                </InputGroup>
            </Form.Group>
            {/* Parent/Guardian Email Field */}
            <Form.Group controlId="parentGuardianEmail" className="mb-3">
                <Form.Label>Parent/Guardian Email</Form.Label>
                <Form.Control
                    type="email"
                    name="parent_guardian_email"
                    placeholder="Enter Parent/Guardian Email"
                    value={formData.parent_guardian_email}
                    onChange={handleInputChange}
                    required
                />
            </Form.Group>

            {/* Local Government Area Field */}
            <Form.Group controlId="localGovernmentArea" className="mb-3">
                <Form.Label>Local Government Area</Form.Label>
                <Form.Control
                    type="text"
                    name="local_government_area"
                    placeholder="Enter your Local Government Area"
                    value={formData.local_government_area}
                    onChange={handleInputChange}
                    required
                />
            </Form.Group>


            {/* Home Town Field */}
            <Form.Group controlId="homeTown" className="mb-3">
                <Form.Label>Home Town</Form.Label>
                <Form.Control
                    type="text"
                    name="home_town"
                    placeholder="Enter your Home Town"
                    value={formData.home_town}
                    onChange={handleInputChange}
                    required
                />
            </Form.Group>

            {/*Religion Field */}
            <Form.Group controlId="religion" className="mb-3">
                <Form.Label>Religion</Form.Label>
                <Form.Control
                    type="text"
                    name="religion"
                    placeholder="Enter your Religion"
                    value={formData.religion}
                    onChange={handleInputChange}
                    required
                />
            </Form.Group>

            {/* Blood Group Field */}
            <Form.Group controlId="bloodGroup" className="mb-3">
                <Form.Label>Blood Group</Form.Label>
                <Form.Control
                    type="text"
                    name="blood_group"
                    placeholder="Enter your Blood Group"
                    value={formData.blood_group}
                    onChange={handleInputChange}
                    required
                />
            </Form.Group>

            {/* Genotype Field */}
            <Form.Group controlId="genotype" className="mb-3">
                <Form.Label>Genotype</Form.Label>
                <Form.Control
                    type="text"
                    name="genotype"
                    placeholder="Enter your Genotype"
                    value={formData.genotype}
                    onChange={handleInputChange}
                    required
                />
            </Form.Group>

            {/* Disability Status Field */}
            <Form.Group controlId="disabilityStatus" className="mb-3">
                <Form.Label>Disability Status</Form.Label>
                <Form.Control
                    type="text"
                    name="disability_status"
                    placeholder="Enter your Disability Status"
                    value={formData.disability_status}
                    onChange={handleInputChange}
                    required
                />
            </Form.Group>

            {/* State of Origin Field */}
            <Form.Group controlId="stateOfOrigin" className="mb-3">
                <Form.Label>State of Origin</Form.Label>
                <Form.Control
                    type="text"
                    name="state_of_origin"
                    placeholder="Enter your State of Origin"
                    value={formData.state_of_origin}
                    onChange={handleInputChange}
                    required
                />
            </Form.Group>

            {/* NIN Field */}
            <Form.Group controlId="nin" className="mb-3">
                <Form.Label>NIN</Form.Label>
                <Form.Control
                    type="text"
                    name="nin"
                    placeholder="Enter your NIN"
                    value={formData.nin}
                    onChange={handleInputChange}
                    required
                />
            </Form.Group>



            {/* Gender Field */}
            <Form.Group controlId="gender" className="mb-4">
                <Form.Label>Gender</Form.Label>
                <Row>
                    <Col>
                        <Form.Check
                            type="radio"
                            label="Male"
                            name="gender"
                            value="male"
                            checked={formData.gender === 'male'}
                            onChange={handleInputChange}
                            required
                        />
                    </Col>
                    <Col>
                        <Form.Check
                            type="radio"
                            label="Female"
                            name="gender"
                            value="female"
                            checked={formData.gender === 'female'}
                            onChange={handleInputChange}
                            required
                        />
                    </Col>
                </Row>
            </Form.Group>


            {/* Boarding Status Field */}
            <Form.Group controlId="boardingStatus" className="mb-4">
                <Form.Label>Boarding Status</Form.Label>
                <Row>
                    <Col>
                        <Form.Check
                            type="radio"
                            label="Boarding"
                            name="boarding_status"
                            value="Boarding"
                            checked={formData.boarding_status === 'Boarding'}
                            onChange={handleInputChange}
                            required
                        />
                    </Col>
                    <Col>
                        <Form.Check
                            type="radio"
                            label="Day"
                            name="boarding_status"
                            value="Day"
                            checked={formData.boarding_status === 'Day'}
                            onChange={handleInputChange}
                            required
                        />
                    </Col>
                </Row>
            </Form.Group>

            {/* Submit Button */}
            <div className="d-flex justify-content-between mt-4">
                <Button variant="secondary" onClick={prevStep}>
                    Back
                </Button>
                <Button
                    type="submit"
                    variant="primary"
                >
                    Next
                </Button>
            </div>
        </Form>
    );
};
