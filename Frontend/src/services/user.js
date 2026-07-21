import api from "./interceptor";
import toast from "react-hot-toast";

const createUser = async (credentials) => {
    try {
        const response = await api.post('/user', credentials)
        return response.data
    } catch (error) {
        toast.error('Error fetching user data: ' + (error.response?.data?.error || error.message))
        throw error
    }
}

export {createUser}