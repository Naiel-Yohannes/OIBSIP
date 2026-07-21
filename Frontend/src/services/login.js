import api from "./interceptor";
import toast from "react-hot-toast";

const login = async (credentials) => {
    try {
        const response = await api.post('/login', credentials)
        return response.data
    } catch (error) {
        toast.error('Error fetching auth data: ' + (error.response?.data?.error || error.message))
        throw error
    }
}

export {login}