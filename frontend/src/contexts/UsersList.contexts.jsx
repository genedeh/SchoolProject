import { createContext, useEffect, useState } from 'react';
import axios from 'axios';

export const UsersListContext = createContext({
    usersList: [],
    setUsersList: () => [],
});

export const UsersListProvider = ({ children }) => {
    const [usersList, setUsersList] = useState([]);
    const value = { usersList, setUsersList };
    
    const giveUserClass = (dummyArray, response) => {
        response.data.map(async ({ classes, classrooms, id, username, profile_picture, is_student_or_teacher, birth_date, gender, address, phone_number, email }) => {
            if (classrooms) {
                const classesresponse = await axios.get(`http://127.0.0.1:8000/api/classrooms/${Number(classrooms)}`)
                dummyArray.push({
                    'id': id,
                    'username': username,
                    'profile_picture': profile_picture,
                    'is_student_or_teacher': is_student_or_teacher,
                    'birth_date': birth_date,
                    'gender': gender,
                    'user_class': classesresponse.data.name,
                    'address': address,
                    'phone_number': phone_number,
                    'email': email,
                })
            }else if (classes.length !== 0) {
                const classroomsResponse = await axios.get(`http://127.0.0.1:8000/api/classrooms/${Number(classes[0])}/`)
                dummyArray.push({
                    'id': id,
                    'username': username,
                    'profile_picture': profile_picture,
                    'is_student_or_teacher': is_student_or_teacher,
                    'birth_date': birth_date,
                    'gender': gender,
                    'user_class': classroomsResponse.data.name,
                    'address': address,
                    'phone_number': phone_number,
                    'email': email,
                })
            } else {
                dummyArray.push({
                    'id': id,
                    'username': username,
                    'profile_picture': profile_picture,
                    'is_student_or_teacher': is_student_or_teacher,
                    'birth_date': birth_date,
                    'gender': gender,
                    'user_class': "None",
                    'address': address,
                    'phone_number': phone_number,
                    'email': email,
                })
            }
        })
    }
    useEffect(() => {
        const fetchUserProfilesList = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await axios.get('http://127.0.0.1:8000/api/users/')
                    const dummyArray = []
                    giveUserClass(dummyArray, response);
                    setUsersList(dummyArray);
                } catch (err) {
                    console.error('There was an error fetching the items!', err);
                }
            }
        };
        fetchUserProfilesList();
    }, []);
    return <UsersListContext.Provider value={value}>{children}</UsersListContext.Provider>;
}
