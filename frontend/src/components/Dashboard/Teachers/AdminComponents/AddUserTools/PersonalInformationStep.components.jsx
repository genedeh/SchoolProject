import { useState } from "react";
import { Form, Button, InputGroup, Row, Col } from "react-bootstrap";

export const PersonalInfromationStep = ({ formData, updateFormData, nextStep, prevStep }) => {
    const [errors, setErrors] = useState({
        phoneNumber: '',
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
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        if (errors.phoneNumber) {
            alert('Please correct the errors before submitting the form.');
        }
        nextStep();
    };

    return (
        <Form onSubmit={handleSubmit} className="p-4 rounded shadow-sm bg-light">
            <h3 className="mb-4">User Details Form</h3>

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

            {/* Phone Number Field */}
            <Form.Group controlId="phoneNumber" className="mb-3">
                <Form.Label>Phone Number (Nigerian Format)</Form.Label>
                <InputGroup hasValidation>
                    <Form.Control
                        type="tel"
                        name="phone_number"
                        placeholder="08012345678"
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

            {/* Submit Button */}
            <div className="d-flex justify-content-between mt-4">
                <Button variant="secondary" onClick={prevStep}>
                    Back
                </Button>
                <Button
                    type="submit"
                    variant="primary"
                    disabled={
                        !formData.birth_date || !formData.address || !!errors.phoneNumber
                    }
                >
                    Continue
                </Button>
            </div>
        </Form>
    );
};
