import api from "./interceptor";
import toast from "react-hot-toast";

const getOrders = async () => {
    try {
        const response = await api.get('/order')
        return response.data
    } catch (error) {
        toast('Error fetching order data:', error)
        throw error
    }
}

const getOrderById = async (id) => {
    try {
        const response = await api.get(`/order/${id}`)
        return response.data
    } catch (error) {
        toast('Error fetching order data:', error)
        throw error
    }
}

const createOrder = async (orderData) => {
    try {
        const response = await api.post('/order', orderData)
        toast('Order created successfully')
        return response.data
    } catch (error) {
        toast('Error creating order:', error)
        throw error
    }
}

const updateOrder = async (id, orderData) => {
    try {
        const response = await api.put(`/order/${id}`, orderData)
        toast('Order updated successfully')
        return response.data
    } catch (error) {
        toast('Error updating order:', error)
        throw error
    }
}

export { getOrders, getOrderById, createOrder, updateOrder }