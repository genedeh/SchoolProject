import { createContext, useEffect, useState } from 'react';
import axios from 'axios';

export const UsersListContext = createContext({
    usersList: [],
    setUsersList: () => [],
    refresh: false,
    setRefresh: () => { },
});

export const UsersListProvider = ({ children }) => {
    const [usersList, setUsersList] = useState([]);
    const [refresh, setRefresh] = useState(false)
    const value = { usersList, setUsersList, refresh, setRefresh };

    const giveUserClass = (dummyArray, response) => {
        response.data.map(async ({ classes, classrooms, id, username, profile_picture, is_student_or_teacher, birth_date, gender, address, phone_number, email, subjects }) => {
            if (classrooms) {
                dummyArray.push({
                    'id': id,
                    'username': username,
                    'profile_picture': profile_picture,
                    'is_student_or_teacher': is_student_or_teacher,
                    'birth_date': birth_date,
                    'gender': gender,
                    'user_class': classrooms.name,
                    'address': address,
                    'phone_number': phone_number,
                    'email': email,
                    'subjects': subjects
                })
            } else if (classes.length !== 0) {
                const classResponse = await axios.get(`api/classrooms/${Number(classes[0])}/`)
                dummyArray.push({
                    'id': id,
                    'username': username,
                    'profile_picture': profile_picture,
                    'is_student_or_teacher': is_student_or_teacher,
                    'birth_date': birth_date,
                    'gender': gender,
                    'user_class': classResponse.data.name,
                    'address': address,
                    'phone_number': phone_number,
                    'email': email,
                    'subjects': subjects
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
                    'subjects': subjects
                })
            }
        })
    }
    useEffect(() => {
        const fetchUserProfilesList = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await axios.get('api/users/')
                    const dummyArray = []
                    giveUserClass(dummyArray, response);
                    setUsersList(dummyArray);
                } catch (err) {
                    console.error('There was an error fetching the items!', err);
                }
            }
        };
        fetchUserProfilesList();
    }, [refresh]);
    return <UsersListContext.Provider value={value}>{children}</UsersListContext.Provider>;
}
