import { useState } from "react";
import { useUser } from "../../../contexts/User.contexts";
import { Container, Row, Col, ProgressBar } from "react-bootstrap";
import { FaUser, FaLock, FaImage, FaCheck, FaBook, FaGraduationCap } from "react-icons/fa";
import { Navigate } from "react-router-dom";
import { SelectUserTypeStep } from "./AdminComponents/AddUserTools/SelectUserTypeStep.components";
import { BasicInformationStep } from "./AdminComponents/AddUserTools/BasicInformationStep.components";
import { PasswordStep } from "./AdminComponents/AddUserTools/PasswordStep.components";
import { ProfilePictureStep } from "./AdminComponents/AddUserTools/ProfilePictureStep.components";
import { PersonalInfromationStep } from "./AdminComponents/AddUserTools/PersonalInformationStep.components";
import { ClassSelectStep } from "./AdminComponents/AddUserTools/ClassSelectStep.componets";
import { SubjectSelectStep } from "./AdminComponents/AddUserTools/SubjectSelectStep.componets";
import { ConfirmationStep } from "./AdminComponents/AddUserTools/ConfirmationStep.components";

const steps = [
    { id: 1, title: "Select Type", icon: <FaUser /> },
    { id: 2, title: "Basic Info", icon: <FaUser /> },
    { id: 3, title: "Password", icon: <FaLock /> },
    { id: 4, title: "Profile Pic", icon: <FaImage /> },
    { id: 5, title: "Personal Info", icon: <FaCheck /> },
    { id: 6, title: "Class Selection", icon: <FaGraduationCap /> },
    { id: 7, title: "Subjects", icon: <FaBook /> },
    { id: 8, title: "Confirmation", icon: <FaCheck /> }
];

export const AddUser = () => {
    const { currentUser } = useUser();
    const [step, setStep] = useState(1);
    const [selectedOption, setSelectedOption] = useState(1);
    const [formData, setFormData] = useState({
        "username": "",
        "password": "",
        "email": "",
        "first_name": "",
        "last_name": "",
        "profile_picture": null,
        "is_student_or_teacher": true,
        "birth_date": "",
        "address": "",
        "is_superuser": false,
        "phone_number": "",
        "gender": "male",
        "classes": [],
        "subjects": [],
        "admission_number": "",
        "parent_guardian_name": "",
        "parent_guardian_phone": "",
        "parent_guardian_email": "",
        "home_town": "",
        "local_government_area": "",
        "religion": "",
        "blood_group": "",
        "genotype": "",
        "disability_status": "",
        "boarding_status": "Day",
        "nin": "",
        "state_of_origin": "",
    });
    const nextStep = () => setStep(step + 1);

    const prevStep = () => {
        if (((step - 1) === 7 || (step - 2) === 6) && !formData.is_student_or_teacher) {
            setStep(5);
        } else {
            setStep(step - 1);
        }
    };

    const updateFormData = (field, value) => {
        setFormData((prevData) => ({
            ...prevData,
            [field]: value,
        }));
    };

    if (!currentUser.is_superuser && currentUser.is_student_or_teacher) {
        return <Navigate to="/dashboard/home" />; // Redirect students to home
    }

    if (currentUser.is_superuser || !currentUser.is_student_or_teacher) {
        // Check user type and restrict step 1 for teachers
        if (!currentUser.is_superuser && step === 1) {
            setStep(2); // Automatically skip Step 1 for teachers
        }
    }
    const renderStepComponent = () => {
        let adjustedStep = step;

        // If step 6 or 7 is reached but the user isn't a student or teacher, skip to step 8
        if ((step === 6 || step === 7) && !formData.is_student_or_teacher) {
            adjustedStep = 8;
            setStep(8); // Set step to 8 to avoid confusion
        }

        switch (adjustedStep) {
            case 1:
                return currentUser.is_superuser && (
                    <SelectUserTypeStep
                        nextStep={nextStep}
                        updateFormData={updateFormData}
                        selectedOption={selectedOption}
                        setSelectedOption={setSelectedOption}
                    />
                );
            case 2:
                return (
                    <BasicInformationStep
                        formData={formData}
                        nextStep={nextStep}
                        prevStep={prevStep}
                        updateFormData={updateFormData}
                    />
                );
            case 3:
                return (
                    <PasswordStep
                        formData={formData}
                        nextStep={nextStep}
                        prevStep={prevStep}
                        updateFormData={updateFormData}
                    />
                );
            case 4:
                return (
                    <ProfilePictureStep
                        formData={formData}
                        nextStep={nextStep}
                        prevStep={prevStep}
                        updateFormData={updateFormData}
                    />
                );
            case 5:
                return (
                    <PersonalInfromationStep
                        formData={formData}
                        nextStep={nextStep}
                        prevStep={prevStep}
                        updateFormData={updateFormData}
                    />
                );
            case 6:
                return (
                    <ClassSelectStep
                        formData={formData}
                        nextStep={nextStep}
                        prevStep={prevStep}
                        updateFormData={updateFormData}
                    />
                );
            case 7:
                return (
                    <SubjectSelectStep
                        formData={formData}
                        nextStep={nextStep}
                        prevStep={prevStep}
                        updateFormData={updateFormData}
                    />
                );
            case 8:
                return (
                    <ConfirmationStep
                        formData={formData}
                        prevStep={prevStep}
                        setStep={setStep}
                        setFormData={setFormData}
                    />
                );
            default:
                return (
                    <div className="text-center">
                        <h1>Unknown Step</h1>
                    </div>
                );
        }

    };
    if (currentUser.is_superuser || !currentUser.is_student_or_teacher) {
        if (currentUser.user_class || currentUser.is_superuser) {
            return (
                <Container fluid className="add">
                    <Row className="h-100">
                        {/* Sidebar - Steps Panel */}
                        <Col md={4} className="sidebar d-flex flex-column align-items-center">
                            <h4 className="mt-4">Create User</h4>
                            <hr className="w-75" />
                            <ul className="step-list">
                                {steps.map(({ id, title, icon }) => (
                                    <li key={id} className={`step-item ${id === step ? "active" : id < step ? "completed" : ""}`}>
                                        <span className="icon">{icon}</span>
                                        <span className="title">{title}</span>
                                    </li>
                                ))}
                            </ul>
                            <ProgressBar now={(step / steps.length) * 100} className="mt-3 w-75" />
                        </Col>

                        {/* Step Content - Right Panel */}
                        <Col md={8}>
                            {renderStepComponent()}
                        </Col>
                    </Row>
                </Container>
            );
        } else {
            return <Navigate to="/dashboard/home" />;
        }
    }

    // Default redirection for unexpected cases
    // return <Navigate to="/dashboard/home" />;
};

