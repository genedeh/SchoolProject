import { useState, useContext, useEffect } from "react";
import { Button, ListGroup, Badge , Alert} from "react-bootstrap";
import { SubjectsContext } from "../../../../../contexts/Subjects.contexts";
import { ClassroomsContext } from "../../../../../contexts/Classrooms.contexts";

const getRandomColor = () => {
    const colors = ['#f28b82', '#fbbc04', '#34a853', '#4285f4', '#a142f4', '#f54842'];
    return colors[Math.floor(Math.random() * colors.length)];
};

export const SubjectSelectStep = ({ formData, updateFormData, nextStep, prevStep }) => {
    const { subjects } = useContext(SubjectsContext);
    const { classrooms } = useContext(ClassroomsContext);
    const [error, setError] = useState(null);
    const [classSubjects, setClassSubjects] = useState(formData.subjects || []);
    const [availableSubjects, setAvailableSubjects] = useState([]);

    const toggleSelectSubject = (id) => {
        setClassSubjects((prevSelected) =>
            prevSelected.includes(id) ? prevSelected.filter((item) => item !== id) : [...prevSelected, id]
        );
    };

    const unselectAll = () => {
        setClassSubjects([]);
    };

    const handleSubmit = () => {
        if (classSubjects.length !== 0) {
            setError(null);
            updateFormData('subjects', classSubjects)
            nextStep();
        } else {
            setError('Select Subjects');
        }
    }


    useEffect(() => {
        const currentClassroom = classrooms.filter(({ id }) => id === formData.classes[0])
        const currentClassroomName = currentClassroom[0].name.split('_')[0]
        const AvailableSubjects = subjects.filter((subject) => subject.name.toLowerCase().includes(currentClassroomName.toLowerCase()))
        setAvailableSubjects(AvailableSubjects);
    }, [])
    return (
        <>
            <div className="p-4 bg-light rounded shadow-sm">
                <h3 className="mb-4">Subjects List</h3>
                {error && <Alert variant="danger" dismissible>{error}</Alert>}
                <ListGroup variant="flush">
                    {availableSubjects.map((subject) => (
                        <>
                            <ListGroup.Item
                                key={subject.id}
                                onClick={() => toggleSelectSubject(subject.id)}
                                style={{
                                    cursor: 'pointer',
                                    borderBlockColor: classSubjects.includes(subject.id) ? getRandomColor() : 'transparent',
                                    borderRadius: '10px',
                                    borderWidth: '5px',
                                }}
                                className="d-flex justify-content-between align-items-center p-3 mb-2 shadow-sm"
                            >
                                <div>
                                    <h5 className="mb-1">{subject.name.replace('_', ' ')}</h5>
                                    <p className="mb-0">
                                        Teacher: <Badge bg="secondary">{subject.assigned_teacher.username.replace('_', ' ')}</Badge>
                                    </p>
                                    <p className="mb-0">
                                        Students: <Badge bg="info">{subject.students_offering.length}</Badge>
                                    </p>
                                </div>

                            </ListGroup.Item>
                            <div>
                                <Button
                                    variant="outline-dark"
                                    onClick={() => toggleSelectSubject(subject.id)}
                                    className="mx-2"
                                    style={{ display: classSubjects.includes(subject.id) ? 'block' : 'none' }}
                                >
                                    Unselect
                                </Button>
                            </div>
                        </>
                    ))}
                </ListGroup>

                {/* Unselect All Button */}
                {classSubjects.length > 0 && (
                    <Button variant="danger" className="mt-3" onClick={unselectAll}>
                        Unselect All
                    </Button>
                )}
            </div>
            <div className="d-flex justify-content-between mt-4">
                <Button variant="secondary" onClick={prevStep}>
                    Back
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    Next
                </Button>
            </div>
        </>
    )
}