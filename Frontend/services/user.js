import api from "./interceptor";
import toast from "react-hot-toast";

const createUser = async (credentials) => {
    try {
        const response = await api.post('/user', credentials)
        return response.data
    } catch (error) {
        toast('Error fetching user data:', error)
        throw error
    }
}

export {createUser}