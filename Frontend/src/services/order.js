import api from "./interceptor";
import toast from "react-hot-toast";

const getOrders = async () => {
    try {
        const response = await api.get('/order')
        return response.data
    } catch (error) {
        toast.error('Error fetching order data: ' + (error.response?.data?.error || error.message))
        throw error
    }
}

const getOrderById = async (id) => {
    try {
        const response = await api.get(`/order/${id}`)
        return response.data
    } catch (error) {
        toast.error('Error fetching order data: ' + (error.response?.data?.error || error.message))
        throw error
    }
}

const createOrder = async (orderData) => {
    try {
        const response = await api.post('/order', orderData)
        toast('Order created successfully')
        return response.data
    } catch (error) {
        toast.error('Error creating order: ' + (error.response?.data?.error || error.message))
        throw error
    }
}

const updateOrder = async (id, orderData) => {
    try {
        const response = await api.put(`/order/${id}`, orderData)
        toast('Order updated successfully')
        return response.data
    } catch (error) {
        toast.error('Error updating order: ' + (error.response?.data?.error || error.message))
        throw error
    }
}

export { getOrders, getOrderById, createOrder, updateOrder }