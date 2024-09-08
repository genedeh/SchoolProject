import { useState } from "react";
import { InputGroup, Form, Button , Alert} from "react-bootstrap";

export const PasswordStep = ({ formData, updateFormData, nextStep, prevStep }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState(formData.password);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState(null);

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        updateFormData(name, value)
        
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.password === confirmPassword) {
            setError(null);
            nextStep();
        } else {
            setError('Passwords do not match. Please try again.');
        }
    };

    return (
        <Form onSubmit={handleSubmit} className="p-3">
            <Form.Group className="m-4">
                <InputGroup>
                    <Form.Control
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        isInvalid={!!error}
                        required
                    />
                    <Button
                        variant="outline-secondary"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? 'Hide' : 'Show'}
                    </Button>
                    <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
                </InputGroup>
            </Form.Group>

            <Form.Group className="m-4">
                <InputGroup>
                    <Form.Control
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm your password"
                        name="confirmPassword"
                        value={confirmPassword}
                        isInvalid={!!error}
                        onChange={(e)=> setConfirmPassword(e.target.value)}
                        required
                    />
                    <Button
                        variant="outline-secondary"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                        {showConfirmPassword ? 'Hide' : 'Show'}
                    </Button>
                    <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
                </InputGroup>
            </Form.Group>

            <div className="d-flex justify-content-between mt-4">
                <Button variant="secondary" onClick={prevStep}>
                    Back
                </Button>
                <Button variant="primary"  type="submit">
                    Next
                </Button>
            </div>
        </Form>
    );
};