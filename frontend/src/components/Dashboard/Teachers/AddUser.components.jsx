import { useState } from "react";
import { useUser } from "../../../contexts/User.contexts";
import { Navigate } from "react-router-dom";
import { SelectUserTypeStep } from "./AdminComponents/AddUserTools/SelectUserTypeStep.components";
import { BasicInformationStep } from "./AdminComponents/AddUserTools/BasicInformationStep.components";
import { PasswordStep } from "./AdminComponents/AddUserTools/PasswordStep.components";
import { ProfilePictureStep } from "./AdminComponents/AddUserTools/ProfilePictureStep.components";
import { PersonalInfromationStep } from "./AdminComponents/AddUserTools/PersonalInformationStep.components";
import { ClassSelectStep } from "./AdminComponents/AddUserTools/ClassSelectStep.componets";
import { SubjectSelectStep } from "./AdminComponents/AddUserTools/SubjectSelectStep.componets";
import { ConfirmationStep } from "./AdminComponents/AddUserTools/ConfirmationStep.components";

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
        "subjects": []
    });
    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

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

        switch (step) {
            case 1:
                if (currentUser.is_superuser) {
                    return (
                        <SelectUserTypeStep
                            nextStep={nextStep}
                            updateFormData={updateFormData}
                            selectedOption={selectedOption}
                            setSelectedOption={setSelectedOption}
                        />
                    );
                }
                break; // Prevent fall-through
            case 2:
                return (
                    <BasicInformationStep
                        formData={formData}
                        updateFormData={updateFormData}
                        nextStep={nextStep}
                        prevStep={prevStep}
                    />
                );
            case 3:
                return (
                    <PasswordStep
                        formData={formData}
                        updateFormData={updateFormData}
                        nextStep={nextStep}
                        prevStep={prevStep}
                    />
                );
            case 4:
                return (
                    <ProfilePictureStep
                        formData={formData}
                        updateFormData={updateFormData}
                        nextStep={nextStep}
                        prevStep={prevStep}
                    />
                );
            case 5:
                return (
                    <PersonalInfromationStep
                        formData={formData}
                        updateFormData={updateFormData}
                        nextStep={nextStep}
                        prevStep={prevStep}
                    />
                );
            case 6:
                if (formData.is_student_or_teacher) {
                    return (
                        <ClassSelectStep
                            formData={formData}
                            updateFormData={updateFormData}
                            nextStep={nextStep}
                            prevStep={prevStep}
                        />
                    );
                }
            case 7:
                if (formData.is_student_or_teacher) {
                    return (
                        <SubjectSelectStep
                            formData={formData}
                            updateFormData={updateFormData}
                            nextStep={nextStep}
                            prevStep={prevStep}
                        />
                    );
                }
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
                        <hr />
                        <h1>Unknown Step</h1>
                        <hr />
                    </div>
                );
        }
    }

    // Default redirection for unexpected cases
    return <Navigate to="/dashboard/home" />;
};

