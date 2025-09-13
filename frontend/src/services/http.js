import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export const http = axios.create({
  baseURL,
  headers: { 
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: false, // Set to false for CORS
  timeout: 10000 // 10 second timeout
})

http.interceptors.response.use(
  (response) => response,
  (error) => {
    // Centralized error handling hook
    return Promise.reject(error)
  }
)


