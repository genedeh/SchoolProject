import { useMutation } from 'react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const useLogin = () => {
    const navigate = useNavigate();

    const mutation = useMutation(
        async ({ username, password }) => {
            const response = await axios.post('/api/login/', { username, password });
            return response.data;
        },
        {
            onSuccess: (data) => {
                localStorage.setItem('token', data.access);
                navigate('/dashboard/home');
            },
            onError: (error) => {
                if (error.message === "Network Error") {
                    mutation.error = "Network";
                } else {
                    mutation.error = "401";
                }
            },
        }
    );

    return mutation;
};

export default useLogin;
