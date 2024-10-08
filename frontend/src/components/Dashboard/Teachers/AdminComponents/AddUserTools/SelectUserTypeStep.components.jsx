import { Button,  Col, Card, Row, Container } from 'react-bootstrap';


export const SelectUserTypeStep = ({ updateFormData, nextStep, selectedOption, setSelectedOption }) => {

    const options = [
        { id: 1, title: 'Students', description: 'View and manage student data' },
        { id: 2, title: 'Teachers', description: 'Manage teacher profiles and information' },
        { id: 3, title: 'Admin', description: 'Access admin controls and settings' },
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
        <Container fluid={true} >
            <hr /><h1 className='text-center'>Choose User Type</h1><hr />
            <Row className="g-3">
                {options.map((option) => (
                    <Col key={option.id} md={12}>
                        <Card
                            className={`p-3 ${selectedOption === option.id ? 'border-primary' : ''}`}
                            onClick={() => handleSelect(option.id)}
                            style={{ cursor: 'pointer' }}
                        >
                            <Card.Body className="d-flex align-items-center">
                                <div className={`icon-${option.title.toLowerCase()}`}></div>
                                <div className="ms-3">
                                    <Card.Title>{option.title}</Card.Title>
                                    <Card.Text>{option.description}</Card.Text>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
            <div className="d-flex justify-content-between mt-4 mb-3">
                <Button variant="primary" onClick={nextStep}>
                    Continue
                </Button>
            </div>
        </Container>
    )
}