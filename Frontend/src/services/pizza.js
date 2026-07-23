import api from "./interceptor";
import toast from "react-hot-toast";

const getPizzas = async () => {
  try {
    const response = await api.get('/pizza')
    return response.data
  } catch(error){
    toast.error('Error fetching pizza data: ' + (error.response?.data?.error || error.message))
    throw error
  }
}

const getPizzaById = async (id) => {
  try {
    const response = await api.get(`/pizza/${id}`)
    return response.data
  } catch(error){
    toast.error('Error fetching pizza data: ' + (error.response?.data?.error || error.message))
    throw error
  }
}

const createPizza = async (pizzaData) => {
  try {
    const response = await api.post('/pizza', pizzaData)
    toast('Pizza created successfully')
    return response.data
  } catch(error){
    toast.error('Error creating pizza: ' + (error.response?.data?.error || error.message))
    throw error
  }
}

const updatePizza = async (id, pizzaData) => {
  try {
    const response = await api.put(`/pizza/${id}`, pizzaData)
    toast('Pizza updated successfully')
    return response.data
  } catch(error){
    toast.error('Error updating pizza: ' + (error.response?.data?.error || error.message))
    throw error
  }
}

const deletePizza = async (id) => {
  try {
    const response = await api.delete(`/pizza/${id}`)
    toast('Pizza deleted successfully')
    return response.data
  } catch(error){
    toast.error('Error deleting pizza: ' + (error.response?.data?.error || error.message))
    throw error
  }
}

export { getPizzas, getPizzaById, createPizza, updatePizza, deletePizza }

