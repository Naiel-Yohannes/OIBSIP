import api from "./interceptor";
import toast from "react-hot-toast";

const getInventory = async () => {
    try {
        const response = await api.get('/inventory')
        return response.data
    } catch (error) {
        toast.error('Error fetching inventory data: ' + (error.response?.data?.error || error.message))
        throw error
    }
}

const createItem = async (itemData) => {
    try {
        const response = await api.post('/inventory', itemData)
        toast('Item created successfully')
        return response.data
    } catch (error) {
        toast.error('Error creating item: ' + (error.response?.data?.error || error.message))
        throw error
    }
}

const updateItem = async (id, itemData) => {
    try {
        const response = await api.put(`/inventory/${id}`, itemData)
        toast('Item updated successfully')
        return response.data
    } catch (error) {
        toast.error('Error updating item: ' + (error.response?.data?.error || error.message))
        throw error
    }
}

export { getInventory, createItem, updateItem }