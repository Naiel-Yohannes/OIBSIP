import axios from 'axios'
import toast from 'react-hot-toast'

const api = axios.create({
    baseURL: 'http://localhost:3001/api'
})

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            if (error.response.status === 401) {
                localStorage.removeItem('token')
                setToken(null)
                window.location.href = '/login'
            } else if (error.response.status === 403) {
                toast.error(error.response?.data?.error || "You don't have permission to do that")
            } else if (error.response.status === 404) {
                toast.error(error.response?.data?.error || 'Resource not found')
            }
        }

        return Promise.reject(error)
    }
)

let token = localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : null

const setToken = (newToken) => {
    if (newToken) {
        token = `Bearer ${newToken}`
        localStorage.setItem('token', newToken)
    } else {
        token = null
        localStorage.removeItem('token')
    }
}

api.interceptors.request.use((config) => {
    if (token) {
        config.headers = config.headers || {}
        config.headers['Authorization'] = token
    }
    return config
})

export default api
export { setToken }