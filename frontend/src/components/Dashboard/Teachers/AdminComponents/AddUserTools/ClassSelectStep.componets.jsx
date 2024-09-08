import { useContext, useState } from "react";
import { ClassroomsContext } from "../../../../../contexts/Classrooms.contexts";
import { Button, ListGroup, Badge, Alert } from "react-bootstrap";


const getRandomColor = () => {
    const colors = ['blue', 'purple', 'yellow', 'black', 'red', 'green'];
    return colors[Math.floor(Math.random() * colors.length)];
};
export const ClassSelectStep = ({ formData, updateFormData, nextStep, prevStep }) => {
    const { classrooms } = useContext(ClassroomsContext);
    const [error, setError] = useState(null);
    const [selectedClassRoom, setSelectedClassRoom] = useState(formData.classes[0]);
    const toggleSelectClassroom = (id) => {
        setSelectedClassRoom(id)
        updateFormData('classes', [id])
    };

    const handleSubmit = (e) => {
        if (formData.classes.length !== 0) {
            setError(null);
            nextStep();
        } else {
            setError('Select A Class');
            console.log(error)
        }
    }

    return (
        <div className="p-4 bg-light rounded shadow-sm">
            <h3 className="mb-4">Classroom List</h3>
            {error && <Alert variant="danger" dismissible>{error}</Alert>}
            <ListGroup variant="flush">
                {classrooms.map((classroom) => (
                    <ListGroup.Item
                        key={classroom.id}
                        onClick={() => toggleSelectClassroom(classroom.id)}
                        style={{
                            cursor: 'pointer',
                            borderBlockColor: selectedClassRoom === classroom.id ? getRandomColor() : 'transparent',
                            borderRadius: '10px',
                            borderWidth: '5px',
                        }}
                        className="d-flex justify-content-between align-items-center p-3 mb-2 shadow-sm"
                    >
                        <div>
                            <h5 className="mb-1">{classroom.name}</h5>
                            <p className="mb-0">
                                Assigned Teacher : {classroom.assigned_teacher ? (classroom.assigned_teacher.username.replace('_', ' ')) : ("NO ASSIGNE TEACHER")}
                            </p>
                            <p className="mb-0">
                                No Of Students : <Badge bg="info">{classroom.students.length}</Badge>
                            </p>
                        </div>
                    </ListGroup.Item>
                ))}
            </ListGroup>

            <div className="d-flex justify-content-between mt-4">
                <Button variant="secondary" onClick={prevStep}>
                    Back
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    Next
                </Button>
            </div>
        </div>
    );
};