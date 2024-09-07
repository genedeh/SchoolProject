import { useContext, useState } from "react";
import { UserContext } from "../../../../contexts/User.contexts";
import { Navigate } from "react-router-dom";
import { Form, Button } from 'react-bootstrap'
// import './AddUser.styles.scss'
const BasicInformation = ({ formData, setFormData, nextStep }) => {
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="p-4 container">
            <h2>Let's get to know each other 👋</h2>
            <Form>
                <Form.Group className="mb-3">
                    <Form.Control
                        type="text"
                        placeholder="Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Control
                        type="email"
                        placeholder="Email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Control
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </Form.Group>
                <Button variant="primary" onClick={nextStep}>
                    Next
                </Button>
            </Form>
        </div>
    );
};

const MainGoal = ({ formData, setFormData, nextStep, prevStep }) => {
    const handleChange = (e) => {
        setFormData({ ...formData, goal: e.target.value });
    };

    return (
        <div className="p-4">
            <h2>What's your main goal?</h2>
            <Form>
                {['Reduce stress', 'Improve focus', 'Manage anxiety', "I'm just checking it out"].map((goal) => (
                    <Form.Check
                        key={goal}
                        type="radio"
                        label={goal}
                        value={goal}
                        checked={formData.goal === goal}
                        onChange={handleChange}
                    />
                ))}
                <div className="d-flex justify-content-between mt-4">
                    <Button variant="secondary" onClick={prevStep}>
                        Back
                    </Button>
                    <Button variant="primary" onClick={nextStep}>
                        Continue
                    </Button>
                </div>
            </Form>
        </div>
    );
};

const Confirmation = ({ formData, prevStep, submitForm }) => {
    return (
        <div className="p-4">
            <h2>You are all set</h2>
            <p>We are now creating your curated list of guided meditation sessions and mindfulness tips 💡</p>
            <div className="d-flex justify-content-between mt-4">
                <Button variant="secondary" onClick={prevStep}>
                    Back
                </Button>
                <Button variant="primary" onClick={submitForm}>
                    View sessions
                </Button>
            </div>
        </div>
    );
};
export const AddUser = () => {
    const { currentUser } = useContext(UserContext);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        "username": "",
        "password": "",
        "email": "",
        "first_name": "",
        "last_name": "",
        "profile_picture": null,
        "is_student_or_teacher": false,
        "birth_date": null,
        "address": "",
        "is_superuser": false,
        "phone_number": "",
        "gender": "male",
        "classes": [],
        "subjects": []
    });
    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const submitForm = () => {
        console.log('Form Submitted', formData);
    };

    if (currentUser.is_admin && currentUser) {
        switch (step) {
            case 1:
                return (
                    <BasicInformation
                        formData={formData}
                        setFormData={setFormData}
                        nextStep={nextStep}
                    />
                );
            case 2:
                return (
                    <MainGoal
                        formData={formData}
                        setFormData={setFormData}
                        nextStep={nextStep}
                        prevStep={prevStep}
                    />
                );
            case 3:
                return (
                    <Confirmation
                        formData={formData}
                        prevStep={prevStep}
                        submitForm={submitForm}
                    />
                );
            default:
                return <div>Unknown step</div>;
        }
    } return (
        <Navigate to="/dashboard/home" />
    );
};

