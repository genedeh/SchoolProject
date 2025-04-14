import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { FaUserGraduate, FaChalkboardTeacher, FaUserShield } from "react-icons/fa";

export const SelectUserTypeStep = ({ updateFormData, nextStep, selectedOption, setSelectedOption }) => {

    const options = [
        { id: 1, title: 'Students', description: 'View and manage student data', icon: <FaUserGraduate size={50} /> },
        { id: 2, title: 'Teachers', description: 'Manage teacher profiles and information', icon: <FaChalkboardTeacher size={50} /> },
        { id: 3, title: 'Admin', description: 'Access admin controls and settings', icon: <FaUserShield size={50} /> },
    ];

    const handleSelect = (id) => {
        if (id === 1) {
            updateFormData('is_student_or_teacher', true);
            updateFormData('is_superuser', false);
        } else if (id === 2) {
            updateFormData('is_student_or_teacher', false);
            updateFormData('is_superuser', false);
            updateFormData('classes', [])
        } else {
            updateFormData('is_student_or_teacher', false);
            updateFormData('is_superuser', true);
            updateFormData('classes', [])
        }
        setSelectedOption(id);
    };

    return (
        <Container className="select-user-type-container">
            <hr />
            <h2 className="text-center">Select User Type</h2>
            <hr />
            <Row className="justify-content-center">
                {options.map((option) => (
                    <Col key={option.id} className="mb-3">
                        <Card
                            className={`user-type-card ${selectedOption === option.id ? "selected" : ""}`}
                            onClick={() => handleSelect(option.id)}
                        >
                            <Card.Body className="d-flex flex-column align-items-center">
                                <div>{option.icon}</div>
                                <Card.Title>{option.title}</Card.Title>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
            <div className="d-flex justify-content-center mt-4">
                <Button className="custom-btn" onClick={nextStep} disabled={!selectedOption}>
                    Continue
                </Button>
            </div>
        </Container>
    )
}